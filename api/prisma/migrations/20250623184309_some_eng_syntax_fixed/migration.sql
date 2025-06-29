/*
  Warnings:

  - You are about to drop the column `modie_id` on the `movie_genres` table. All the data in the column will be lost.
  - Added the required column `movie_id` to the `movie_genres` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "movie_genres" DROP CONSTRAINT "movie_genres_modie_id_fkey";

-- AlterTable
ALTER TABLE "movie_genres" DROP COLUMN "modie_id",
ADD COLUMN     "movie_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
