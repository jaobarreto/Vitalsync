/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CaregiversService } from './caregivers.service';
import { CreateCaregiverDto } from './dto/create-caregiver.dto';
import { UpdateCaregiverDto } from './dto/update-caregiver.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';

@Controller('caregivers')
@UseGuards(AuthGuard)
export class CaregiversController {
  constructor(private readonly caregiversService: CaregiversService) {}

  @Post()
  create(@GetUser('id') userId: string, @Body() createCaregiverDto: CreateCaregiverDto) {
    return this.caregiversService.create(userId, createCaregiverDto);
  }

  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.caregiversService.findAll(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCaregiverDto: UpdateCaregiverDto) {
    return this.caregiversService.update(id, updateCaregiverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.caregiversService.remove(id);
  }
}
