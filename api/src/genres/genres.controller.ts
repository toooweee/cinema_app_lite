import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GenresService } from './genres.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@roles/guard';
import { ROLES } from '@roles/decorator';
import Roles from '@roles/types/roles.enum';
import { CreateGenreDto, UpdateGenreDto } from './dto';
import { Public } from '@auth/decorators';

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @UseGuards(RolesGuard)
  @ROLES(Roles.ADMIN, Roles.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN, MANAGER] создать новый жанр кино' })
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary:
      '[ВСЕ] получить все жанры. Больше для пользования фронтенда а не пользователей',
  })
  findAll() {
    return this.genresService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary:
      '[ВСЕ] получить один жанр. Больше для пользования фронтенда а не пользователей',
  })
  findOne(@Param('id') id: string) {
    return this.genresService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @ROLES(Roles.ADMIN, Roles.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN, MANAGER] обновить новый жанр кино' })
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genresService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @ROLES(Roles.ADMIN, Roles.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN, MANAGER] удалить новый жанр кино' })
  remove(@Param('id') id: string) {
    return this.genresService.remove(id);
  }
}
