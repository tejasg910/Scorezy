import { create } from "zustand";

interface TestStore {
  attemptId: string | null;
  quizId: string | null;
  answers: Record<string, string>; // questionId -> optionId
  timeRemaining: number | null; // in seconds
  isSubmitting: boolean;
  currentQuestionIndex: number;

  setAttempt: (attemptId: string, quizId: string, initialTimeRemaining: number) => void;
  setAnswer: (questionId: string, optionId: string) => void;
  setCurrentQuestionIndex: (index: number) => void;
  decrementTime: () => void;
  setSubmitting: (flag: boolean) => void;
  clearStore: () => void;
}

export const useTestStore = create<TestStore>((set) => ({
  attemptId: null,
  quizId: null,
  answers: {},
  timeRemaining: null,
  isSubmitting: false,
  currentQuestionIndex: 0,

  setAttempt: (attemptId, quizId, initialTimeRemaining) =>
    set({ attemptId, quizId, timeRemaining: initialTimeRemaining, answers: {}, isSubmitting: false, currentQuestionIndex: 0 }),

  setAnswer: (questionId, optionId) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: optionId,
      },
    })),

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  decrementTime: () =>
    set((state) => ({
      timeRemaining: state.timeRemaining !== null && state.timeRemaining > 0 ? state.timeRemaining - 1 : 0,
    })),

  setSubmitting: (flag) => set({ isSubmitting: flag }),

  clearStore: () =>
    set({ attemptId: null, quizId: null, answers: {}, timeRemaining: null, isSubmitting: false, currentQuestionIndex: 0 }),
}));
