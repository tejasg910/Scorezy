import QuizDetailPage from "@/modules/teacher/ui/questions"
import Quizzes from "@/modules/teacher/ui/quizzes"

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ id: string, quizId: string }>,
    searchParams: Promise<{ page: string }>
}) {
    const { id, quizId } = await params
    const { page } = await searchParams

    return (
        <QuizDetailPage quizId={quizId} classroomId={id} currentPage={page} />
    )
}

