import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMisionDto } from './dto/create-mision.dto';
import { UpdateMisionDto } from './dto/update-mision.dto';

@Injectable()
export class MisionesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMisionDto) {
    const mision = await this.prisma.mision.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        xp: dto.xp,
        completada: dto.completada ?? false,
        bloqueada: dto.bloqueada ?? false,
      },
      select: {
        id_mision: true,
        nombre: true,
        descripcion: true,
        xp: true,
        completada: true,
        bloqueada: true,
      },
    });
    return mision;
  }

  async findAll() {
    return this.prisma.mision.findMany({
      select: { id_mision: true, nombre: true, descripcion: true, xp: true, completada: true, bloqueada: true },
      orderBy: { id_mision: 'asc' },
    });
  }

  async findOne(id: number) {
    const m = await this.prisma.mision.findUnique({
      where: { id_mision: id },
      select: { id_mision: true, nombre: true, descripcion: true, xp: true, completada: true, bloqueada: true },
    });
    if (!m) throw new NotFoundException('Misión no encontrada');
    return m;
  }

  async update(id: number, dto: UpdateMisionDto) {
    try {
      return await this.prisma.mision.update({
        where: { id_mision: id },
        data: {
          nombre: dto.nombre,
          descripcion: dto.descripcion,
          xp: dto.xp,
          completada: dto.completada,
          bloqueada: dto.bloqueada,
        },
        select: { id_mision: true, nombre: true, descripcion: true, xp: true, completada: true, bloqueada: true },
      });
    } catch (e) {
      throw new NotFoundException('Misión no encontrada');
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.mision.delete({ where: { id_mision: id } });
      return { success: true };
    } catch (e) {
      throw new NotFoundException('Misión no encontrada');
    }
  }
}
