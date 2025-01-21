import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
// import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Request() req) {
    if (!req.body.username || !req.body.password) {
      throw new UnauthorizedException('Username and password are required');
    }
    return this.authService.signIn(req.body.username, req.body.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.headers;
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout() {
    return {
      message: 'Logged Out!',
    };
  }
}
