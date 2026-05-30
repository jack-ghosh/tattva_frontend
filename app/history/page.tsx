"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useExamStore } from "@/lib/exam-store";
import { fetchAttempts } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  Eye,
} from "lucide-react";

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
    if (_hasHydrated && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, _hasHydrated, router]);

  useEffect(() => {
    async function loadAttempts() {
      if (!userId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchAttempts(userId);
        if (response.success && response.data) {
          setAttempts(response.data);
        } else {
          setError(response.error || "Failed to load history");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAttempts();
  }, [userId]);

  if (!_hasHydrated) return null;
  if (!isLoggedIn) {
    return null;
  }

  // Calculate summary stats
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
      <header className="border-b border-border sticky top-0 z-10 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Tattva</span>
          </Link>
          <Button asChild>
            <Link href="/preview">Home</Link>
          </Button>
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="mx-auto max-w-6xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Exam History
            </h1>
            <p className="text-muted-foreground">
              Track your progress over time
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Total Attempts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-bold text-foreground">
                    {totalAttempts}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Avg Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-bold text-foreground">
                    {avgScore.toFixed(1)}%
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Best Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-bold text-foreground">
                    {bestScore.toFixed(1)}%
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Pass Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-bold text-foreground">
                    {passRate.toFixed(1)}%
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Attempts Table */}
          <Card>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-destructive">{error}</p>
                </div>
              ) : attempts.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Exams Yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start your first exam to see your history here
                  </p>
                  <Button asChild>
                    <Link href="/preview">Take Your First Exam</Link>
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right">Correct</TableHead>
                      <TableHead className="text-right">Wrong</TableHead>
                      <TableHead className="text-right">Skipped</TableHead>
                      <TableHead className="text-right">%</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attempts.map((attempt) => {
                      const isPassed = attempt.percentage >= 40;
                      return (
                        <TableRow key={attempt.id}>
                          <TableCell>
                            {new Date(attempt.date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {attempt.score.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {attempt.correctCount}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {attempt.wrongCount}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {attempt.unattempted}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {attempt.percentage.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={isPassed ? "default" : "destructive"}
                              className={
                                isPassed
                                  ? "bg-green-500 hover:bg-green-600"
                                  : ""
                              }
                            >
                              {isPassed ? "Pass" : "Fail"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/results/${attempt.id}`}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
