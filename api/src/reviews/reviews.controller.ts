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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@roles/guard';
import { ROLES } from '@roles/decorator';
import Roles from '@roles/types/roles.enum';
import { CurrentUser } from '@common/decorators';
import { RequestUser } from '@auth/types';

@ApiBearerAuth()
@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: '[Все аутентифицированные] оставить отзыв' })
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.reviewsService.create(currentUser, createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: '[ФРОНТЕНД] все отзывы к фильму' })
  async findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Все аутентифицированные] получить отзыв по id' })
  async findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[Все аутентифицированные] обновить СВОЙ отзыв' })
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Все аутентифицированные] удалить СВОЙ отзыв' })
  async remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
