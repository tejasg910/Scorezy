import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { QuestionWithOptions } from "@/modules/teacher/types/question";

const QuestionCard = ({question, index, handleEdit}: {question: QuestionWithOptions, index: number, handleEdit: (question: QuestionWithOptions) => void}) => {

 
  return (
     <Card key={question.id} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-5 flex items-center gap-5">
              {/* Question Number */}
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                {index + 1}
              </div>

              {/* Question Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <Badge variant="outline" className="text-xs font-medium">
                    {question.type === "mcq" ? "MCQ" : "True/False"}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {question.options.length} options
                  </span>
                </div>
                <p className="text-[17px] leading-tight line-clamp-2 text-gray-800">
                  {question.body}
                </p>
              </div>

              {/* Edit Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(question)}
                className="flex items-center gap-2 text-gray-600 hover:text-violet-600"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
            </CardContent>
          </Card>
  )
}

export default QuestionCard