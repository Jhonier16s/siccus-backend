import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { PerfilSaludController } from './perfil-salud.controller';
import { PerfilSaludService } from './perfil-salud.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [PerfilSaludController],
  providers: [PerfilSaludService],
})
export class PerfilSaludModule {}
