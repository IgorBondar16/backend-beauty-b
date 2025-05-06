import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDto, Role } from '@auth/dto/create-user.dto';
import { UpdateUserDto } from '@auth/dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  
  async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }   
          });
    }  

    async getUserById(id: string) {
      const user = await this.prisma.user.findUnique({
          where: { id },
          select: {
              id: true,
              name: true,
              email: true,
              role: true,
          },
      });
  
      if (!user) {
          throw new NotFoundException('Користувача не знайдено');
      }
  
      return user;
  }
  
//   async create(createUserDto: CreateUserDto) {
//     const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

//     return this.prisma.user.create({
//       data: {
//         ...createUserDto,
//         password: hashedPassword,
//       },
//     });
//   }
   async create(createUserDto: RegisterDto) {
    // Перевірка унікальності email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Електронна пошта вже використовується');
    }
  
    // Валідація даних (можна додати додаткову логіку, якщо потрібно)
    if (!createUserDto.password || createUserDto.password.length < 6) {
      throw new BadRequestException('Пароль має бути не менше 6 символів');
    }
  
    // Хешування пароля
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
    try {
      // Створення користувача
      return await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });
    } catch (error) {
      // Обробка помилок бази даних
      console.error('Error creating user:', error);
      throw new BadRequestException('Не вдалося створити користувача');
    }
}
   findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found by email');
    return user;
  }

  async updatePassword(id: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async updateAvatar(id: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id },
      data: { avatarUrl },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
    async findByPhone(phone: string) {
        return this.prisma.user.findUnique({ where: { phone } });
    }
    async findById(id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }
    async findByName(name: string) {
        return this.prisma.user.findFirst({ where: { name } });
    }
    async findByRole(role: Role) {
        return this.prisma.user.findMany({ where: { role } });
    }
}
