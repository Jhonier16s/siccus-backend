import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
    return { success: true, user };
  }
}
