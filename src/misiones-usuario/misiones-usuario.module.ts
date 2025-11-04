import { Module } from '@nestjs/common';
import { MisionesUsuarioService } from './misiones-usuario.service';
import { MisionesUsuarioController } from './misiones-usuario.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MisionesUsuarioController],
  providers: [MisionesUsuarioService],
})
export class MisionesUsuarioModule {}
