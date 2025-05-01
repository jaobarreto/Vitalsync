import { PartialType } from '@nestjs/swagger';
import { CreateCaregiverDto } from './create-caregiver.dto';

export class UpdateCaregiverDto extends PartialType(CreateCaregiverDto) {}
