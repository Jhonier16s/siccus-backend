import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET') ?? 'dev-secret';
        const envExpires = config.get<string>('JWT_EXPIRES_IN');

        // Si JWT_EXPIRES_IN es numérico, lo usamos (en segundos). Si no, el token NO expira.
        const signOptions: Record<string, any> = {};
        if (envExpires && !isNaN(Number(envExpires))) {
          signOptions.expiresIn = Number(envExpires);
        }

        return {
          secret,
          signOptions,
        };
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
