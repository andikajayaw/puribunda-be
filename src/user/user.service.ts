import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all users with their relations
  async getAllUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        include: {
          unit: true, // Include related Unit
          positions: true, // Include related Position
          logins: true, // Include related Logins
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      total: totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
    };
  }

  // Get a single user by ID with their relations
  async getUserById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        unit: true,
        positions: true,
        logins: true,
      },
    });
  }

  // Create a new user
  async createUser(createUserDto: CreateUserDto) {
    const { name, username, password, joinDate, unitId, positionIds } =
      createUserDto;

    if (unitId === null || positionIds.length === 0) {
      throw new BadRequestException(`payload empty`);
    }

    const [exist] = await Promise.all([
      this.prisma.user.findUnique({
        where: { username },
      }),
    ]);
    if (exist) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Username Existed',
      });
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return await this.prisma.user.create({
      data: {
        name,
        username,
        password: hash,
        joinDate,
        unit: {
          connect: { id: unitId }, // Connect to Unit
        },
        positions: {
          connect: positionIds.map((id) => ({ id })), // Connect to multiple Jabatan
        },
      },
    });
  }

  // Create a login entry for a user
  async createLogin(userId: number) {
    return await this.prisma.login.create({
      data: {
        userId,
        timestamp: new Date(), // Record the current timestamp
      },
    });
  }

  // Get the login history of a user
  async getUserLogins(id: number) {
    return await this.prisma.login.findMany({
      where: { id },
      orderBy: { timestamp: 'desc' },
    });
  }

  // Get all users with their login counts
  async getUsersWithLoginCount() {
    return await this.prisma.user
      .findMany({
        include: {
          logins: true,
        },
      })
      .then((users) =>
        users.map((user) => ({
          id: user.id,
          name: user.name,
          jumlahLogin: user.logins.length,
        })),
      );
  }

  async getSummaryAndTopLogins(
    filter: { startDate?: string; endDate?: string },
    page: number,
    limit: number,
  ) {
    const { startDate, endDate } = filter;

    // Build filter conditions for logins
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    // Get total users and logins
    const [userCount, loginCount, unitCount, positionCount] = await Promise.all(
      [
        this.prisma.user.count(),
        this.prisma.login.count({
          where: { timestamp: dateFilter },
        }),
        this.prisma.unit.count(),
        this.prisma.position.count(),
      ],
    );

    // Pagination logic
    const skip = (page - 1) * limit;

    // Query top users with more than 25 logins
    const topUsers = await this.prisma.user.findMany({
      where: {
        logins: {
          some: {
            timestamp: dateFilter,
          },
        },
      },
      include: {
        unit: true, // Include related Unit
        positions: true, // Include related Position
        logins: true, // Include related Logins
      },
      orderBy: {
        logins: { _count: 'desc' },
      },
      skip,
      take: limit,
    });

    // Filter users with more than 25 logins
    const filteredUsers = topUsers
      .map((user) => ({
        ...user,
        loginCount: user.logins.length,
      }))
      .filter((user) => user.loginCount >= 25)
      .slice(0, 10); // Limit to top 10

    return {
      summary: {
        userCount,
        loginCount,
        unitCount,
        positionCount,
      },
      pagination: {
        page,
        limit,
        total: filteredUsers.length, // Total after filtering
      },
      topUsers: filteredUsers,
    };
  }

  async findOne(username: string) {
    return await this.prisma.user.findUnique({
      where: { username },
      include: {
        unit: true,
        positions: true,
        logins: true,
      },
    });
  }

  // Update a user and its relations
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { name, username, password, joinDate, unitId, positionIds } =
      updateUserDto;
    const userExists = await this.prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const [exist] = await Promise.all([
      this.prisma.user.findUnique({
        where: { username },
      }),
    ]);
    if (exist) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Username Existed',
      });
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return this.prisma.user.update({
      where: { id },
      data: {
        name,
        username,
        password: hash,
        joinDate,
        unit: unitId ? { connect: { id: unitId } } : undefined,
        positions: positionIds
          ? {
              set: positionIds.map((id) => ({ id })), // Replace existing positions
            }
          : undefined,
      },
      include: { unit: true, positions: true },
    });
  }

  // Delete a user
  async deleteUser(id: number) {
    const userExists = await this.prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.delete({ where: { id } });
  }
}
