/*
  Warnings:

  - You are about to drop the `actors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `movie_actors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "movie_actors" DROP CONSTRAINT "movie_actors_actor_id_fkey";

-- DropForeignKey
ALTER TABLE "movie_actors" DROP CONSTRAINT "movie_actors_movie_id_fkey";

-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "actors";

-- DropTable
DROP TABLE "movie_actors";
