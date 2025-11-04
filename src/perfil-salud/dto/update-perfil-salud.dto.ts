import { PartialType } from '@nestjs/mapped-types';
import { CreatePerfilSaludDto } from './create-perfil-salud.dto';

export class UpdatePerfilSaludDto extends PartialType(CreatePerfilSaludDto) {}
