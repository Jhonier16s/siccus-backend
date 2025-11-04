import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'juan@example.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ minLength: 6, example: 'Secreta123' })
  password: string;
}
