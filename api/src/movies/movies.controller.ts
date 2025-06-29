import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from '@movies/dto';
import { UpdateMovieDto } from '@movies/dto/update-movie.dto';
import { RolesGuard } from '@roles/guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/config';
import Roles from '@roles/types/roles.enum';
import { ROLES } from '@roles/decorator';
import { Public } from '@auth/decorators';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @ROLES(Roles.ADMIN, Roles.MANAGER)
  @ApiOperation({ summary: '[ADMIN, MANAGER] добавить кино' })
  async create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary:
      '[ВСЕ] получить все фильмы. ОТЗЫВЫ К ФИЛЬМУ ТЛЬКО ДЛЯ АУТЕТИФИЦИРОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ ВИДНЫ',
  })
  async findAll() {
    return this.moviesService.findAll();
  }

  @Patch('/images/:id')
  @UseInterceptors(FilesInterceptor('images', 5, multerConfig))
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @ROLES(Roles.ADMIN, Roles.MANAGER)
  @ApiOperation({
    summary: '[ADMIN, MANAGER] добавить изображения кино при создании фильма',
  })
  async addImages(
    @Param('id') id: string,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    return this.moviesService.addImages(id, files);
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary:
      '[ВСЕ] получить один фильмы. ОТЗЫВЫ К ФИЛЬМУ ТЛЬКО ДЛЯ АУТЕТИФИЦИРОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ ВИДНЫ',
  })
  async findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @ROLES(Roles.ADMIN, Roles.MANAGER)
  @ApiOperation({
    summary: '[ADMIN, MANAGER] обновить фильм',
  })
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }
}
