import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgresoService {
  private readonly xpPerLevel: number;

  constructor(private prisma: PrismaService, private config: ConfigService) {
    const cfg = this.config.get<string>('XP_PER_LEVEL');
    const parsed = cfg ? parseInt(cfg, 10) : NaN;
    this.xpPerLevel = Number.isFinite(parsed) && parsed > 0 ? parsed : 100; // default 100
  }

  async getUsuarioXpTotal(idUsuario: number) {
    const user = await this.prisma.usuario.findUnique({ where: { id_usuario: idUsuario } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const agg = await this.prisma.progreso.aggregate({
      _sum: { xp: true },
      where: { id_usuario: idUsuario },
    });
    return { xpTotal: agg._sum.xp ?? 0 };
  }

  async getUsuarioHistorial(idUsuario: number) {
    const user = await this.prisma.usuario.findUnique({ where: { id_usuario: idUsuario } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return this.prisma.progreso.findMany({
      where: { id_usuario: idUsuario },
      orderBy: { fecha: 'desc' },
      select: { id_progreso: true, xp: true, energia: true, salud: true, nivel: true, fecha: true },
    });
  }

  async getUsuarioResumen(idUsuario: number) {
    const user = await this.prisma.usuario.findUnique({ where: { id_usuario: idUsuario } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const agg = await this.prisma.progreso.aggregate({
      _sum: { xp: true, energia: true, salud: true },
      where: { id_usuario: idUsuario },
    });

    const xpTotal = agg._sum.xp ?? 0;
    const energiaTotal = agg._sum.energia ?? 0;
    const saludTotal = agg._sum.salud ?? 0;

    // Regla: nivel mínimo 1; cada xpPerLevel XP sube un nivel
    const xpPerLevel = this.xpPerLevel;
    const nivel = Math.max(1, Math.floor(xpTotal / xpPerLevel) + 1);
    const xpForCurrentLevelStart = (nivel - 1) * xpPerLevel;
    const xpForNextLevel = nivel * xpPerLevel;
    const xpIntoLevel = Math.max(0, xpTotal - xpForCurrentLevelStart);
    const xpToNext = Math.max(0, xpForNextLevel - xpTotal);
    const progressPct = xpPerLevel > 0 ? Math.min(100, Math.round((xpIntoLevel / xpPerLevel) * 100)) : 0;

    return {
      xpTotal,
      energiaTotal,
      saludTotal,
      nivel,
      nextLevel: nivel + 1,
      xpPerLevel,
      xpForCurrentLevelStart,
      xpForNextLevel,
      xpIntoLevel,
      xpToNext,
      progressPct,
    };
  }
}
