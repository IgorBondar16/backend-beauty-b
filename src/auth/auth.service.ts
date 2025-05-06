import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/user.service';
import { PrismaService } from 'prisma.service';
import { AuthDto } from '@auth/dto/auth.dto'; // Adjusted to match the tsconfig.json paths configuration
import { RegisterDto, Role } from '@auth/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';


@Injectable()
export class AuthService {
    EXPIRE_DAY_REFRESH_TOKEN = 1;
    REFRESH_TOKEN_NAME = 'refresh_token';

    constructor(private jwt: JwtService
        ,private userService: UserService
        ,private prisma: PrismaService
        ,private config: ConfigService
    )  {  }

    async register(dto: RegisterDto) {
        //const existingUser = await this.userService.getByEmail(dto.email);
        //if (existingUser) {
          //throw new BadRequestException('Користувач з таким email вже існує');
        //}
        
        // Створення користувача
        const user = await this.userService.create(dto);
        // if (!user) {
        //     throw new NotFoundException('Користувача не знайдено');
        // }
        const token = this.issueToken(user.id);
        return { user, ...token };
    }
    
    

    async login(dto: LoginDto) {
        const user = await this.userService.getByEmail(dto.email);
        // if (!user || user.password !== dto.password) {
        //   throw new NotFoundException('Невірна пошта або пароль'); // краще буде UnauthorizedException
        // }
      
        const token = this.issueToken(user.id);
        return { user, ...token };
      }

    async getNewTokens(refresh_token: string) {
        const result = await this.jwt.verify(refresh_token);
        if(!result) throw new BadRequestException('refresh_token не валідний');
        
        const user = await this.userService.getUserById(result.id);

        const token = this.issueToken(user.id);
        
        return { user, ...token };

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

    private async validateUser(dto: { email: string }) {
            const user = await this.userService.getByEmail(dto.email);
    
            if (!user) {
                throw new NotFoundException('Користувача не знайдено');
            }
            return user;
    }
    
    async validateOAuthLogin(req: any){
        let user = await this.userService.getByEmail(req.user.email);

        // if(!user){
        //     user = await this.prisma.user.create({
        //         data: {
        //             email: req.user.email,
        //             name: req.user.name,
        //             password: '',
        //             role: Role.CLIENT,
        //             avatarUrl: req.user.avatarUrl,
        //         },
        //         include: {
        //             bookings: true,
        //             reviews: true,
        //             services: true,
        //         },
        //     });
        // }

        if (!user) {
            user = await this.userService.create({
                email: req.user.email,
                name: req.user.name,
                password: '',
                role: Role.CLIENT,
                avatarUrl: req.user.avatarUrl,
            });
        }
        const token = this.issueToken(user.id);
        return { user, ...token };
    }


    addRefreshTokenToResponse(res: Response, refresh_token: string) {
        const expiresIn = new Date();
        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);
    
        res.cookie(this.REFRESH_TOKEN_NAME, refresh_token, {
            httpOnly: true,
            domain: this.config.get('SERVER_DOMAIN'),
            expires: expiresIn,
            secure: true,
            sameSite: 'none',
        });
    }

    removeRefreshTokenFromResponse(res: Response) {
        res.clearCookie(this.REFRESH_TOKEN_NAME, {
            httpOnly: true,
            domain: this.config.get('SERVER_DOMAIN'),
            expires: new Date(0),
            sameSite: 'none',
            secure: true,
        });
    }
}

