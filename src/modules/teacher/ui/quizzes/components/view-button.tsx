"use client"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

const QuestionEditButton = ({id, quizId}:{id:string, quizId:string}) => {
    const router = useRouter()
    const handleNavigate = () => {
        router.push(`/teacher/dashboard/${id}/${quizId}`)
    }
  return (
    <Button 
      variant="outline" 
      onClick={handleNavigate} 
      className="w-full rounded-none border-white/10 text-[#a1a1aa] hover:text-[#f0eeff] hover:bg-white/5 font-heading font-bold uppercase tracking-widest text-[10px] h-9 px-4"
    >
      Manage Vault
    </Button>
  )
}

export default QuestionEditButton