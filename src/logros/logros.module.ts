import { Module } from '@nestjs/common';
import { LogrosController } from './logros.controller';
import { LogrosService } from './logros.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LogrosController],
  providers: [LogrosService],
})
export class LogrosModule {}
