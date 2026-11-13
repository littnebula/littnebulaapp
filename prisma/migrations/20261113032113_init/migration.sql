/*
  Warnings:

  - You are about to drop the column `bookmarkedWC` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `editAccessWC` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ownedWC` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `recentlyWC` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Views` on the `WordCloud` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `WordCloud` table without a default value. This is not possible if the table is not empty.
  - Added the required column `views` to the `WordCloud` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "bookmarkedWC",
DROP COLUMN "editAccessWC",
DROP COLUMN "ownedWC",
DROP COLUMN "recentlyWC";

-- AlterTable
ALTER TABLE "WordCloud" DROP COLUMN "Views",
ADD COLUMN     "creatorId" INTEGER NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ViewedWC" (
    "userId" INTEGER NOT NULL,
    "wordcloudId" INTEGER NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ViewedWC_pkey" PRIMARY KEY ("userId","wordcloudId")
);

-- CreateTable
CREATE TABLE "BookmarkedWC" (
    "userId" INTEGER NOT NULL,
    "wordcloudId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookmarkedWC_pkey" PRIMARY KEY ("userId","wordcloudId")
);

-- CreateTable
CREATE TABLE "_EditAccessWC" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EditAccessWC_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EditAccessWC_B_index" ON "_EditAccessWC"("B");

-- AddForeignKey
ALTER TABLE "WordCloud" ADD CONSTRAINT "WordCloud_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewedWC" ADD CONSTRAINT "ViewedWC_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewedWC" ADD CONSTRAINT "ViewedWC_wordcloudId_fkey" FOREIGN KEY ("wordcloudId") REFERENCES "WordCloud"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkedWC" ADD CONSTRAINT "BookmarkedWC_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkedWC" ADD CONSTRAINT "BookmarkedWC_wordcloudId_fkey" FOREIGN KEY ("wordcloudId") REFERENCES "WordCloud"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EditAccessWC" ADD CONSTRAINT "_EditAccessWC_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EditAccessWC" ADD CONSTRAINT "_EditAccessWC_B_fkey" FOREIGN KEY ("B") REFERENCES "WordCloud"("id") ON DELETE CASCADE ON UPDATE CASCADE;
