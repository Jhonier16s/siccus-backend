import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PerfilSaludService } from './perfil-salud.service';
import { UpdatePerfilSaludDto } from './dto/update-perfil-salud.dto';
import { CreatePerfilSaludDto } from './dto/create-perfil-salud.dto';

@ApiTags('PerfilSalud')
@Controller('perfil-salud')
export class PerfilSaludController {
  constructor(private readonly service: PerfilSaludService) {}

  // Crea o actualiza (upsert) el perfil de salud del usuario
  @Post()
  @ApiOperation({ summary: 'Crear o actualizar el perfil de salud por idUsuario' })
  @ApiResponse({ status: 200, description: 'Perfil creado/actualizado' })
  upsert(@Body() dto: CreatePerfilSaludDto) {
    return this.service.upsert(dto);
  }

  @Get(':idUsuario')
  @ApiOperation({ summary: 'Obtener perfil de salud por idUsuario' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  findOne(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.service.findByUserId(idUsuario);
  }

  @Patch(':idUsuario')
  @ApiOperation({ summary: 'Actualizar parcialmente el perfil de salud por idUsuario' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado' })
  update(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Body() dto: UpdatePerfilSaludDto,
  ) {
    return this.service.update(idUsuario, dto);
  }
}
