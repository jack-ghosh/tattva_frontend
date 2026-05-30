'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useExamStore } from '@/lib/exam-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Clock, Target, LogOut, History, Shield, Loader2 } from 'lucide-react'

const examConfigs = [
  {
    id: '15MIN' as const,
    title: '15 Minute Sprint',
    questions: 25,
    duration: 15,
    maxScore: 50,
    difficulty: { easy: 8, medium: 12, hard: 5 },
    description: 'Quick practice session for daily revision',
    icon: Clock,
  },
  {
    id: '30MIN' as const,
    title: '30 Minute Challenge',
    questions: 50,
    duration: 30,
    maxScore: 100,
    difficulty: { easy: 15, medium: 25, hard: 10 },
    description: 'Comprehensive practice with moderate time pressure',
    icon: Target,
  },
  {
    id: 'RRB' as const,
    title: 'RRB Full Mock',
    questions: 100,
    duration: 90,
    maxScore: 200,
    difficulty: { easy: 30, medium: 50, hard: 20 },
    description: 'Full-length mock test simulating actual RRB NTPC exam',
    icon: BookOpen,
  },
]

export default function PreviewPage() {
  const router = useRouter()
  const {
    isLoggedIn,
    _hasHydrated,
    displayName,
    role,
    isLoadingQuestions,
    questionsError,
    examType: loadingExamType,
    examQuestions,
    logout,
    loadExamQuestions,
  } = useExamStore()

  useEffect(() => {
    if (_hasHydrated && !isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, _hasHydrated, router])

  useEffect(() => {
    if (questionsError) {
      toast.error(questionsError)
    }
  }, [questionsError])

  useEffect(() => {
    if (examQuestions && examQuestions.length > 0) {
      router.push('/exam')
    }
  }, [examQuestions, router])

  const handleStartExam = async (examType: '15MIN' | '30MIN' | 'RRB') => {
    await loadExamQuestions(examType)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!_hasHydrated) return null
  if (!isLoggedIn) return null

  const isAdmin = role === 'ADMIN' || role === 'GUIDE'

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Tattva</span>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link href="/history">
                <History className="h-4 w-4 mr-2" />
                History
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {displayName}
            </h1>
            <p className="text-muted-foreground">
              Choose an exam type to start practicing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {examConfigs.map((exam) => {
              const isLoading = isLoadingQuestions && loadingExamType === exam.id

              return (
                <Card key={exam.id} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <exam.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{exam.title}</CardTitle>
                    <CardDescription>{exam.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Questions</span>
                        <span className="font-medium text-foreground">{exam.questions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium text-foreground">{exam.duration} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Score</span>
                        <span className="font-medium text-foreground">{exam.maxScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Scoring</span>
                        <span className="font-medium text-foreground">+2 / -0.67 / 0</span>
                      </div>
                      <div className="pt-2 border-t border-border mt-2">
                        <p className="text-muted-foreground mb-1">Difficulty Distribution:</p>
                        <div className="flex gap-2 text-xs">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                            Easy: {exam.difficulty.easy}
                          </span>
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">
                            Med: {exam.difficulty.medium}
                          </span>
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                            Hard: {exam.difficulty.hard}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleStartExam(exam.id)}
                      disabled={isLoadingQuestions}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Start Exam'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
