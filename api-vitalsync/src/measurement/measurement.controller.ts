import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import {
  CreateMeasurementDto,
  MeasurementResponseDto,
} from './dto/measurement.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';

@ApiTags('measurements')
@Controller('measurements')
@ApiBearerAuth()
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Post()
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Registra nova medição de BPM' })
  @ApiBody({ type: CreateMeasurementDto })
  @ApiResponse({
    status: 201,
    description: 'Medição registrada com sucesso',
    type: MeasurementResponseDto,
  })
  async create(
    @Body() createMeasurementDto: CreateMeasurementDto,
    @GetUser('id') userId: string,
  ): Promise<MeasurementResponseDto> {
    console.log('Controller recebeu:', createMeasurementDto);
    return this.measurementService.createMeasurement(
      createMeasurementDto,
      userId,
    );
  }

  @Get()
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Lista todas as medições do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de medições',
    type: [MeasurementResponseDto],
  })
  async findAll(
    @GetUser('id') userId: string,
  ): Promise<MeasurementResponseDto[]> {
    return this.measurementService.getMeasurementsByUser(userId);
  }

  @Get('latest')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtém a última medição do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Última medição registrada',
    type: MeasurementResponseDto,
  })
  async findLatest(
    @GetUser('id') userId: string,
  ): Promise<MeasurementResponseDto> {
    return this.measurementService.getLatestMeasurement(userId);
  }

  @Get('range')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtém medições dentro de um período (horas)' })
  @ApiResponse({
    status: 200,
    description: 'Medições no período especificado',
    type: [MeasurementResponseDto],
  })
  async findByRange(
    @GetUser('id') userId: string,
    @Query('hours', ParseIntPipe) hours: number,
  ): Promise<MeasurementResponseDto[]> {
    return this.measurementService.getMeasurementsByUser(userId, hours);
  }
}
