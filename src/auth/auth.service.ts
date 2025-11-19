import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(email);
    if (user && user.contrasena && await bcrypt.compare(password, user.contrasena)) {
      const { contrasena, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      return { success: false, message: 'Credenciales inválidas' };
    }
    const payload = { sub: user.id_usuario, email: user.email, role: user.rol };
    const access_token = await this.jwtService.signAsync(payload);
    
    // Extract perfilModelo from nested perfil_salud if available
    const perfilModelo = user.perfil_salud?.perfilModelo ?? null;
    const { perfil_salud, ...userWithoutPerfil } = user;
    
    return { 
      success: true, 
      access_token, 
      user: { ...userWithoutPerfil, perfilModelo } 
    };
  }
}
