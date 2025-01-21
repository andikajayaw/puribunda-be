/*
  Warnings:

  - You are about to drop the column `userId` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the `PositionOnUsers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Position` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Unit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PositionOnUsers" DROP CONSTRAINT "PositionOnUsers_positionId_fkey";

-- DropForeignKey
ALTER TABLE "PositionOnUsers" DROP CONSTRAINT "PositionOnUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_userId_fkey";

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "jumlahLogin" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unitId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "PositionOnUsers";

-- CreateTable
CREATE TABLE "_PositionOnUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PositionOnUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PositionOnUsers_B_index" ON "_PositionOnUsers"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PositionOnUsers" ADD CONSTRAINT "_PositionOnUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PositionOnUsers" ADD CONSTRAINT "_PositionOnUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
