import Quizzes from "@/modules/teacher/ui/quizzes"

export default async function Page({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) 
{
    const { id } = await params
    const resolvedParams = await searchParams;
    const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page) : 1;

return (
   <Quizzes id={id} page={page} />
)
}

