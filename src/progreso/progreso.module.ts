import { Module } from '@nestjs/common';
import { ProgresoController } from './progreso.controller';
import { ProgresoService } from './progreso.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProgresoController],
  providers: [ProgresoService],
})
export class ProgresoModule {}
