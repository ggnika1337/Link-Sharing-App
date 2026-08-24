import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    signUp({ email, fullName, password }: SignUpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    signIn({ password, email }: SignInDto): Promise<{
        token: any;
    }>;
    getCurrentUser(userId: string): Promise<void>;
}
