import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { MeasurementDto } from './dto/measurement.dto';

@Controller('measurement')
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Post()
  async create(@Body() data: MeasurementDto) {
    return this.measurementService.create(data);
  }

  @Get()
  async findAll() {
    return this.measurementService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.measurementService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.measurementService.delete(id);
  }

  @Post('mock')
  async generateMock() {
    return this.measurementService.generateMockData();
  }
}
