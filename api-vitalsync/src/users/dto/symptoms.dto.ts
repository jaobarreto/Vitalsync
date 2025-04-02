import { IsString } from 'class-validator';

export class SymptomsDto {
  @IsString()
  headache: string;

  @IsString()
  dizzinessVertigo: string;

  @IsString()
  fatigueWeakness: string;

  @IsString()
  visualChanges: string;

  @IsString()
  numbnessTingling: string;

  @IsString()
  speechDifficulties: string;

  @IsString()
  additionalSymptoms: string;
}
