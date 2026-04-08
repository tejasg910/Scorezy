"use client"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

const QuestionEditButton = ({id, quizId}:{id:string, quizId:string}) => {
    const router = useRouter()
    const handleNavigate = () => {
        router.push(`/teacher/dashboard/${id}/${quizId}`)
    }
  return (
    <Button onClick={handleNavigate} >Edit</Button>
  )
}

export default QuestionEditButton