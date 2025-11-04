import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AssignMisionUsuarioDto {
  @ApiProperty({ example: 1, description: 'ID del usuario al que se asigna la misión' })
  @IsInt()
  @Min(1)
  idUsuario: number;

  @ApiProperty({ example: 5, description: 'ID de la misión a asignar' })
  @IsInt()
  @Min(1)
  idMision: number;
}
