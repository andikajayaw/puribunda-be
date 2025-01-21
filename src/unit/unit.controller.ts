import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { UnitService } from './unit.service';

@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  async create(@Body('name') name: string) {
    return this.unitService.create(name);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.unitService.findAll(Number(page), Number(limit));
  }

  @Get('/getUnits')
  async getAllUnits() {
    return this.unitService.getAllUnits();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.unitService.findOne(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body('name') name: string) {
    return this.unitService.update(Number(id), name);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.unitService.remove(Number(id));
  }
}
