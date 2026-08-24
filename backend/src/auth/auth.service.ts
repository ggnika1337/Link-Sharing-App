import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp({ email, fullName, password }: SignUpDto) {
    const existUser = this.usersService.findByEmail(email);

    if (existUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersService.createAuthUser({
      email,
      fullName,
      avatar,
      password: hashedPassword,
    });

    return {
      success: true,
      message: 'user created successfully',
    };
  }

  async signIn({ password, email }: SignInDto) {
    const existUser = this.usersService.findByEmail(email);

    if (!existUser) {
      throw new BadRequestException('Email or password is invalid');
    }

    const isPassEqual = await bcrypt.compare(password, existUser.password);
    if (!isPassEqual) {
      throw new BadRequestException('Email or password is invalid');
    }

    const payLoad = {
      userId: existUser._id,
    };
    const token = await this.jwtService.sign(payLoad, { expiresIn: '1h' });
    return { token };
  }

  async getCurrentUser(userId: string) {
    return this.usersService.getUserById(userId);
  }
}
