import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MisionesService } from './misiones.service';
import { MisionesController } from './misiones.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MisionesController],
  providers: [MisionesService],
})
export class MisionesModule {}
