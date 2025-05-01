import { Injectable } from '@nestjs/common';
import { CreateCaregiverDto } from './dto/create-caregiver.dto';
import { UpdateCaregiverDto } from './dto/update-caregiver.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CaregiversService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createCaregiverDto: CreateCaregiverDto) {
    return this.prisma.caregiver.create({
      data: {
        ...createCaregiverDto,
        user: { connect: { id: userId } },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.caregiver.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateCaregiverDto: UpdateCaregiverDto) {
    return this.prisma.caregiver.update({
      where: { id },
      data: updateCaregiverDto,
    });
  }

  async remove(id: string) {
    return this.prisma.caregiver.delete({
      where: { id },
    });
  }
}
