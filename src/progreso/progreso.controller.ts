import { Controller, Get, Param } from '@nestjs/common';
import { ProgresoService } from './progreso.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('progreso')
@ApiBearerAuth()
@Controller('progreso')
export class ProgresoController {
  constructor(private readonly service: ProgresoService) {}

  @Get('user/:idUsuario/total')
  @ApiOperation({ summary: 'Obtener XP total del usuario (sumatoria de eventos)' })
  @ApiParam({ name: 'idUsuario', type: Number })
  @ApiResponse({ status: 200, description: 'XP total del usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  getTotal(@Param('idUsuario') idUsuario: string) {
    return this.service.getUsuarioXpTotal(Number(idUsuario));
  }

  @Get('user/:idUsuario')
  @ApiOperation({ summary: 'Historial de progreso (eventos) del usuario' })
  @ApiParam({ name: 'idUsuario', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de eventos de progreso' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  getHistorial(@Param('idUsuario') idUsuario: string) {
    return this.service.getUsuarioHistorial(Number(idUsuario));
  }

  @Get('user/:idUsuario/summary')
  @ApiOperation({ summary: 'Resumen total del usuario: XP total, energía total, salud total y nivel + progreso hacia el siguiente nivel' })
  @ApiParam({ name: 'idUsuario', type: Number })
  @ApiResponse({ status: 200, description: 'Totales y nivel del usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  getResumen(@Param('idUsuario') idUsuario: string) {
    return this.service.getUsuarioResumen(Number(idUsuario));
  }
}
