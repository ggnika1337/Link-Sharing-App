import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
export declare class AuthService {
    private userModel;
    private usersService;
    private jwtService;
    constructor(userModel: Model<User>, usersService: UsersService, jwtService: JwtService);
    signUp(signUpDto: SignUpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    signIn(signInDto: SignInDto): Promise<{
        token: string;
    }>;
    getCurrentUser(userId: string): Promise<void>;
}
