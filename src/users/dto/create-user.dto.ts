import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: 'Juan Pérez' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'juan@example.com' })
  email: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '+57 3001234567' })
  phone?: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ minLength: 6, example: 'Secreta123' })
  password: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'usuario' })
  role?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'https://mi.cdn.com/avatars/juan.png' })
  avatarUrl?: string;
}
