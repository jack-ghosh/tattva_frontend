"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  fetchAdminQuestion,
  fetchAdminStats,
  approveOrDeleteQuestion,
} from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  SkipForward,
  ExternalLink,
  Loader2,
  FileQuestion,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useExamStore } from "@/lib/exam-store";

interface AdminQuestion {
  id: string;
  subject: string;
  topic: string;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correctAns: string;
  explanation: string;
  difficulty: string;
  createdAt: string;
}

interface AdminStats {
  total: number;
  vetted: number;
  active: number;
  failed: number;
}

export default function AdminPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [question, setQuestion] = useState<AdminQuestion | null>(null);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const router = useRouter();
  const role = useExamStore((state) => state.role);
  const userId = useExamStore((state) => state.userId);
  const isLoggedIn = useExamStore((state) => state.isLoggedIn);
  const _hasHydrated = useExamStore((state) => state._hasHydrated);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isLoggedIn || role !== "ADMIN") {
      router.replace("/");
    }
  }, [_hasHydrated, isLoggedIn, role, router]);

  const loadQuestion = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const response = await fetchAdminQuestion(page, userId!);
        if (response.success && response.data) {
          setQuestion(response.data.question);
          setTotal(response.data.total);
          setCurrent(response.data.current);
          setCurrentPage(page);
        } else {
          setQuestion(null);
        }
      } catch {
        toast.error("Failed to load question");
      } finally {
        setIsLoading(false);
      }
    },
    [userId],
  );

  const loadStats = useCallback(async () => {
    try {
      const response = await fetchAdminStats(userId!);
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch {
      console.error("Failed to load stats");
    }
  }, [userId]);

  useEffect(() => {
    loadQuestion(0);
    loadStats();
  }, [loadQuestion, loadStats]);

  const handleAction = useCallback(
    async (action: "approve" | "delete") => {
      if (!question) return;

      setIsActionLoading(true);
      try {
        const response = await approveOrDeleteQuestion(
          question.id,
          action,
          userId!,
        );
        if (response.success) {
          toast.success(
            action === "approve" ? "Question approved!" : "Question deleted!",
          );
          loadQuestion(currentPage);
          loadStats();
        } else {
          toast.error(response.error || "Action failed");
        }
      } catch {
        toast.error("Something went wrong");
      } finally {
        setIsActionLoading(false);
      }
    },
    [question, currentPage, loadQuestion, loadStats, userId],
  );

  const handleSkip = useCallback(() => {
    loadQuestion(currentPage + 1);
  }, [currentPage, loadQuestion]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isActionLoading || isLoading || !question) return;

      if (e.key.toLowerCase() === "f") {
        handleAction("approve");
      } else if (e.key.toLowerCase() === "d") {
        handleAction("delete");
      } else if (e.key.toLowerCase() === "j") {
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActionLoading, isLoading, question, handleAction, handleSkip]);

  const handleGoogleSearch = () => {
    if (!question) return;
    const query = encodeURIComponent(question.question);
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
  };

  // Transform options object to array
  const optionsArray = question
    ? Object.entries(question.options).map(([key, text]) => ({ key, text }))
    : [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Tattva</span>
          </Link>
          <div className="text-sm text-muted-foreground">
            Admin Review Panel
          </div>
        </div>
      </header>

      <main className="py-8 px-4">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="py-4 text-center">
                {stats ? (
                  <>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.total}
                    </p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </>
                ) : (
                  <Skeleton className="h-10 w-16 mx-auto" />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                {stats ? (
                  <>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.vetted}
                    </p>
                    <p className="text-xs text-muted-foreground">Vetted</p>
                  </>
                ) : (
                  <Skeleton className="h-10 w-16 mx-auto" />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                {stats ? (
                  <>
                    <p className="text-2xl font-bold text-primary">
                      {stats.active}
                    </p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </>
                ) : (
                  <Skeleton className="h-10 w-16 mx-auto" />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                {stats ? (
                  <>
                    <p className="text-2xl font-bold text-destructive">
                      {stats.failed}
                    </p>
                    <p className="text-xs text-muted-foreground">Failed</p>
                  </>
                ) : (
                  <Skeleton className="h-10 w-16 mx-auto" />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Question {current} of {total}
                </CardTitle>
                {isLoading && (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ) : question ? (
                <div className="space-y-6">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{question.subject}</Badge>
                    <Badge variant="outline">{question.topic}</Badge>
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                  </div>

                  {/* Question Text */}
                  <div>
                    <p className="text-lg text-foreground leading-relaxed">
                      {question.question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {optionsArray.map((option) => {
                      const isCorrect = option.key === question.correctAns;

                      return (
                        <div
                          key={option.key}
                          className={cn(
                            "p-3 rounded-lg border text-sm flex items-center gap-3",
                            isCorrect
                              ? "bg-green-50 border-green-200"
                              : "bg-background border-border",
                          )}
                        >
                          <span
                            className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                              isCorrect
                                ? "bg-green-500 text-white"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            {option.key.toUpperCase()}
                          </span>
                          <span
                            className={cn(
                              isCorrect
                                ? "text-green-800 font-medium"
                                : "text-foreground",
                            )}
                          >
                            {option.text}
                          </span>
                          {isCorrect && (
                            <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">
                      Explanation:
                    </p>
                    <p className="text-sm text-foreground">
                      {question.explanation}
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                    <span title={question.id}>
                      ID: {question.id.slice(0, 8)}...
                    </span>
                    <span>
                      Created:{" "}
                      {new Date(question.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Questions to Review
                  </h3>
                  <p className="text-muted-foreground">
                    All questions have been reviewed
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {question && (
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleAction("approve")}
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Approve (F)
              </Button>
              <Button
                size="lg"
                variant="destructive"
                onClick={() => handleAction("delete")}
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Delete (D)
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleSkip}
                disabled={isActionLoading || isLoading}
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Skip (J)
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={handleGoogleSearch}
                disabled={isActionLoading}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Google Search
              </Button>
            </div>
          )}

          {/* Keyboard Shortcuts Help */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Keyboard shortcuts:{" "}
              <kbd className="px-2 py-1 bg-muted rounded text-xs">F</kbd>{" "}
              Approve ·{" "}
              <kbd className="px-2 py-1 bg-muted rounded text-xs">D</kbd> Delete
              · <kbd className="px-2 py-1 bg-muted rounded text-xs">J</kbd> Skip
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
