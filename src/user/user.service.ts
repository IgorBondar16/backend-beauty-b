import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { AutoDto } from './dto/auto.dto'; // Adjust the import path as necessary


@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    // async getById(id: string) {
    //     const user = await this.prisma.user.findUnique({
    //         where: { id },
    //         select: {
    //             id: true,
    //             name: true,
    //             email: true,
    // async createUser(data: { name: string; email: string; password: string }) {
    async createUser(dto: AutoDto) {
        return this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: await hash(dto.password),
                role: dto.role // Ensure `role` is provided in the DTO
            },
        });
        
}
