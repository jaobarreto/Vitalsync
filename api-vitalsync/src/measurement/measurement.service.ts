import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MeasurementDto } from './dto/measurement.dto';

@Injectable()
export class MeasurementService {
  constructor(private prisma: PrismaService) {}

  async create(data: MeasurementDto) {
    // Garantir que os valores sejam positivos
    if (data.heartRate <= 0 || data.bloodOxygenLevel <= 0 || data.hrv < 0) {
      throw new Error('Valores de medição inválidos');
    }

    // Verificar se os valores estão dentro dos limites normais
    if (data.heartRate < 30 || data.heartRate > 220) {
      throw new Error('Frequência cardíaca inválida');
    }
    if (data.bloodOxygenLevel < 70 || data.bloodOxygenLevel > 100) {
      throw new Error('Nível de oxigênio inválido');
    }

    return this.prisma.measurement.create({ data });
  }

  async findAll() {
    return this.prisma.measurement.findMany();
  }

  async findOne(id: string) {
    return this.prisma.measurement.findUnique({ where: { id } });
  }

  async delete(id: string) {
    return this.prisma.measurement.delete({ where: { id } });
  }

  async generateMockData() {
    const mockData = {
      userId: 'abc12345',
      heartRate: Math.floor(Math.random() * (100 - 60) + 60),
      bloodOxygenLevel: Math.floor(Math.random() * (100 - 90) + 90),
      hrv: Math.floor(Math.random() * (100 - 20) + 20),
      timestamp: new Date(),
    };
    return this.prisma.measurement.create({ data: mockData });
  }
}
