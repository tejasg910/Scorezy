import { db } from "@/db";
import { classrooms } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getClassrooms(teacherId: string) {
  const classroomsData = await db.select().from(classrooms).where(eq(classrooms.teacherId, teacherId)).orderBy(desc(classrooms.createdAt));

        

  return classroomsData;
}