/*
  Warnings:

  - Added the required column `userId` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "PositionOnUsers" (
    "userId" INTEGER NOT NULL,
    "positionId" INTEGER NOT NULL,

    CONSTRAINT "PositionOnUsers_pkey" PRIMARY KEY ("userId","positionId")
);

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionOnUsers" ADD CONSTRAINT "PositionOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionOnUsers" ADD CONSTRAINT "PositionOnUsers_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
