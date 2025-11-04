import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MisionesService } from './misiones.service';
import { CreateMisionDto } from './dto/create-mision.dto';
import { UpdateMisionDto } from './dto/update-mision.dto';

@ApiTags('Misiones')
@Controller('misiones')
export class MisionesController {
  constructor(private readonly service: MisionesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear misión' })
  @ApiResponse({ status: 201, description: 'Misión creada' })
  create(@Body() dto: CreateMisionDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar misiones' })
  @ApiResponse({ status: 200, description: 'Listado de misiones' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener misión por id' })
  @ApiResponse({ status: 200, description: 'Misión encontrada' })
  @ApiResponse({ status: 404, description: 'Misión no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar misión' })
  @ApiResponse({ status: 200, description: 'Misión actualizada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMisionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar misión' })
  @ApiResponse({ status: 200, description: 'Misión eliminada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
