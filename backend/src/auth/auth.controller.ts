import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { IsAuthGuard } from 'src/guards/isAuth.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('sign-up')
  signUp(@Body() { email, fullName, password }: SignUpDto) {
    return this.authService.signUp({ email, fullName, password });
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('sign-in')
  signIn(@Body() { email, password }: SignInDto) {
    return this.authService.signIn({ email, password });
  }

  @Get('current-user')
  @UseGuards(IsAuthGuard)
  getCurrentUser(@Req() req: Request) {
    return this.authService.getCurrentUser(req.userId);
  }
}
