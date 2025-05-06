// import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export enum Role {
  CLIENT = 'CLIENT',
  MASTER = 'MASTER',
}

// export class CreateUserDto {
//   @IsEmail({}, { message: 'Пошта обов\'язкова' })
//   email: string;

//   @IsOptional()
//   @IsPhoneNumber()
//   phone?: string;

//   @IsString()
//   @MinLength(6)
//   password: string;

//   @IsString()
//   name: string;

//   @IsEnum(Role)
//   role: Role;

//   @IsOptional()
//   @IsString()
//   avatarUrl?: string;
// }
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class RegisterDto {
  @ApiProperty({ example: 'test@gmail.com' })
  email: string;

  @ApiPropertyOptional({ example: '+380931112233' })
  phone?: string;

  @ApiProperty({ example: '123456' })
  password: string;

  @ApiProperty({ example: 'Олександр' })
  name: string;

  @ApiProperty({ enum: Role, example: Role.MASTER })
  role: Role;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  avatarUrl?: string;
}
