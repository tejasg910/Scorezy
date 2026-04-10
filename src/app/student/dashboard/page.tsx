import StudentRoot from '@/modules/student/ui/dashboard'

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page) : 1;
  return (
    <StudentRoot page={page} />
  )
}

