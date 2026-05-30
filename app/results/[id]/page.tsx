"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useExamStore } from "@/lib/exam-store";
import { fetchResults } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  MinusCircle,
  ChevronDown,
  RefreshCw,
  History,
  Sparkles,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  text: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

interface ResultsData {
  score: number;
  correctCount: number;
  wrongCount: number;
  unattempted: number;
  percentage: number;
  wrongQuestions: (Question & { userAnswer: string | null })[];
  unattemptedQuestions: Question[];
}

// ─── Score arc hero ───────────────────────────────────────────────────────────
function ScoreArc({
  percentage,
  isPassed,
}: {
  percentage: number;
  isPassed: boolean;
}) {
  // Half-donut arc (180°). SVG viewBox 0 0 200 110
  const radius = 80;
  const cx = 100;
  const cy = 100;
  // Arc length for a semicircle
  const arcLength = Math.PI * radius; // ~251.3
  const offset = arcLength - (percentage / 100) * arcLength;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-52 h-28">
        <svg
          viewBox="0 0 200 110"
          className="w-full h-full"
          style={{ overflow: "visible" }}
        >
          {/* Track */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
            className="text-muted"
          />
          {/* Progress */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={offset}
            className={cn(
              "transition-all duration-1000",
              isPassed ? "text-emerald-500" : "text-red-500",
            )}
            style={{ transformOrigin: "100px 100px" }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span
            className={cn(
              "text-4xl font-bold font-mono tabular-nums",
              isPassed ? "text-emerald-600" : "text-red-500",
            )}
          >
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Pass / Fail badge */}
      <span
        className={cn(
          "mt-2 px-4 py-1 rounded-full text-sm font-semibold tracking-wide",
          isPassed
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
            : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
        )}
      >
        {isPassed ? "✓ PASSED" : "✗ FAILED"}
      </span>
    </div>
  );
}

// ─── Question review card ─────────────────────────────────────────────────────
function QuestionReview({
  question,
  userAnswer,
  type,
  index,
}: {
  question: Question;
  userAnswer?: string | null;
  type: "wrong" | "unattempted";
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const getOptionText = (key: string) =>
    question.options.find((o) => o.key === key)?.text || key;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
        <div
          className={cn(
            "flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-colors",
            isOpen
              ? "bg-muted/60 border-border"
              : "bg-card border-border hover:bg-muted/40",
          )}
        >
          {/* Index badge */}
          <span
            className={cn(
              "shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5",
              type === "wrong"
                ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                : "bg-muted text-muted-foreground",
            )}
          >
            {index + 1}
          </span>
          <p className="text-sm text-foreground leading-snug flex-1 line-clamp-2">
            {question.text}
          </p>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground shrink-0 mt-0.5 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="mt-1 px-4 py-4 bg-muted/30 rounded-xl border border-border space-y-3">
          {/* Options */}
          <div className="space-y-2">
            {question.options.map((option) => {
              const isCorrect = option.key === question.correctAnswer;
              const isUserAnswer = option.key === userAnswer;

              return (
                <div
                  key={option.key}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm",
                    isCorrect
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
                      : isUserAnswer
                        ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300"
                        : "bg-background border-border text-foreground/70",
                  )}
                >
                  <span className="font-bold shrink-0 w-5 text-center">
                    {option.key.toUpperCase()}
                  </span>
                  <span className="flex-1 leading-snug">{option.text}</span>
                  {isCorrect && (
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  )}
                  {isUserAnswer && !isCorrect && (
                    <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Answer summary */}
          <div className="flex flex-col sm:flex-row gap-2 text-xs pt-1">
            {type === "wrong" && userAnswer && (
              <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                <XCircle className="h-3.5 w-3.5 shrink-0" />
                Your answer:{" "}
                <strong>
                  {userAnswer.toUpperCase()}. {getOptionText(userAnswer)}
                </strong>
              </span>
            )}
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-3.5 w-3.5 shrink-0" />
              Correct:{" "}
              <strong>
                {question.correctAnswer.toUpperCase()}.{" "}
                {getOptionText(question.correctAnswer)}
              </strong>
            </span>
          </div>

          {/* Explanation */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">
              Explanation
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {question.explanation}
            </p>
          </div>

          {/* Deep Dive */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="opacity-50 h-7 text-xs"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Deep Dive
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>RAG-based explanation coming soon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ─── Shared header ─────────────────────────────────────────────────────────────
function PageHeader({ onTakeAnother }: { onTakeAnother?: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-4 h-12 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-bold text-foreground">Tattva</span>
        </div>

        {/* Nav */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 px-3 text-sm"
          >
            <Link href="/history">
              <History className="h-3.5 w-3.5 mr-1.5" />
              History
            </Link>
          </Button>
          {onTakeAnother && (
            <Button
              size="sm"
              onClick={onTakeAnother}
              className="h-8 px-3 text-sm"
            >
              Home
            </Button>
          )}
        </div>
      </div>
      {/* Progress strip placeholder to keep consistent with exam page */}
      <div className="h-0.5 bg-muted" />
    </header>
  );
}

// ─── Loading skeleton ──────────────────────────────────────────────────────────
function LoadingState({ onTakeAnother }: { onTakeAnother: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader onTakeAnother={onTakeAnother} />
      <main className="py-8 px-4">
        <div className="mx-auto max-w-4xl space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </main>
    </div>
  );
}

// ─── Error state ───────────────────────────────────────────────────────────────
function ErrorState({
  error,
  onRetry,
  onTakeAnother,
}: {
  error: string;
  onRetry: () => void;
  onTakeAnother: () => void;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader onTakeAnother={onTakeAnother} />
      <main className="py-16 px-4 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Failed to Load Results
          </h2>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <Button onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </main>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, _hasHydrated, clearCurrentExam } = useExamStore();
  const attemptId = params.id as string;

  const [results, setResults] = useState<ResultsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (_hasHydrated && !isLoggedIn) router.push("/login");
  }, [isLoggedIn, _hasHydrated, router]);

  useEffect(() => {
    if (!attemptId) return;
    setIsLoading(true);
    setError(null);
    fetchResults(attemptId)
      .then((response) => {
        if (response.success && response.data) {
          setResults(response.data);
        } else {
          setError(response.error || "Failed to load results");
        }
        setIsLoading(false);
      })
      .catch(() => {
        setError("Something went wrong. Please try again.");
        setIsLoading(false);
      });
  }, [attemptId]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    fetchResults(attemptId).then((response) => {
      if (response.success && response.data) setResults(response.data);
      else setError(response.error || "Failed to load results");
      setIsLoading(false);
    });
  };

  const handleTakeAnotherExam = () => {
    clearCurrentExam();
    router.push("/preview");
  };

  if (!_hasHydrated || !isLoggedIn) return null;
  if (isLoading) return <LoadingState onTakeAnother={handleTakeAnotherExam} />;
  if (error)
    return (
      <ErrorState
        error={error}
        onRetry={handleRetry}
        onTakeAnother={handleTakeAnotherExam}
      />
    );
  if (!results) return null;

  const isPassed = results.percentage >= 40;
  const totalQuestions =
    results.correctCount + results.wrongCount + results.unattempted;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader onTakeAnother={handleTakeAnotherExam} />

      <main className="py-8 px-4 pb-16">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* ── SCORE HERO ──────────────────────────────────────────────────── */}
          <Card
            className={cn(
              "border",
              isPassed
                ? "border-emerald-200 dark:border-emerald-800"
                : "border-red-200 dark:border-red-900",
            )}
          >
            <CardContent className="py-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                {/* Arc */}
                <div className="shrink-0">
                  <ScoreArc
                    percentage={results.percentage}
                    isPassed={isPassed}
                  />
                </div>

                {/* Score details */}
                <div className="flex-1 w-full space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-mono tabular-nums text-foreground">
                      {results.score.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      marks scored
                    </span>
                  </div>

                  {/* Mini progress bar for score */}
                  <div className="space-y-1">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          isPassed ? "bg-emerald-500" : "bg-red-500",
                        )}
                        style={{
                          width: `${Math.min(results.percentage, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span className="text-amber-600 font-medium">
                        40% cutoff
                      </span>
                      <span>100%</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {totalQuestions} questions attempted in total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── STATS GRID ──────────────────────────────────────────────────── */}
          {/* 
            Mobile: 3 equal columns with compact cards (no icon, just number + label)
            sm+: full cards with icons
            This avoids the 3-col layout breaking on 320-375px screens
          */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {/* Correct */}
            <Card className="border-emerald-100 dark:border-emerald-900">
              <CardContent className="py-3 sm:py-5 px-2 sm:px-4 text-center">
                <CheckCircle className="hidden sm:block h-6 w-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-xl sm:text-3xl font-bold text-foreground tabular-nums">
                  {results.correctCount}
                </p>
                <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  Correct
                </p>
              </CardContent>
            </Card>

            {/* Wrong */}
            <Card className="border-red-100 dark:border-red-900">
              <CardContent className="py-3 sm:py-5 px-2 sm:px-4 text-center">
                <XCircle className="hidden sm:block h-6 w-6 text-red-500 mx-auto mb-2" />
                <p className="text-xl sm:text-3xl font-bold text-foreground tabular-nums">
                  {results.wrongCount}
                </p>
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium mt-0.5">
                  Wrong
                </p>
              </CardContent>
            </Card>

            {/* Unattempted */}
            <Card>
              <CardContent className="py-3 sm:py-5 px-2 sm:px-4 text-center">
                <MinusCircle className="hidden sm:block h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xl sm:text-3xl font-bold text-foreground tabular-nums">
                  {results.unattempted}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                  Skipped
                </p>
              </CardContent>
            </Card>
          </div>

          {/* ── WRONG QUESTIONS ─────────────────────────────────────────────── */}
          {results.wrongQuestions.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                <h2 className="text-base font-semibold text-foreground">
                  Wrong Answers
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({results.wrongQuestions.length})
                  </span>
                </h2>
              </div>
              <div className="space-y-2">
                {results.wrongQuestions.map((q, i) => (
                  <QuestionReview
                    key={q.id}
                    question={q}
                    userAnswer={q.userAnswer}
                    type="wrong"
                    index={i}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── UNATTEMPTED QUESTIONS ────────────────────────────────────────── */}
          {results.unattemptedQuestions.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <MinusCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                <h2 className="text-base font-semibold text-foreground">
                  Unattempted
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({results.unattemptedQuestions.length})
                  </span>
                </h2>
              </div>
              <div className="space-y-2">
                {results.unattemptedQuestions.map((q, i) => (
                  <QuestionReview
                    key={q.id}
                    question={q}
                    type="unattempted"
                    index={i}
                  />
                ))}
              </div>
            </section>
          )}

          {/* All correct state */}
          {results.wrongQuestions.length === 0 &&
            results.unattemptedQuestions.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                  <p className="font-semibold text-foreground">
                    Perfect attempt!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You answered every question correctly.
                  </p>
                </CardContent>
              </Card>
            )}
        </div>
      </main>
    </div>
  );
}
