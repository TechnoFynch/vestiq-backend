import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashingProvider } from './providers/hashing.provider';
import { JwtModule } from '@nestjs/jwt';
import { noop } from 'rxjs';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { AuthGuard } from './guards/auth.guard';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    AuthGuard,
  ],
  imports: [
    UsersModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [AuthGuard],
})
export class AuthModule {}
