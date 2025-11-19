import { IsInt, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePerfilSaludDto {
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ example: 1, description: 'ID del usuario al que pertenece el perfil' })
  idUsuario: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(150)
  @ApiPropertyOptional({ example: 25 })
  edad?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Type(() => Number)
  @ApiPropertyOptional({ example: 70.5, description: 'Peso en kilogramos' })
  peso?: number; // en kg

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Type(() => Number)
  @ApiPropertyOptional({ example: 1.75, description: 'Altura en metros' })
  altura?: number; // en metros

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Bajar grasa' })
  objetivo?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'male', description: 'Género reportado por el usuario (solo se usa para el microservicio de clasificación)' })
  genero?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 22.98, description: 'IMC (si no se envía y hay peso/altura, se calcula)' })
  imc?: number; // si no viene y hay peso/altura, lo calculamos

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 1, description: '1 si hubo antecedente de sobrepeso en la niñez, 0 en caso contrario' })
  antecedenteSobrepeso?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 8, description: 'Cantidad de vasos de agua en horario 20:00 (agua_ch20_a)' })
  aguaCh20A?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 3, description: 'Nivel de actividad física declarado por el usuario' })
  nivelActividad?: number;
}
