import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const {
      name,
      email,
      password,
      age,
      gender,
      weight,
      height,
      medicalHistory,
      healthReport,
    } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        age,
        gender,
        weight,
        height,
        medicalHistory,
        healthReport,
      },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const {
      name,
      email,
      password,
      age,
      gender,
      weight,
      height,
      medicalHistory,
      healthReport,
    } = updateUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password: hashedPassword,
        age,
        gender,
        weight,
        height,
        medicalHistory,
        healthReport,
      },
    });
  }

  async deleteUser(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
