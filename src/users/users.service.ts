import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.usuario.create({
      data: {
        nombre: dto.name,
        email: dto.email,
        telefono: dto.phone,
        contrasena: hashedPassword,
        rol: dto.role ?? 'usuario',
      },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        telefono: true,
        rol: true,
        fecha_registro: true,
      },
    });

    return user;
  }
  async findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        telefono: true,
        rol: true,
        fecha_registro: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id_usuario: id },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        telefono: true,
        rol: true,
        fecha_registro: true,
      },
    });
  }
  async update(id: number, dto: UpdateUserDto) {
    const data: any = { ...dto };

    if (dto.password) {
      data.contrasena = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.usuario.update({
      where: { id_usuario: id },
      data: {
        nombre: dto.name,
        email: dto.email,
        telefono: dto.phone,
        contrasena: data.contrasena,
        rol: dto.role,
      },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        telefono: true,
        rol: true,
        fecha_registro: true,
      },
    });
  }
  async remove(id: number) {
    return this.prisma.usuario.delete({ where: { id_usuario: id } });
  }
}
