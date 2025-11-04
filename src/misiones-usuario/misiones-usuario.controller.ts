import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MisionesUsuarioService } from './misiones-usuario.service';
import { AssignMisionUsuarioDto } from './dto/assign-mision-usuario.dto';
import { UpdateMisionUsuarioDto } from './dto/update-mision-usuario.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('misiones-usuario')
@ApiBearerAuth()
@Controller('misiones-usuario')
export class MisionesUsuarioController {
  constructor(private readonly service: MisionesUsuarioService) {}

  @Post('assign')
  @ApiOperation({ summary: 'Asignar una misión a un usuario' })
  @ApiBody({ type: AssignMisionUsuarioDto })
  @ApiResponse({ status: 201, description: 'Misión asignada al usuario' })
  @ApiResponse({ status: 400, description: 'Misión bloqueada u otros errores de validación' })
  @ApiResponse({ status: 404, description: 'Usuario o misión no encontrados' })
  @ApiResponse({ status: 409, description: 'La misión ya estaba asignada a este usuario' })
  assign(@Body() dto: AssignMisionUsuarioDto) {
    return this.service.assign(dto);
  }

  @Get('user/:idUsuario')
  @ApiOperation({ summary: 'Listar misiones asignadas a un usuario' })
  @ApiParam({ name: 'idUsuario', type: Number })
  @ApiResponse({ status: 200, description: 'Listado de misiones asignadas' })
  findByUser(@Param('idUsuario') idUsuario: string) {
    return this.service.listByUser(Number(idUsuario));
  }

  @Patch(':idMisionUsuario')
  @ApiOperation({ summary: 'Actualizar estado/progreso de la misión del usuario' })
  @ApiParam({ name: 'idMisionUsuario', type: Number })
  @ApiBody({ type: UpdateMisionUsuarioDto })
  @ApiResponse({ status: 200, description: 'Asignación actualizada' })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada' })
  update(
    @Param('idMisionUsuario') idMisionUsuario: string,
    @Body() dto: UpdateMisionUsuarioDto,
  ) {
    return this.service.update(Number(idMisionUsuario), dto);
  }

  @Delete(':idMisionUsuario')
  @ApiOperation({ summary: 'Eliminar la asignación de una misión a un usuario' })
  @ApiParam({ name: 'idMisionUsuario', type: Number })
  @ApiResponse({ status: 200, description: 'Asignación eliminada' })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada' })
  remove(@Param('idMisionUsuario') idMisionUsuario: string) {
    return this.service.unassign(Number(idMisionUsuario));
  }
}
