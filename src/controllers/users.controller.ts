import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from '../service';
import { LoginDto, UserDto } from '../models';
import { UserAlreadyExists, UserNotFound, WrongSuperpassError } from '../shared';

@Controller({ path: '/' })
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('/users')
  async createUser(@Body() body: UserDto) {
    try {
      const result = await this.userService.createUser(body, "Customer");
      return result;
    } catch (err) {
      if (err instanceof UserAlreadyExists) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Post('/drivers')
  async createDriver(@Body() body: UserDto) {
    try {
      const result = await this.userService.createUser(body, "Driver");
      return result;
    } catch (err) {
      if (err instanceof UserAlreadyExists) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Post('/admin')
  async createAdmin(
    @Req() req,
    @Body() body: UserDto
    ) {
    try {
      const result = await this.userService.createUser(body, "Admin", req.headers.authorization);
      return result;
    } catch (err) {
      if (err instanceof UserAlreadyExists || err instanceof WrongSuperpassError) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }





  @Post('/login')
  async login(@Body() body: LoginDto) {
    try {
      const result = await this.userService.login(body);
      return { token: result };
    } catch (err) {
      if (err instanceof UserNotFound) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Get('/')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
