-- AlterTable: convert single image to images array
ALTER TABLE "portfolio" ADD COLUMN "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Migrate existing data: copy non-empty image values into the new images array
UPDATE "portfolio" SET "images" = ARRAY["image"] WHERE "image" IS NOT NULL AND "image" != '';

-- Drop old column
ALTER TABLE "portfolio" DROP COLUMN "image";
