import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp({ email, fullName, password }: SignUpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    signIn({ email, password }: SignInDto): Promise<{
        token: string;
    }>;
    getCurrentUser(req: any): Promise<void>;
}
