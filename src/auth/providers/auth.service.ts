import {
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/sign-in.dto';
import { UsersService } from 'src/users/providers/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { HashingProvider } from './hashing.provider';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
  ) {}

  public async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);

    let isAuth = false;

    try {
      isAuth = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare password',
      });
    }

    if (!isAuth) {
      throw new UnauthorizedException('Incorrect credentials');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        user: {
          sub: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );

    return {
      success: true,
      accessToken,
    };
  }

  public async register(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashingProvider.hashPassword(
      createUserDto.password,
    );

    return await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }
}
