import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PositionService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all Positions
  async getAllPositions(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [positions, totalPositions] = await Promise.all([
      this.prisma.position.findMany({
        skip,
        take: limit,
        include: {
          users: true,
        },
      }),
      this.prisma.position.count(),
    ]);
    return {
      data: positions,
      total: totalPositions,
      page,
      limit,
      totalPages: Math.ceil(totalPositions / limit),
    };
  }

  // Get all Positions
  async getPositions() {
    const [positions] = await Promise.all([this.prisma.position.findMany()]);
    return {
      data: positions,
    };
  }

  // Get a specific Position by ID
  async getPositionById(id: number) {
    return this.prisma.position.findUnique({
      where: { id },
    });
  }

  // Create a new Position
  async createPosition(name: string) {
    const [exist] = await Promise.all([
      this.prisma.position.findUnique({
        where: { name },
      }),
    ]);
    if (exist) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Data Existed',
      });
    }
    return this.prisma.position.create({
      data: { name },
    });
  }

  // Update a Position
  async updatePosition(id: number, name: string) {
    const [exist] = await Promise.all([
      this.prisma.position.findUnique({
        where: { name },
      }),
    ]);
    if (exist) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Data Existed',
      });
    }
    return this.prisma.position.update({
      where: { id },
      data: { name },
    });
  }

  // Delete a Position
  async deletePosition(id: number) {
    return this.prisma.position.delete({
      where: { id },
    });
  }

  // Get all Users for a Position
  async getUsersForPosition(id: number) {
    return this.prisma.position.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });
  }
}
