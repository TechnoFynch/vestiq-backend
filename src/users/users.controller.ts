import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Req,
} from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import type { Request } from 'express';
import { AuthUserType } from 'src/auth/types/auth-user.type';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  public async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: Request,
  ) {
    const user = req.user as AuthUserType;
    return this.usersService.updateUser(updateUserDto, id, user);
  }
}
