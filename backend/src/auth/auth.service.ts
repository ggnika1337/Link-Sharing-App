import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel("user") private userModel: Model<User>,
    private usersService: UsersService,
    private jwtService: JwtService
  ){}

  async signUp(signUpDto: SignUpDto){
    const existingUser = await this.userModel.findOne({email: signUpDto.email})
    if(existingUser){
      throw new BadRequestException("User with this email already registered")
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10)

    const newUser = await this.userModel.create({
      ...signUpDto,
      password: hashedPassword,
    })

    return {
      success: true,
      message: 'user created successfully',
    };
  }

  async signIn(signInDto: SignInDto){
    const existingUser = await this.userModel.findOne({email: signInDto.email}).select("password")
    if(!existingUser){
      throw new BadRequestException("Email or Password is incorrect")
    }

    const isPassEqual = await bcrypt.compare(signInDto.password, existingUser.password);
    if (!isPassEqual) {
      throw new BadRequestException('Email or Password is incorrect')
    }

    const payLoad = {
      userId: existingUser._id,
    }
    const token = await this.jwtService.sign(payLoad, { expiresIn: '1h' })
    return { token };
  }

  async getCurrentUser(userId: string) {
    return this.usersService.findOne(userId)
  }
}
