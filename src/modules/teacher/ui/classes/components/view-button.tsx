"use client"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

const ClassViewButton = ({id}:{id:string}) => {
    const router = useRouter()
    const handleNavigate = () => {
        router.push(`/teacher/dashboard/${id}`)
    }
  return (
    <Button onClick={handleNavigate} >View</Button>
  )
}

export default ClassViewButton