import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePerfilSaludDto } from './dto/create-perfil-salud.dto';
import { UpdatePerfilSaludDto } from './dto/update-perfil-salud.dto';

@Injectable()
export class PerfilSaludService {
  constructor(private prisma: PrismaService) {}

  private computeImc(peso?: number | null, altura?: number | null): number | null {
    if (!peso || !altura || altura <= 0) return null;
    const imc = peso / (altura * altura);
    return Math.round(imc * 100) / 100; // redondeo a 2 decimales
    }

  async upsert(dto: CreatePerfilSaludDto) {
    const imc = dto.imc ?? this.computeImc(dto.peso ?? null, dto.altura ?? null);
    return this.prisma.perfilSalud.upsert({
      where: { id_usuario: dto.idUsuario },
      create: {
        id_usuario: dto.idUsuario,
        edad: dto.edad,
        peso: dto.peso as any,
        altura: dto.altura as any,
        objetivo: dto.objetivo,
        imc: imc as any,
      },
      update: {
        edad: dto.edad,
        peso: dto.peso as any,
        altura: dto.altura as any,
        objetivo: dto.objetivo,
        imc: imc as any,
      },
      select: {
        id_perfil: true,
        id_usuario: true,
        edad: true,
        peso: true,
        altura: true,
        objetivo: true,
        imc: true,
        fecha_creacion: true,
      },
    });
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
        },
        select: {
          id_perfil: true,
          id_usuario: true,
          edad: true,
          peso: true,
          altura: true,
          objetivo: true,
          imc: true,
          fecha_creacion: true,
        },
      });
    } catch (e) {
      // Si no existe, Prisma lanza error: lo convertimos en 404
      throw new NotFoundException('Perfil de salud no encontrado');
    }
  }
}
