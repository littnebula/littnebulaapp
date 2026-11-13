/*
  Warnings:

  - Added the required column `displayCount` to the `WordCloud` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceTotal` to the `WordCloud` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WordCloud" ADD COLUMN     "displayCount" INTEGER NOT NULL,
ADD COLUMN     "sourceTotal" INTEGER NOT NULL,
ALTER COLUMN "bookmarks" SET DEFAULT 0,
ALTER COLUMN "views" SET DEFAULT 0;
