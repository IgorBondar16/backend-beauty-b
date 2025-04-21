import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsString({message: 'Пошта обов\'язкова'})
  @MinLength(3, { message: 'Пошта повинна містити не менше 3 символів' })


  @IsString()
  @MinLength(6)
  password: string;

    @IsString()
    role: string;
}