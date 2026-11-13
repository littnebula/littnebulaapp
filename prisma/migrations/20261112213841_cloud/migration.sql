-- CreateEnum
CREATE TYPE "VisibilityType" AS ENUM ('PUBLIC', 'RESTRICTED', 'PRIVATE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bookmarkedWC" INTEGER[],
ADD COLUMN     "editAccessWC" INTEGER[],
ADD COLUMN     "ownedWC" INTEGER[],
ADD COLUMN     "recentlyWC" INTEGER[];

-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "annotation" TEXT NOT NULL,
    "wordcloudId" INTEGER NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordCloud" (
    "id" SERIAL NOT NULL,
    "owner" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bibliography" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],
    "visibility" "VisibilityType" NOT NULL DEFAULT 'PUBLIC',
    "editors" TEXT[],
    "Views" INTEGER NOT NULL,
    "bookmarks" INTEGER NOT NULL,

    CONSTRAINT "WordCloud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "owner" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wordcloudId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_wordcloudId_fkey" FOREIGN KEY ("wordcloudId") REFERENCES "WordCloud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_wordcloudId_fkey" FOREIGN KEY ("wordcloudId") REFERENCES "WordCloud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
