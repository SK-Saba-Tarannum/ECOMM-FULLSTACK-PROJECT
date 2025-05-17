/*
  Warnings:

  - The `role` column on the `UserRegister` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `name` on table `UserRegister` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `UserRegister` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "UserRegister" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
