import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { DailySummaryService } from './daily-summary.service';
import {
  DailySummaryResponseDto,
  DailySummaryQueryDto,
} from './dto/daily-summary.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';

@ApiTags('Daily Summaries')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('daily-summaries')
export class DailySummaryController {
  constructor(private readonly summaryService: DailySummaryService) {}

  @Post()
  @ApiOperation({ summary: 'Gerar/atualizar resumo diário' })
  @ApiResponse({ status: 201, type: DailySummaryResponseDto })
  async generateSummary(
    @GetUser() userId: string,
  ): Promise<DailySummaryResponseDto> {
    return this.summaryService.generateDailySummary(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar resumos diários' })
  @ApiResponse({ status: 200, type: [DailySummaryResponseDto] })
  async getSummaries(
    @GetUser() userId: string,
    @Query() query: DailySummaryQueryDto,
  ): Promise<DailySummaryResponseDto[]> {
    return this.summaryService.getSummaries(userId, query);
  }
}
