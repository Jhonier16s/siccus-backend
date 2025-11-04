import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateMisionDto {
  @IsString()
  @ApiProperty({ example: 'Camina 10 minutos' })
  nombre: string;

  @IsString()
  @ApiProperty({ example: 'Completa una caminata corta para empezar.' })
  descripcion: string;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 25, description: 'XP que otorga completar la misión' })
  xp: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: false, description: 'Marca si ya está completada' })
  completada?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: false, description: 'Indica si la misión está bloqueada' })
  bloqueada?: boolean;
}
