import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/user.service';
import { PrismaService } from 'prisma.service';
import { AuthDto } from '@auth/dto/auth.dto'; // Adjusted to match the tsconfig.json paths configuration
// {
//     "compilerOptions": {
//       // other options
//       "baseUrl": "./",
//       "paths": {
//         "@dto/*": ["src/dto/*"]
//       }
//     }
//   }
@Injectable()
export class AuthService {
    constructor(private jwt: JwtService
        ,private userService: UserService
        ,private prisma: PrismaService
    )  {  }

    async login(userId: string) {
        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const payload = { id: user.id, email: user.email };
        return {
            access_token: this.jwt.sign(payload),
            user,
        };
    }
    async register(createUserDto: any) {
        const existingUser = await this.userService.getUserById(createUserDto.email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const user = await this.userService.create(createUserDto);
        const payload = { id: user.id, email: user.email };
        return {
            access_token: this.jwt.sign(payload),
            user,
        };
    }
    issueToken(userId: string) {
        const data = { id: userId };

        const access_token = this.jwt.sign(data, {
            expiresIn: '1h',
        });

        const refresh_token = this.jwt.sign(data, {
            expiresIn: '7d',
        });
        return { access_token, refresh_token };
    }
    // async validateUser(email: string, password: string) {
    //     const user = await this.userService.getUserById(email);
    //     if (!user) {
    //         throw new Error('Invalid credentials');
    //     }
    //     const isMatch = await bcrypt.compare(password, user.password);
    //     if (!isMatch) {
    //         throw new Error('Invalid credentials');
    //     }
    //     return user;
    // }
    private async validateUser(dto: AuthDto) {
        const user = await this.userService.getByEmail(dto.email);

        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
}
