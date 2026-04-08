import Quizzes from "@/modules/teacher/ui/quizzes"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) 
{
    const { id } = await params

return (
   <Quizzes id={id} />
)
}

