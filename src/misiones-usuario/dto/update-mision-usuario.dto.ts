import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export enum MisionEstadoDto {
  PENDIENTE = 'PENDIENTE',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADA = 'COMPLETADA',
}

export class UpdateMisionUsuarioDto {
  @ApiPropertyOptional({ enum: MisionEstadoDto, description: 'Nuevo estado de la misión para el usuario' })
  @IsOptional()
  @IsEnum(MisionEstadoDto)
  estado?: MisionEstadoDto;

  @ApiPropertyOptional({ example: 50, description: 'Progreso (0-100). Opcional, depende de la misión' })
  @IsOptional()
  @IsInt()
  @Min(0)
  progreso?: number;
}
