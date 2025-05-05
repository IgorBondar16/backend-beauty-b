import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export enum Role {
  CLIENT = 'CLIENT',
  MASTER = 'MASTER',
}

export class CreateUserDto {
  @IsEmail({}, { message: 'Пошта обов\'язкова' })
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
