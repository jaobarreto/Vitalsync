/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CaregiversService } from './caregivers.service';
import { CreateCaregiverDto } from './dto/create-caregiver.dto';
import { UpdateCaregiverDto } from './dto/update-caregiver.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Caregivers')
@Controller('caregivers')
@UseGuards(AuthGuard)
export class CaregiversController {
  constructor(private readonly caregiversService: CaregiversService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar cuidador' })
  @ApiBody({ type: CreateCaregiverDto })
  @ApiResponse({ status: 201, description: 'Cuidador criado com sucesso.' })
  create(@GetUser('id') userId: string, @Body() createCaregiverDto: CreateCaregiverDto) {
    return this.caregiversService.create(userId, createCaregiverDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cuidadores do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de cuidadores retornada com sucesso.' })
  findAll(@GetUser('id') userId: string) {
    return this.caregiversService.findAll(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cuidador' })
  @ApiParam({ name: 'id', description: 'ID do cuidador' })
  @ApiBody({ type: UpdateCaregiverDto })
  @ApiResponse({ status: 200, description: 'Cuidador atualizado com sucesso.' })
  update(@Param('id') id: string, @Body() updateCaregiverDto: UpdateCaregiverDto) {
    return this.caregiversService.update(id, updateCaregiverDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover cuidador' })
  @ApiParam({ name: 'id', description: 'ID do cuidador' })
  @ApiResponse({ status: 200, description: 'Cuidador removido com sucesso.' })
  remove(@Param('id') id: string) {
    return this.caregiversService.remove(id);
  }
}
