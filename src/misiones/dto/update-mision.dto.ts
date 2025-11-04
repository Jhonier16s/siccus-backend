import { PartialType } from '@nestjs/mapped-types';
import { CreateMisionDto } from './create-mision.dto';

export class UpdateMisionDto extends PartialType(CreateMisionDto) {}
