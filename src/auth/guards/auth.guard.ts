import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import type { UserRoleEnum } from 'src/users/enums/user-role.enum';
import type { AuthUserType } from '../types/auth-user.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getClass(),
      context.getHandler(),
    ]);
    if (isPublic) return true;

    const authHeader = request.headers.authorization;

    if (!authHeader)
      throw new UnauthorizedException(
        'You do not have access to this resource',
      );

    const token = authHeader.split(' ')[1];

    if (!token)
      throw new UnauthorizedException(
        'You do not have access to this resource',
      );

    try {
      const user: AuthUserType = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret,
      });

      request.user = user;

      const requiredRole = this.reflector.getAllAndOverride<UserRoleEnum>(
        'role',
        [context.getClass(), context.getHandler()],
      );

      if (requiredRole && user.role !== requiredRole) {
        throw new ForbiddenException('Insufficient permissions');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
