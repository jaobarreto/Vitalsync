import { IsBoolean } from 'class-validator';

export class MedicalHistoryDto {
  @IsBoolean()
  hypertension: boolean;

  @IsBoolean()
  diabetes: boolean;

  @IsBoolean()
  highCholesterol: boolean;

  @IsBoolean()
  previousStroke: boolean;
}
