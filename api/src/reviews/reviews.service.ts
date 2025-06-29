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

  async create(
    currentUser: RequestUser,
    movieId: string,
    createReviewDto: CreateReviewDto,
  ) {
    const user = await this.usersService.findOne({ id: currentUser.sub });

    if (!user) {
      throw new NotFoundException(`User with id ${currentUser.sub} not found`);
    }

    return this.prismaService.review.create({
      data: {
        ...createReviewDto,
        movieId,
        userId: user.id,
      },
    });
  }

  async findAll() {
    return this.prismaService.review.findMany();
  }

  async findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  async remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
