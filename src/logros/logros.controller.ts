import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LogrosService } from './logros.service';
import { CreateLogroDto } from './dto/create-logro.dto';
import { UpdateLogroDto } from './dto/update-logro.dto';

@ApiTags('Logros')
@Controller('logros')
export class LogrosController {
  constructor(private readonly service: LogrosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear logro (sin icono por ahora)' })
  @ApiResponse({ status: 201, description: 'Logro creado' })
  create(@Body() dto: CreateLogroDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar logros' })
  @ApiResponse({ status: 200, description: 'Listado de logros' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener logro por id' })
  @ApiResponse({ status: 200, description: 'Logro encontrado' })
  @ApiResponse({ status: 404, description: 'Logro no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar logro (sin icono por ahora)' })
  @ApiResponse({ status: 200, description: 'Logro actualizado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLogroDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar logro' })
  @ApiResponse({ status: 200, description: 'Logro eliminado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
