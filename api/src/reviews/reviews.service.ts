import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '@prisma/prisma.service';
import { RequestUser } from '@auth/types';
import { UsersService } from '@users/users.service';
import { MoviesService } from '@movies/movies.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly moviesService: MoviesService,
  ) {}

  async create(currentUser: RequestUser, createReviewDto: CreateReviewDto) {
    const { movieId } = createReviewDto;

    const user = await this.usersService.findOne({ id: currentUser.sub });

    if (!user) {
      throw new NotFoundException(`User with id ${currentUser.sub} not found`);
    }

    const review = await this.prismaService.review.create({
      data: {
        ...createReviewDto,
        movieId,
        userId: user.id,
      },
    });

    await this.moviesService.calculateRating(movieId);

    return review;
  }

  async findAll() {
    return this.prismaService.review.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.review.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    return this.prismaService.review.update({
      where: {
        id,
      },
      data: {
        ...updateReviewDto,
      },
    });
  }

  async remove(id: string) {
    return this.prismaService.review.delete({
      where: {
        id,
      },
    });
  }
}
