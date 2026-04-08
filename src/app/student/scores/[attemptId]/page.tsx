import { getSession } from "@/app/auth/lib/session";
import { redirect, notFound } from "next/navigation";
import { getAttemptDetails } from "@/modules/student/server/actions/student.queries";
import { AttemptDetailsUI } from "@/modules/student/ui/scores/details";

export default async function AttemptDetailsPage({ params }: { params: { attemptId: string } }) {
  const session = await getSession();
  
  if (!session) redirect("/auth/sign-in");
  
  const { attemptId } = await params;
  const attempt = await getAttemptDetails(attemptId, session.user.id);

  if (!attempt) {
    return notFound();
  }

  return <AttemptDetailsUI attempt={attempt} />;
}
