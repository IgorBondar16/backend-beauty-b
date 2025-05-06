import { Body, Controller, HttpCode, Post, Res, Req, UnauthorizedException, UsePipes, ValidationPipe, Get } from '@nestjs/common';
import { response, Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @UsePipes(new ValidationPipe())
//   @HttpCode(200)
//   @Post('login')
//   async login(@Body() dto: LoginDto) {
//     return this.authService.login(dto);
//   }

//   @UsePipes(new ValidationPipe())
//   @HttpCode(200)
//   @Post('register')
//   async register(@Body() dto: CreateUserDto) {
//     return this.authService.register(dto);
//   }
// }
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Логін користувача' })
  @ApiResponse({ status: 200, description: 'Успішний логін' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto);
    // const {refresh_token, ...token} = await this.authService.login(dto);

    // this.authService.addRefreshTokenToResponse(res, refresh_token);

    // return response;
  }

  @Post('register')
  @HttpCode(200)
  @ApiOperation({ summary: 'Реєстрація користувача' })
  @ApiResponse({ status: 200, description: 'Користувача створено' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    //return this.authService.register(dto);
    const {refresh_token, ...token} = await this.authService.register(dto);

    this.authService.addRefreshTokenToResponse(res, refresh_token);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @Post('login/access-token')
  @HttpCode(200)
  //@ApiOperation({ summary: 'Логін користувача' })
  //@ApiResponse({ status: 200, description: 'Успішний логін' })
  async getNewTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    //return this.authService.login(dto);
    const refreshTokenFromCookie = req.cookies[this.authService.REFRESH_TOKEN_NAME];
    if (!refreshTokenFromCookie) {
        throw new UnauthorizedException('refresh_token не валідний');
    }
    const {refresh_token, ...token} = await this.authService.getNewTokens(refreshTokenFromCookie);

    this.authService.addRefreshTokenToResponse(res, refresh_token);

    return response;
  }

  
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Вийти з системи (очистити токени)' })
  @ApiResponse({ status: 200, description: 'Вихід успішний' })
  logout(@Res({ passthrough: true }) res: Response) {
    return 'TODO: реалізація logout';
  }

  @Post('send-sms-code')
  @HttpCode(200)
  @ApiOperation({ summary: 'Надіслати SMS-код для підтвердження телефону' })
  @ApiResponse({ status: 200, description: 'Код надіслано' })
  sendSmsCode(@Body() body: any) {
    return 'TODO: реалізація надсилання SMS';
  }

  @Post('verify-sms-code')
  @HttpCode(200)
  @ApiOperation({ summary: 'Підтвердити SMS-код' })
  @ApiResponse({ status: 200, description: 'Код підтверджено' })
  verifySmsCode(@Body() body: any) {
    return 'TODO: реалізація перевірки SMS';
  }

  @Get('me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Отримати дані поточного користувача' })
  @ApiResponse({ status: 200, description: 'Дані користувача' })
  getProfile(@Req() req: Request) {
    return 'TODO: реалізація профілю';
  }

  @Post('google-login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Авторизація через Google OAuth' })
  @ApiResponse({ status: 200, description: 'Користувач авторизований через Google' })
  googleLogin(@Body() body: any) {
    return 'TODO: Google login';
  }

  @Get('calendar/:masterId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Отримати календар записів для майстра' })
  @ApiResponse({ status: 200, description: 'Календар бронювань' })
  // getCalendar(@Param('masterId') masterId: string) {
  //   return `TODO: календар бронювань для майстра ${masterId}`;
  // }

  @Post(':id/cancel')
  @HttpCode(200)
  @ApiOperation({ summary: 'Скасувати бронювання' })
  @ApiResponse({ status: 200, description: 'Бронювання скасовано' })
  // cancelBooking(@Param('id') id: string) {
  //   return `TODO: скасування бронювання ${id}`;
  // }

  @Post(':id/confirm')
  @HttpCode(200)
  @ApiOperation({ summary: 'Підтвердити бронювання' })
  @ApiResponse({ status: 200, description: 'Бронювання підтверджено' })
  confirmBooking(@Body() body: any) {
    return 'TODO: підтвердження бронювання';
  }
  // confirmBooking(@Param('id') id: string) {
  //   return `TODO: підтвердження бронювання ${id}`;
  // }
}


