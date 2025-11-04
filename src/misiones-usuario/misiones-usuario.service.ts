import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignMisionUsuarioDto } from './dto/assign-mision-usuario.dto';
import { UpdateMisionUsuarioDto, MisionEstadoDto } from './dto/update-mision-usuario.dto';

@Injectable()
export class MisionesUsuarioService {
  constructor(private prisma: PrismaService) {}

  async assign(dto: AssignMisionUsuarioDto) {
    const { idUsuario, idMision } = dto;

    // Verificar existencia de usuario y misión
    const [usuario, mision] = await Promise.all([
      this.prisma.usuario.findUnique({ where: { id_usuario: idUsuario } }),
      this.prisma.mision.findUnique({ where: { id_mision: idMision } }),
    ]);

    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    if (!mision) throw new NotFoundException('Misión no encontrada');
    if (mision.bloqueada) throw new BadRequestException('La misión está bloqueada y no puede asignarse');

    // Prevenir duplicados por restricción única
    const existing = await this.prisma.misionUsuario.findUnique({
      where: { id_usuario_id_mision: { id_usuario: idUsuario, id_mision: idMision } },
    });
    if (existing) throw new ConflictException('La misión ya fue asignada a este usuario');

    return this.prisma.misionUsuario.create({
      data: {
        id_usuario: idUsuario,
        id_mision: idMision,
      },
      include: { mision: true },
    });
  }

  async listByUser(idUsuario: number) {
    // Retornar asignaciones con info de la misión
    return this.prisma.misionUsuario.findMany({
      where: { id_usuario: idUsuario },
      include: { mision: true },
      orderBy: { fecha_asignacion: 'desc' },
    });
  }

  async update(idMisionUsuario: number, dto: UpdateMisionUsuarioDto) {
    const current = await this.prisma.misionUsuario.findUnique({
      where: { id_mision_usuario: idMisionUsuario },
      include: { mision: true },
    });
    if (!current) throw new NotFoundException('Asignación de misión no encontrada');

    const updates: any = {};
    if (dto.progreso !== undefined) updates.progreso = dto.progreso;

    // Completar misión: si pasa a COMPLETADA y antes no lo estaba, otorgar XP
    if (dto.estado === MisionEstadoDto.COMPLETADA && current.estado !== 'COMPLETADA') {
      const now = new Date();
      return this.prisma.$transaction(async (tx) => {
        const updated = await tx.misionUsuario.update({
          where: { id_mision_usuario: idMisionUsuario },
          data: { ...updates, estado: 'COMPLETADA', completada_at: now },
          include: { mision: true },
        });

        // Registrar el incremento de XP en Progreso
        await tx.progreso.create({
          data: {
            id_usuario: current.id_usuario,
            xp: current.mision.xp,
            // energia/salud/nivel usan defaults
          },
        });

        return updated;
      });
    }

    // Cambio de estado simple o progreso
    if (dto.estado) updates.estado = dto.estado;

    return this.prisma.misionUsuario.update({
      where: { id_mision_usuario: idMisionUsuario },
      data: updates,
      include: { mision: true },
    });
  }

  async unassign(idMisionUsuario: number) {
    // Eliminar relación (no afecta XP ya otorgado)
    try {
      return await this.prisma.misionUsuario.delete({
        where: { id_mision_usuario: idMisionUsuario },
      });
    } catch (e) {
      throw new NotFoundException('Asignación de misión no encontrada');
    }
  }
}
