/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teacherId]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Student.studentId_unique" ON "Student"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher.teacherId_unique" ON "Teacher"("teacherId");
