import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get users with their login counts
  @Get('/with-login-count')
  async getUsersWithLoginCount() {
    return this.userService.getUsersWithLoginCount();
  }

  @UseGuards(AuthGuard)
  @Get('/summary-top-logins')
  async getSummaryAndTopLogins(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException('Page and limit must be valid numbers.');
    }

    return this.userService.getSummaryAndTopLogins(
      { startDate, endDate },
      pageNumber,
      limitNumber,
    );
  }

  // Get all users with relations
  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.getAllUsers(Number(page), Number(limit));
  }

  // Get a user by ID with relations
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  // Create a new user
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // Create a login entry for a user
  @Post(':id/login')
  async createLogin(@Param('id', ParseIntPipe) id: number) {
    return this.userService.createLogin(id);
  }

  // Get login history of a user
  @Get(':id/logins')
  async getUserLogins(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserLogins(id);
  }

  // Update a user and its relations
  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  // Delete a user
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
