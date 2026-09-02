import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UserId } from '../users/decorators/user.decorator';
import { Throttle } from '@nestjs/throttler';
import { IsAuthGuard } from '../guards/isAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  @Throttle({default: {ttl: 60 * 1000, limit: 3, blockDuration: 30 * 1000}})
  signUp(
    @Body() signUpDto: SignUpDto
  ){
    return this.authService.signUp(signUpDto)
  }

  @Post("sign-in")
  @Throttle({default: {ttl: 60 * 1000, limit: 5, blockDuration: 30 * 1000}})
  signIn(
    @Body() signInDto: SignInDto
  ){
    return this.authService.signIn(signInDto)
  }

  @Get("current-user")
  @UseGuards(IsAuthGuard)
  getCurrentUser(
    @UserId() userId
  ){
    return this.authService.getCurrentUser(userId)
  }
}
