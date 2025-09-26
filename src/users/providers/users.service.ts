import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { UpdateUserDto } from '../dtos/update-user.dto';

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
        data: {
          success: true,
          user: newUser,
        },
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

  public async updateUser(updateUserDto: UpdateUserDto) {
    // Check if user wants an email change
    // Check if the email exists and return error if it is existing
    // Update all the fields
  }
}
