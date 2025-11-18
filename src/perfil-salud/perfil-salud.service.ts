import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePerfilSaludDto } from './dto/create-perfil-salud.dto';
import { UpdatePerfilSaludDto } from './dto/update-perfil-salud.dto';

type PredictPayload = {
  Age: number;
  Gender: string;
  Height: number;
  Weight: number;
  CH2O: number;
  family_history_with_overweight: string;
  FAF: number;
};

@Injectable()
export class PerfilSaludService {
  private readonly logger = new Logger(PerfilSaludService.name);
  private readonly modelEndpoint =
    process.env.PYTHON_MODEL_URL ?? 'http://127.0.0.1:5000/predict_cluster';

  constructor(private prisma: PrismaService, private http: HttpService) {}

  private computeImc(peso?: number | null, altura?: number | null): number | null {
    if (!peso || !altura || altura <= 0) return null;
    const imc = peso / (altura * altura);
    return Math.round(imc * 100) / 100; 
    }

  async upsert(dto: CreatePerfilSaludDto) {
    const imc = dto.imc ?? this.computeImc(dto.peso ?? null, dto.altura ?? null);
    let shouldCallModel = false;
    const perfil = await this.prisma.$transaction(async (tx) => {
      const perfil = await tx.perfilSalud.upsert({
        where: { id_usuario: dto.idUsuario },
        create: {
          id_usuario: dto.idUsuario,
          edad: dto.edad,
          peso: dto.peso as any,
          altura: dto.altura as any,
          objetivo: dto.objetivo,
          imc: imc as any,
          antecedenteSobrepeso: dto.antecedenteSobrepeso,
          aguaCh20A: dto.aguaCh20A,
          nivelActividad: dto.nivelActividad,
        },
        update: {
          edad: dto.edad,
          peso: dto.peso as any,
          altura: dto.altura as any,
          objetivo: dto.objetivo,
          imc: imc as any,
          antecedenteSobrepeso: dto.antecedenteSobrepeso,
          aguaCh20A: dto.aguaCh20A,
          nivelActividad: dto.nivelActividad,
        },
        select: {
          id_perfil: true,
          id_usuario: true,
          edad: true,
          peso: true,
          altura: true,
          objetivo: true,
          imc: true,
          antecedenteSobrepeso: true,
          aguaCh20A: true,
          nivelActividad: true,
          fecha_creacion: true,
        },
      });
      
      const usuario = await tx.usuario.findUnique({
        where: { id_usuario: dto.idUsuario },
        select: { onboardingCompleto: true },
      });

      if (usuario && !usuario.onboardingCompleto) {
        shouldCallModel = true;
        await tx.usuario.update({
          where: { id_usuario: dto.idUsuario },
          data: { onboardingCompleto: true },
          select: { id_usuario: true },
        });
      }

      return perfil;
    });

    if (!shouldCallModel) {
      return { ...perfil, dataModel: null };
    }

    const payload = this.buildModelPayload(dto, perfil);
    if (!payload) {
      this.logger.warn('Skipping model request due to missing fields in payload');
      return { ...perfil, dataModel: null };
    }

    const dataModel = await this.requestPrediction(payload);
    return { ...perfil, dataModel };
  }

  async findByUserId(idUsuario: number) {
    const perfil = await this.prisma.perfilSalud.findUnique({
      where: { id_usuario: idUsuario },
      select: {
        id_perfil: true,
        id_usuario: true,
        edad: true,
        peso: true,
        altura: true,
        objetivo: true,
        imc: true,
        antecedenteSobrepeso: true,
        aguaCh20A: true,
        nivelActividad: true,
        fecha_creacion: true,
      },
    });
    if (!perfil) throw new NotFoundException('Perfil de salud no encontrado');
    return perfil;
  }

  async update(idUsuario: number, dto: UpdatePerfilSaludDto) {
    const imc = dto.imc ?? this.computeImc(dto.peso ?? null, dto.altura ?? null);
    try {
      return await this.prisma.perfilSalud.update({
        where: { id_usuario: idUsuario },
        data: {
          edad: dto.edad,
          peso: dto.peso as any,
          altura: dto.altura as any,
          objetivo: dto.objetivo,
          imc: imc as any,
          antecedenteSobrepeso: dto.antecedenteSobrepeso,
          aguaCh20A: dto.aguaCh20A,
          nivelActividad: dto.nivelActividad,
        },
        select: {
          id_perfil: true,
          id_usuario: true,
          edad: true,
          peso: true,
          altura: true,
          objetivo: true,
          imc: true,
          antecedenteSobrepeso: true,
          aguaCh20A: true,
          nivelActividad: true,
          fecha_creacion: true,
        },
      });
    } catch (e) {
      // Si no existe, Prisma lanza error: lo convertimos en 404
      throw new NotFoundException('Perfil de salud no encontrado');
    }
  }

  private buildModelPayload(dto: CreatePerfilSaludDto, perfil: any): PredictPayload | null {
    const age = dto.edad ?? perfil?.edad ?? undefined;
    const height = dto.altura ?? this.toNumber(perfil?.altura);
    const weight = dto.peso ?? this.toNumber(perfil?.peso);
    const ch2o = dto.aguaCh20A ?? perfil?.aguaCh20A ?? undefined;
    const faf = dto.nivelActividad ?? perfil?.nivelActividad ?? undefined;
    const antecedente = dto.antecedenteSobrepeso ?? perfil?.antecedenteSobrepeso ?? undefined;
    const gender = this.normalizeGender(dto.genero);

    if ([age, height, weight, ch2o, faf].some((value) => value === undefined || value === null)) {
      return null;
    }

    const ageValue = age as number;
    const heightValue = height as number;
    const weightValue = weight as number;
    const ch2oValue = ch2o as number;
    const fafValue = faf as number;

    return {
      Age: ageValue,
      Gender: gender,
      Height: heightValue,
      Weight: weightValue,
      CH2O: ch2oValue,
      family_history_with_overweight: antecedente === 1 ? 'yes' : 'no',
      FAF: fafValue,
    };
  }

  private async requestPrediction(payload: PredictPayload) {
    try {
      const response = await firstValueFrom(
        this.http.post(this.modelEndpoint, payload, { timeout: 5000 }),
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error calling python microservicio: ${error.message}`, error.stack);
      } else {
        this.logger.error('Error calling python microservicio', JSON.stringify(error));
      }
      return null;
    }
  }

  private toNumber(value: unknown): number | undefined {
    if (value === null || value === undefined) return undefined;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    if (typeof value === 'object' && 'toNumber' in (value as any)) {
      const result = (value as { toNumber: () => number }).toNumber();
      return Number.isNaN(result) ? undefined : result;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  private normalizeGender(value?: string): string {
    if (!value) return 'unknown';
    return value.trim().toLowerCase();
  }
}
