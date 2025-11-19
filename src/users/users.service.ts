import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateUserDto) {
    // Validación previa para evitar error 500 por email duplicado
    const exists = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
      select: { id_usuario: true },
    });
    if (exists) {
      throw new ConflictException('El email ya está registrado');
    }
    let defaultAvatar = "https://models.readyplayer.me/690a70674f27e069d91fccdd.glb"
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.prisma.usuario.create({
        data: {
          nombre: dto.name,
          email: dto.email,
          telefono: dto.phone,
          contrasena: hashedPassword,
          rol: dto.role ?? 'usuario',
          avatarUrl: dto?.avatarUrl ?? defaultAvatar,
        },
        select: {
          id_usuario: true,
          nombre: true,
          email: true,
          telefono: true,
          rol: true,
          fecha_registro: true,
          avatarUrl: true,
        },
      });
      return user;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        // Índice único violado (p.ej., email duplicado)
        throw new ConflictException('El email ya está registrado');
      }
      throw err;
    }
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
        avatarUrl: true,
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
        avatarUrl: true,
      },
    });
  }

  async findOneByUsername(email: string) {
    // Incluye la contraseña para validación de login
    return this.prisma.usuario.findUnique({
      where: { email },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        telefono: true,
        rol: true,
        fecha_registro: true,
        contrasena: true,
        avatarUrl: true,
        onboardingCompleto: true,
        perfil_salud: {
          select: {
            perfilModelo: true,
          },
        },
      },
    });
  }
  async update(id: number, dto: UpdateUserDto) {
    const data: any = { ...dto };

    if (dto.password) {
      data.contrasena = await bcrypt.hash(dto.password, 10);
    }

    // Si envían un email nuevo, validamos que no esté en uso por otro usuario
    if (dto.email) {
      const existsWithEmail = await this.prisma.usuario.findFirst({
        where: { email: dto.email, NOT: { id_usuario: id } },
        select: { id_usuario: true },
      });
      if (existsWithEmail) {
        throw new ConflictException('El email ya está registrado por otro usuario');
      }
    }

    try {
      return await this.prisma.usuario.update({
        where: { id_usuario: id },
        data: {
          nombre: dto.name,
          email: dto.email,
          telefono: dto.phone,
          contrasena: data.contrasena,
          rol: dto.role,
          avatarUrl: dto.avatarUrl,
        },
        select: {
          id_usuario: true,
          nombre: true,
          email: true,
          telefono: true,
          rol: true,
          fecha_registro: true,
          avatarUrl: true,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('El email ya está registrado');
      }
      throw err;
    }
  }
  async remove(id: number) {
    return this.prisma.usuario.delete({ where: { id_usuario: id } });
  }
}
