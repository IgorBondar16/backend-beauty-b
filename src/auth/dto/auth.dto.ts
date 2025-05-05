import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  @IsString({message: 'Пошта обов\'язкова'})
  @MinLength(3, { message: 'Пошта повинна містити не менше 3 символів' })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  role: string;
   
}
