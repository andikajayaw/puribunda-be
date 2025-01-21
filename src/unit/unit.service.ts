import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UnitService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a unit
  async create(name: string) {
    const [exist] = await Promise.all([
      this.prisma.unit.findUnique({
        where: { name },
      }),
    ]);
    if (exist) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Data Existed',
      });
    }

    return this.prisma.unit.create({
      data: { name },
    });
  }

  // Get all units
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [units, totalUnits] = await Promise.all([
      this.prisma.unit.findMany({
        skip,
        take: limit,
        include: {
          users: true,
        },
      }),
      this.prisma.unit.count(),
    ]);
    return {
      data: units,
      total: totalUnits,
      page,
      limit,
      totalPages: Math.ceil(totalUnits / limit),
    };
  }

  // Get all units
  async getAllUnits() {
    const [units] = await Promise.all([this.prisma.unit.findMany()]);
    return {
      data: units,
    };
  }

  // Get a single unit
  async findOne(id: number) {
    return this.prisma.unit.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });
  }

  // Update a unit
  async update(id: number, name: string) {
    const [exist] = await Promise.all([
      this.prisma.unit.findUnique({
        where: { name },
      }),
    ]);
    if (exist) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Data Existed',
      });
    }
    return this.prisma.unit.update({
      where: { id },
      data: { name },
    });
  }

  // Delete a unit
  async remove(id: number) {
    return this.prisma.unit.delete({
      where: { id },
    });
  }
}
