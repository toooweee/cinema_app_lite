import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from '@movies/dto';
import { UpdateMovieDto } from '@movies/dto/update-movie.dto';
import { PrismaService } from '@prisma/prisma.service';
import * as path from 'node:path';
import * as fs from 'fs/promises';
import * as process from 'node:process';

@Injectable()
export class MoviesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createMovieDto: CreateMovieDto) {
    const { name, description, link, genres } = createMovieDto;

    return this.prismaService.movie.create({
      data: {
        name,
        description,
        link,
        rating: 0,
        genres: {
          createMany: {
            data: genres.map((genreId) => ({ genreId })),
          },
        },
      },
    });
  }

  async findAll() {
    const movies = await this.prismaService.movie.findMany({
      include: {
        genres: {
          select: {
            genre: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        images: true,
      },
    });

    return movies.map((movie) => ({
      ...movie,
      genres: movie.genres.map((genre) => ({
        id: genre.genre.id,
        name: genre.genre.name,
      })),
    }));
  }

  async addImages(id: string, files: Array<Express.Multer.File>) {
    const savedPaths: string[] = [];

    try {
      return await this.prismaService.movie.update({
        where: {
          id,
        },
        data: {
          images: {
            createMany: {
              data: files.map((file) => {
                const filePath = path.join('uploads', file.filename);
                savedPaths.push(filePath);
                return {
                  path: file.filename,
                };
              }),
            },
          },
        },
        include: {
          images: true,
        },
      });
    } catch {
      for (const filePath of savedPaths) {
        try {
          await fs.unlink(path.join(process.cwd(), filePath));
        } catch {
          console.log('Ошибка удаления файла');
        }
      }
    }
  }

  async findOne(id: string) {
    const movie = await this.prismaService.movie.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        images: true,
        reviews: true,
      },
    });

    return {
      ...movie,
      genres: movie.genres.map((genre) => ({
        id: genre.genre.id,
        name: genre.genre.name,
      })),
      images: movie.images.map((image) => ({
        ...image,
      })),
      reviews: movie.reviews.map((reviews) => ({
        ...reviews,
      })),
    };
  }

  async findOneOrThrow(id: string) {
    return this.prismaService.movie.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    return this.prismaService.movie.update({
      where: {
        id,
      },
      data: {
        ...updateMovieDto,
        genres: {
          connect: updateMovieDto.genres?.map((genreId) => ({
            id: genreId,
          })),
        },
      },
    });
  }
}
