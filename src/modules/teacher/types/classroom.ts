
export type Classroom = {
  id: string;
  teacherId: string;
  name: string;
  inviteCode: string;
  isActive: boolean;
  createdAt: string | Date;
  studentCount?: number;
};

export type ClassroomState = {
  error?: string;
  success?: boolean;
};