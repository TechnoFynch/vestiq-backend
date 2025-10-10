import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { AuthUserType } from 'src/auth/types/auth-user.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new BadRequestException('A user with this email already exists!');
    }

    let user = this.userRepository.create(createUserDto);

    try {
      user = await this.userRepository.save(user);
      const newUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };

      return {
        success: true,
        user: newUser,
      };
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request, please try later!',
      );
    }
  }

  public async findOneByEmail(email: string) {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { email: email },
      });

      return user;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(
          'The user does not exist, please check your email',
        );
      } else {
        throw new RequestTimeoutException(
          'Cannot process your request, please try later.',
        );
      }
    }
  }

  private async findOneById(id: number) {
    try {
      const user = await this.userRepository.findOneByOrFail({
        id,
      });

      return user;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(
          'The user does not exist, please check your email',
        );
      } else {
        throw new RequestTimeoutException(
          'Cannot process your request, please try later.',
        );
      }
    }
  }

  public async updateUser(
    updateUserDto: UpdateUserDto,
    id: number,
    reqUser: AuthUserType,
  ) {
    if (id !== reqUser.sub) {
      console.log('Incorrect ID', id, reqUser.sub);
      throw new UnauthorizedException(
        'You do not have sufficient permissions to perform this action.',
      );
    }

    const signedInUser = await this.findOneById(reqUser.sub);
    if (!signedInUser) {
      throw new NotFoundException('User not found');
    }

    // Check if user wants an email change
    if (updateUserDto?.email && updateUserDto.email !== signedInUser.email) {
      const existingUser = await this.userRepository.findOneBy({
        email: updateUserDto.email,
      });

      if (existingUser) {
        throw new BadRequestException('A user with this email already exists');
      }
    }

    // Apply updates safely
    signedInUser.firstName = updateUserDto.firstName ?? signedInUser.firstName;
    signedInUser.lastName = updateUserDto.lastName ?? '';
    signedInUser.email = updateUserDto.email ?? signedInUser.email;

    try {
      const updatedUser = await this.userRepository.save(signedInUser);

      return {
        success: true,
        user: {
          sub: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Could not update user');
    }
  }
}
