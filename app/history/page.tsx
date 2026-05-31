"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useExamStore } from "@/lib/exam-store";
import { fetchAttempts } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  Eye,
  CheckCircle,
  XCircle,
  MinusCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Attempt {
  id: string;
  date: string;
  score: number;
  percentage: number;
  correctCount: number;
  wrongCount: number;
  unattempted: number;
}

export default function HistoryPage() {
  const router = useRouter();
  const { isLoggedIn, _hasHydrated, userId } = useExamStore();

  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (_hasHydrated && !isLoggedIn) router.push("/login");
  }, [isLoggedIn, _hasHydrated, router]);

  useEffect(() => {
    async function loadAttempts() {
      if (!userId) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchAttempts(userId);
        if (response.success && response.data) setAttempts(response.data);
        else setError(response.error || "Failed to load history");
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    loadAttempts();
  }, [userId]);

  if (!_hasHydrated) return null;
  if (!isLoggedIn) return null;

  const totalAttempts = attempts.length;
  const avgScore =
    totalAttempts > 0
      ? attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts
      : 0;
  const bestScore =
    totalAttempts > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0;
  const passCount = attempts.filter((a) => a.percentage >= 40).length;
  const passRate = totalAttempts > 0 ? (passCount / totalAttempts) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header — consistent with exam/results pages */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 h-12 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">Tattva</span>
            <span className="hidden sm:inline text-xs text-muted-foreground border-l border-border pl-2 ml-1">
              History
            </span>
          </div>
          <Button size="sm" asChild className="h-8 px-3 text-sm">
            <Link href="/preview">New Exam</Link>
          </Button>
        </div>
        <div className="h-0.5 bg-muted" />
      </header>

      <main className="py-8 px-4 pb-16">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Page title */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Exam History</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track your progress over time
            </p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                icon: <BarChart3 className="h-4 w-4" />,
                label: "Total Attempts",
                value: isLoading ? null : totalAttempts,
                unit: "",
              },
              {
                icon: <TrendingUp className="h-4 w-4" />,
                label: "Avg Score",
                value: isLoading ? null : avgScore.toFixed(1),
                unit: "%",
              },
              {
                icon: <Award className="h-4 w-4" />,
                label: "Best Score",
                value: isLoading ? null : bestScore.toFixed(1),
                unit: "%",
              },
              {
                icon: <Target className="h-4 w-4" />,
                label: "Pass Rate",
                value: isLoading ? null : passRate.toFixed(1),
                unit: "%",
              },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="pb-1 pt-4 px-4">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    {stat.icon}
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4 px-4">
                  {stat.value === null ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground tabular-nums">
                      {stat.value}
                      {stat.unit}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Attempts list */}
          <Card>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              ) : attempts.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Exams Yet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start your first exam to see your history here
                  </p>
                  <Button asChild>
                    <Link href="/preview">Take Your First Exam</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {attempts.map((attempt) => {
                    const isPassed = attempt.percentage >= 40;
                    return (
                      // FIX #6: entire row is clickable, View Results is prominent CTA
                      <Link
                        key={attempt.id}
                        href={`/results/${attempt.id}`}
                        className={cn(
                          "group flex items-center gap-3 sm:gap-4 px-4 py-3.5 rounded-xl border transition-all",
                          "hover:bg-muted/50 hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          isPassed
                            ? "border-emerald-100 dark:border-emerald-900/60"
                            : "border-red-100 dark:border-red-900/60",
                        )}
                      >
                        {/* Pass/Fail indicator */}
                        <div
                          className={cn(
                            "shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                            isPassed
                              ? "bg-emerald-100 dark:bg-emerald-950"
                              : "bg-red-100 dark:bg-red-950",
                          )}
                        >
                          <span
                            className={cn(
                              "text-xs font-bold",
                              isPassed
                                ? "text-emerald-700 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400",
                            )}
                          >
                            {attempt.percentage.toFixed(0)}%
                          </span>
                        </div>

                        {/* Date + score */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {new Date(attempt.date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                            <Badge
                              className={cn(
                                "ml-2 text-xs px-1.5 py-0",
                                isPassed
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 hover:bg-emerald-100"
                                  : "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 hover:bg-red-100",
                              )}
                            >
                              {isPassed ? "Pass" : "Fail"}
                            </Badge>
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Score:{" "}
                            <span className="font-medium text-foreground">
                              {attempt.score.toFixed(2)}
                            </span>
                          </p>
                        </div>

                        {/* Mini stat chips */}
                        <div className="hidden sm:flex items-center gap-2 text-xs shrink-0">
                          <span className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle className="h-3.5 w-3.5" />
                            {attempt.correctCount}
                          </span>
                          <span className="flex items-center gap-1 text-red-500">
                            <XCircle className="h-3.5 w-3.5" />
                            {attempt.wrongCount}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MinusCircle className="h-3.5 w-3.5" />
                            {attempt.unattempted}
                          </span>
                        </div>

                        {/* View Results CTA — prominent, always visible */}
                        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold group-hover:bg-primary/90 transition-colors">
                          <Eye className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">View Results</span>
                          <ArrowRight className="h-3.5 w-3.5 sm:hidden" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
