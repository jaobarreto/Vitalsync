import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AlertService } from './alert.service';
import {
  CreateAlertDto,
  UpdateAlertDto,
  AlertResponseDto,
} from './dto/alert.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';

@ApiTags('Alerts')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  @ApiOperation({ summary: 'Create new alert' })
  @ApiResponse({ status: 201, type: AlertResponseDto })
  async create(
    @GetUser() userId: string,
    @Body() createDto: CreateAlertDto,
  ): Promise<AlertResponseDto> {
    return this.alertService.createAlert(userId, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user alerts' })
  @ApiResponse({ status: 200, type: [AlertResponseDto] })
  async findAll(
    @GetUser() userId: string,
    @Query('resolved') resolved?: boolean,
  ): Promise<AlertResponseDto[]> {
    return this.alertService.getUserAlerts(userId, resolved);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update alert status' })
  @ApiResponse({ status: 200, type: AlertResponseDto })
  async update(
    @Param('id') alertId: string,
    @Body() updateDto: UpdateAlertDto,
  ): Promise<AlertResponseDto> {
    return this.alertService.updateAlert(alertId, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete alert' })
  @ApiResponse({ status: 204 })
  async delete(@Param('id') alertId: string): Promise<void> {
    return this.alertService.deleteAlert(alertId);
  }
}
