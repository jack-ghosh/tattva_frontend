import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface Question {
  id: string
  text: string
  options: { key: string; text: string }[]
  correctAnswer: string
  explanation: string
}

interface ExamState {
  // Hydration state
  _hasHydrated: boolean

  // Auth state
  userId: string | null
  displayName: string | null
  username: string | null
  role: string | null
  isLoggedIn: boolean

  // Exam state
  examId: string | null
  examType: '15MIN' | '30MIN' | 'RRB' | null
  examQuestions: Question[] | null
  currentAnswers: Record<string, string>
  examStartTime: number | null
  isExamActive: boolean
  durationMinutes: number | null
  totalQuestions: number | null
  maxScore: number | null
  expiresAt: string | null

  // Loading state
  isLoadingQuestions: boolean
  questionsError: string | null

  // Actions
  login: (userId: string, displayName: string, username: string, role: string) => void
  logout: () => void
  setAnswer: (questionId: string, key: string) => void
  startExam: () => void
  clearCurrentExam: () => void
  loadExamQuestions: (examType: '15MIN' | '30MIN' | 'RRB') => Promise<void>
  clearExamQuestions: () => void
}

export const useExamStore = create<ExamState>()(
  persist(
    (set) => ({
      // Initial hydration state
      _hasHydrated: false,

      // Initial auth state
      userId: null,
      displayName: null,
      username: null,
      role: null,
      isLoggedIn: false,

      // Initial exam state
      examId: null,
      examType: null,
      examQuestions: null,
      currentAnswers: {},
      examStartTime: null,
      isExamActive: false,
      durationMinutes: null,
      totalQuestions: null,
      maxScore: null,
      expiresAt: null,

      // Initial loading state
      isLoadingQuestions: false,
      questionsError: null,

      // Actions
      login: (userId, displayName, username, role) =>
        set({
          userId,
          displayName,
          username,
          role,
          isLoggedIn: true,
        }),

      logout: () =>
        set({
          userId: null,
          displayName: null,
          username: null,
          role: null,
          isLoggedIn: false,
          examId: null,
          examType: null,
          examQuestions: null,
          currentAnswers: {},
          examStartTime: null,
          isExamActive: false,
          durationMinutes: null,
          totalQuestions: null,
          maxScore: null,
          expiresAt: null,
        }),

      setAnswer: (questionId, key) =>
        set((state) => ({
          currentAnswers: {
            ...state.currentAnswers,
            [questionId]: key,
          },
        })),

      startExam: () =>
        set({
          isExamActive: true,
          examStartTime: Date.now(),
        }),

      clearCurrentExam: () =>
        set({
          examId: null,
          examType: null,
          examQuestions: null,
          currentAnswers: {},
          examStartTime: null,
          isExamActive: false,
          durationMinutes: null,
          totalQuestions: null,
          maxScore: null,
          expiresAt: null,
          questionsError: null,
        }),

      loadExamQuestions: async (examType) => {
        set({ isLoadingQuestions: true, questionsError: null })

        try {
          const response = await fetch(`${BASE}/api/exam`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ examType }),
          })

          const data = await response.json()

          if (!response.ok || data.status !== 'ok') {
            throw new Error(data.error || 'Failed to load exam questions')
          }

          set({
            examId: data.examId,
            examType: data.examType,
            examQuestions: data.questions,
            durationMinutes: data.durationMinutes,
            totalQuestions: data.totalQuestions,
            maxScore: data.maxScore,
            expiresAt: data.expiresAt,
            currentAnswers: {},
            isLoadingQuestions: false,
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load questions'
          set({ questionsError: message, isLoadingQuestions: false })
        }
      },

      clearExamQuestions: () =>
        set({
          examQuestions: null,
          questionsError: null,
        }),
    }),
    {
      name: 'tattva-exam-storage',
      onRehydrateStorage: () => (state) => {
        if (state) state._hasHydrated = true
      },
    }
  )
)
