import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private usersService: UserService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    // Validate password
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user && isPasswordValid) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  // Validate User (used by JwtStrategy)
  async validate(userId: number) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async login(user: any) {
    const payload = { username: user.username, id: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // User Sign-In
  async signIn(username: string, password: string) {
    // Find user by email
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Increment login count
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        jumlahLogin: {
          increment: 1,
        },
        logins: {
          create: {
            timestamp: new Date(),
          },
        },
      },
    });

    // Generate JWT token
    const payload = { sub: user.id, username: user.username };
    const access_token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      access_token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        jumlahLogin: user.jumlahLogin + 1, // Incremented in response
        ...user,
      },
    };
  }
}
