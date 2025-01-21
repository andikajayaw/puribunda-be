import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { PositionService } from './position.service';

@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  // Get all Positions
  @Get()
  async getAllPositions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.positionService.getAllPositions(Number(page), Number(limit));
  }

  @Get('/getPositions')
  async getPositions() {
    return this.positionService.getPositions();
  }

  // Get a specific Position by ID
  @Get(':id')
  async getPositionById(@Param('id') id: number) {
    return this.positionService.getPositionById(Number(id));
  }

  // Create a new Position
  @Post()
  async createPosition(@Body('name') name: string) {
    return this.positionService.createPosition(name);
  }

  // Update a Position
  @Put(':id')
  async updatePosition(@Param('id') id: number, @Body('name') name: string) {
    return this.positionService.updatePosition(Number(id), name);
  }

  // Delete a Position
  @Delete(':id')
  async deletePosition(@Param('id') id: number) {
    return this.positionService.deletePosition(Number(id));
  }

  // Get all Users for a Position
  @Get(':id/users')
  async getUsersForPosition(@Param('id') id: number) {
    return this.positionService.getUsersForPosition(Number(id));
  }
}
