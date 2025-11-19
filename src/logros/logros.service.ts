import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogroDto } from './dto/create-logro.dto';
import { UpdateLogroDto } from './dto/update-logro.dto';

@Injectable()
export class LogrosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLogroDto) {
    const logro = await this.prisma.logro.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        puntos_xp: dto.puntosXp,
      },
      select: {
        id_logro: true,
        nombre: true,
        descripcion: true,
        puntos_xp: true,
        icono: true,
      },
    });
    return logro;
  }

  async findAll() {
    return this.prisma.logro.findMany({
      select: { id_logro: true, nombre: true, descripcion: true, puntos_xp: true, icono: true },
      orderBy: { id_logro: 'asc' },
    });
  }

  async findOne(id: number) {
    const logro = await this.prisma.logro.findUnique({
      where: { id_logro: id },
      select: { id_logro: true, nombre: true, descripcion: true, puntos_xp: true, icono: true },
    });
    if (!logro) throw new NotFoundException('Logro no encontrado');
    return logro;
  }

  async update(id: number, dto: UpdateLogroDto) {
    try {
      return await this.prisma.logro.update({
        where: { id_logro: id },
        data: {
          nombre: dto.nombre,
          descripcion: dto.descripcion,
          puntos_xp: dto.puntosXp,
        },
        select: { id_logro: true, nombre: true, descripcion: true, puntos_xp: true, icono: true },
      });
    } catch (e) {
      throw new NotFoundException('Logro no encontrado');
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.logro.delete({ where: { id_logro: id } });
      return { success: true };
    } catch (e) {
      throw new NotFoundException('Logro no encontrado');
    }
  }

  // ⭐ OBTENER LOGROS DE UN USUARIO CON RELACIONES
  async obtenerLogrosDeUsuario(idUsuario: number) {
    return this.prisma.logroUsuario.findMany({
      where: { id_usuario: idUsuario },
      include: { logro: true }, // Incluye los datos completos del logro
    });
  }
}