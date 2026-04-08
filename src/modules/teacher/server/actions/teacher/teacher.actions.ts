// "use server";

// import { db } from "@/db";
// import { quizzes } from "@/db/schema";
// import { revalidatePath } from "next/cache";

// export async function createQuiz(data: { title: string }) {
//   await db.insert(quizzes).values({ id: crypto.randomUUID(), classroomId: "default", title: data.title });
    

//   revalidatePath("/teacher");
// }