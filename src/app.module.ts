import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PerfilSaludModule } from './perfil-salud/perfil-salud.module';
import { LogrosModule } from './logros/logros.module';
import { MisionesModule } from './misiones/misiones.module';
import { MisionesUsuarioModule } from './misiones-usuario/misiones-usuario.module';
import { ProgresoModule } from './progreso/progreso.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
  PerfilSaludModule,
  LogrosModule,
  MisionesModule,
  MisionesUsuarioModule,
  ProgresoModule,
    AuthModule,
  ],
})
export class AppModule {}