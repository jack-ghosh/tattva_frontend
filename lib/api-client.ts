const BASE = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')

// Types
export interface RegisterParams {
  displayName: string
  username: string
  password: string
  mobileNumber?: string
}

export interface LoginParams {
  identifier: string
  password: string
}

export interface SubmitExamParams {
  examId: string
  userId: string
  examType: '15MIN' | '30MIN' | 'RRB'
  maxScore: number
  responses: { qId: string; userAns: string | null }[]
}

export interface Question {
  id: string
  text: string
  options: { key: string; text: string }[]
  correctAnswer: string
  explanation: string
}

export interface AdminQuestion {
  id: string
  subject: string
  topic: string
  question: string
  options: { a: string; b: string; c: string; d: string }
  correctAns: string
  explanation: string
  difficulty: string
  createdAt: string
}

// 1. Register User
export async function registerUser(params: RegisterParams) {
  const response = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  const data = await response.json()
  return data as {
    status: string
    id?: string
    username?: string
    displayName?: string
    role?: string
    error?: string
  }
}

// 2. Login User
export async function loginUser(params: LoginParams) {
  const response = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  const data = await response.json()
  return data as {
    status: string
    id?: string
    username?: string
    displayName?: string
    role?: string
    error?: string
  }
}

// 3. Start Exam
export async function startExam(examType: '15MIN' | '30MIN' | 'RRB') {
  const response = await fetch(`${BASE}/api/exam`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ examType }),
  })
  const data = await response.json()
  return data as {
    status: string
    examId: string
    examType: string
    durationMinutes: number
    totalQuestions: number
    maxScore: number
    questions: Question[]
    expiresAt: string
  }
}

// 4. Submit Exam
export async function submitExam(params: SubmitExamParams) {
  const response = await fetch(`${BASE}/api/exam/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  const data = await response.json()
  return data as {
    success: boolean
    data?: {
      attemptId: string
      score: number
      correct: number
      wrong: number
      unattempted: number
      percentage: number
    }
    error?: string
  }
}

// 5. Fetch Results
export async function fetchResults(attemptId: string) {
  const response = await fetch(`${BASE}/api/exam/results/${attemptId}`)
  const data = await response.json()
  return data as {
    success: boolean
    data?: {
      score: number
      correctCount: number
      wrongCount: number
      unattempted: number
      percentage: number
      wrongQuestions: (Question & { userAnswer: string | null })[]
      unattemptedQuestions: Question[]
    }
    error?: string
  }
}

// 6. Fetch Attempts
export async function fetchAttempts(userId: string) {
  const response = await fetch(`${BASE}/api/attempts?userId=${userId}`)
  const data = await response.json()
  return data as {
    success: boolean
    data?: {
      id: string
      date: string
      score: number
      percentage: number
      correctCount: number
      wrongCount: number
      unattempted: number
    }[]
    error?: string
  }
}

// 7. Fetch Admin Question
export async function fetchAdminQuestion(page: number, userId: string) {
  const response = await fetch(`${BASE}/api/admin/review?page=${page}`, {
    headers: { 'x-user-id': userId },
  })
    const data = await response.json()
  return data as {
    success: boolean
    data?: {
      total: number
      current: number
      question: AdminQuestion
    }
    error?: string
  }
}

// 8. Approve or Delete Question
export async function approveOrDeleteQuestion(questionId: string, action: 'approve' | 'delete', userId: string) {
  const response = await fetch(`${BASE}/api/admin/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
    body: JSON.stringify({ questionId, action }),
  })

  const data = await response.json()
  return data as { success: boolean; error?: string }
}

// 9. Fetch Admin Stats
export async function fetchAdminStats(userId: string) {
  const response = await fetch(`${BASE}/api/admin/stats`, {
    headers: { 'x-user-id': userId },
  })
    const data = await response.json()
  return data as {
    success: boolean
    data?: {
      total: number
      vetted: number
      active: number
      failed: number
    }
    error?: string
  }
}
