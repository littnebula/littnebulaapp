-- AlterTable
ALTER TABLE "Word" ALTER COLUMN "annotation" SET DEFAULT '';

-- AlterTable
ALTER TABLE "WordCloud" ALTER COLUMN "displayCount" SET DEFAULT 10,
ALTER COLUMN "sourceTotal" SET DEFAULT 1;
