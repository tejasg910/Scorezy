// types/quiz.ts
export type Quiz = {
  id: string;
  classroomId: string;           // optional since getQuizzesByClassroom may not return it
  title: string;
  description: string | null;
  status: 'draft' | 'published' | 'closed';
  opensAt: Date | null;
  closesAt: Date | null;
  createdAt: Date;
  passingMarks: number | null;
 timeLimit: number | null;
};
export type QuizState = {
  error?: string;
  success?: boolean;
  quizId?: string;   // Useful for redirecting to quiz editor
};