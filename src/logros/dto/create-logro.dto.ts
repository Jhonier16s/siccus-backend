import { IsInt, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLogroDto {
  @IsString()
  @ApiProperty({ example: 'Primer paso' })
  nombre: string;

  @IsString()
  @ApiProperty({ example: 'Completa tu primer entrenamiento' })
  descripcion: string;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 50, description: 'Puntos de experiencia otorgados' })
  puntosXp: number;
}
