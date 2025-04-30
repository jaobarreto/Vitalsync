import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MeasurementDto } from './dto/measurement.dto';

@Injectable()
export class MeasurementService {
  constructor(private prisma: PrismaService) {}

  async create(data: MeasurementDto) {
    // Validações básicas
    this.validateMeasurementData(data);

    // Determinar eventType com base nos valores
    const eventType = this.determineEventType(data);

    return this.prisma.measurement.create({
      data: {
        ...data,
        eventType,
        duration: data.duration || 5, // Valor padrão de 5 minutos
        timestamp: data.timestamp || new Date(),
      },
    });
  }

  private validateMeasurementData(data: MeasurementDto) {
    if (data.heartRate <= 0 || data.bloodOxygenLevel <= 0 || data.hrv < 0) {
      throw new Error('Valores de medição inválidos');
    }

    if (data.heartRate < 30 || data.heartRate > 220) {
      throw new Error('Frequência cardíaca inválida');
    }

    if (data.bloodOxygenLevel < 70 || data.bloodOxygenLevel > 100) {
      throw new Error('Nível de oxigênio inválido');
    }

    if (data.duration && (data.duration < 1 || data.duration > 1440)) {
      throw new Error('Duração deve estar entre 1 e 1440 minutos');
    }
  }

  private determineEventType(data: MeasurementDto): string {
    // Se já foi definido, mantém
    if (data.eventType) return data.eventType;

    // Lógica para detecção automática de emergência
    if (
      data.heartRate < 50 ||
      data.heartRate > 140 ||
      data.bloodOxygenLevel < 90
    ) {
      return 'emergency';
    }

    return 'routine'; // Default
  }

  async findAll(filter?: {
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    eventType?: string;
  }) {
    return this.prisma.measurement.findMany({
      where: {
        userId: filter?.userId,
        timestamp: {
          gte: filter?.startDate,
          lte: filter?.endDate,
        },
        eventType: filter?.eventType,
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.measurement.findUnique({
      where: { id },
      include: {
        dailySummary: true,
        alerts: true,
      },
    });
  }

  async update(id: string, data: Partial<MeasurementDto>) {
    if (data.heartRate || data.bloodOxygenLevel || data.hrv) {
      this.validateMeasurementData(data as MeasurementDto);
    }

    return this.prisma.measurement.update({
      where: { id },
      data: {
        ...data,
        eventType: data.eventType || undefined, // Mantém o existente se não fornecido
      },
    });
  }

  async delete(id: string) {
    return this.prisma.measurement.delete({ where: { id } });
  }

  async generateMockData(userId?: string) {
    const now = new Date();
    const isEmergency = Math.random() < 0.1; // 10% chance de ser emergência

    let heartRate, bloodOxygenLevel, hrv;

    if (isEmergency) {
      heartRate =
        Math.random() < 0.5
          ? Math.floor(Math.random() * (49 - 30) + 30) // Bradicardia
          : Math.floor(Math.random() * (220 - 141) + 141); // Taquicardia
      bloodOxygenLevel = Math.floor(Math.random() * (89 - 70) + 70);
      hrv = Math.floor(Math.random() * (19 - 1) + 1);
    } else {
      heartRate = Math.floor(Math.random() * (100 - 60) + 60);
      bloodOxygenLevel = Math.floor(Math.random() * (100 - 90) + 90);
      hrv = Math.floor(Math.random() * (100 - 20) + 20);
    }

    const mockData = {
      userId: userId || 'default-user-id',
      heartRate,
      bloodOxygenLevel,
      hrv,
      timestamp: new Date(
        now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      ), // Últimos 7 dias
      eventType: isEmergency ? 'emergency' : 'routine',
      duration: Math.floor(Math.random() * (30 - 1) + 1),
      notes: isEmergency ? 'Leitura anômala detectada' : undefined,
    };

    return this.prisma.measurement.create({ data: mockData });
  }
}
