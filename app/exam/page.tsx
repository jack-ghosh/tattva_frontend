"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useExamStore } from "@/lib/exam-store";
import { submitExam } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertTriangle,
  Menu,
  X,
  Flag,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Compact header timer ────────────────────────────────────────────────────
function HeaderTimer({
  seconds,
  totalSeconds,
  isWarning,
}: {
  seconds: number;
  totalSeconds: number;
  isWarning: boolean;
}) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const pct = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0;

  const r = 14;
  const circ = 2 * Math.PI * r;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-mono font-semibold transition-colors",
        isWarning
          ? "border-red-400 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400 animate-pulse"
          : "border-border bg-card text-foreground",
      )}
    >
      <svg
        className="-rotate-90 shrink-0"
        width="20"
        height="20"
        viewBox="0 0 36 36"
      >
        <circle
          cx="18"
          cy="18"
          r={r}
          strokeWidth="3"
          fill="none"
          className="text-muted stroke-current"
        />
        <circle
          cx="18"
          cy="18"
          r={r}
          strokeWidth="3"
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct / 100)}
          strokeLinecap="round"
          className={cn(
            "stroke-current transition-all duration-1000",
            isWarning ? "text-red-500" : "text-primary",
          )}
        />
      </svg>
      <Clock className="h-3.5 w-3.5 shrink-0 opacity-60" />
      <span>
        {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
    </div>
  );
}

// ─── Question palette drawer ──────────────────────────────────────────────────
function PaletteDrawer({
  open,
  onClose,
  examQuestions,
  currentAnswers,
  flaggedQuestions,
  currentQuestionIndex,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  examQuestions: { id: string }[];
  currentAnswers: Record<string, string>;
  flaggedQuestions: Set<string>;
  currentQuestionIndex: number;
  onSelect: (index: number) => void;
}) {
  const answeredCount = Object.keys(currentAnswers).length;
  const flaggedCount = flaggedQuestions.size;
  const unansweredCount = examQuestions.length - answeredCount;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw] bg-card border-l border-border shadow-2xl flex flex-col",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <span className="font-semibold text-foreground text-sm">
            Question Palette
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-border shrink-0">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </span>
              <span className="text-muted-foreground">
                {answeredCount} Done
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-amber-400 flex items-center justify-center">
                <Flag className="h-3 w-3 text-white" />
              </span>
              <span className="text-muted-foreground">
                {flaggedCount} Review
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-muted border border-border" />
              <span className="text-muted-foreground">
                {unansweredCount} Left
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-5 gap-2">
            {examQuestions.map((q, index) => {
              const isAnswered = !!currentAnswers[q.id];
              const isFlagged = flaggedQuestions.has(q.id);
              const isCurrent = index === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    onSelect(index);
                    onClose();
                  }}
                  className={cn(
                    "relative w-full aspect-square rounded-lg text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isAnswered
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80",
                    isFlagged && !isAnswered && "bg-amber-400 text-white",
                    isFlagged && isAnswered && "bg-emerald-500 text-white",
                    isCurrent && "ring-2 ring-primary ring-offset-1",
                  )}
                >
                  {index + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-card" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Pre-exam countdown — with Cancel button ──────────────────────────────────
function PreExamCountdown({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      onComplete();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, onComplete]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-foreground">Tattva</span>
          </div>

          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3 font-medium">
            Starting in
          </p>
          <div className="text-8xl font-bold text-primary mb-8 font-mono tabular-nums">
            {countdown}
          </div>

          <div className="text-left bg-muted/50 rounded-xl p-4 mb-6 space-y-2">
            <h2 className="font-semibold text-foreground flex items-center gap-2 text-sm mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Instructions
            </h2>
            {[
              ["Do not refresh or navigate away", "text-muted-foreground"],
              ["+2 marks per correct answer", "text-emerald-600 font-medium"],
              ["−0.67 marks per wrong answer", "text-red-500 font-medium"],
              ["0 marks for unattempted", "text-muted-foreground"],
              ["Auto-submit when time runs out", "text-muted-foreground"],
            ].map(([text, cls]) => (
              <div key={text} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground/50 mt-0.5">•</span>
                <span className={cls}>{text}</span>
              </div>
            ))}
          </div>

          {/* Cancel button */}
          <button
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <X className="h-4 w-4" />
            Cancel Exam
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ExamPage() {
  const router = useRouter();
  const {
    isLoggedIn,
    _hasHydrated,
    userId,
    examId,
    examType,
    examQuestions,
    currentAnswers,
    isExamActive,
    durationMinutes,
    maxScore,
    setAnswer,
    startExam,
    clearCurrentExam,
  } = useExamStore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerInitialized, setTimerInitialized] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const hasAutoSubmitted = useRef(false);
  const isSubmittingRef = useRef(false);

  // Initialize timer
  useEffect(() => {
    if (!isExamActive || !durationMinutes || timerInitialized) return;
    setTimeRemaining(durationMinutes * 60);
    setTimerInitialized(true);
  }, [isExamActive, durationMinutes, timerInitialized]);

  // Countdown
  useEffect(() => {
    if (!isExamActive || !timerInitialized) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isExamActive, timerInitialized]);

  const handleSubmit = useCallback(
    async (isAutoSubmit = false) => {
      if (!examQuestions || !examId || !userId || !examType || !maxScore) {
        toast.error("Unable to submit exam. Please refresh and try again.");
        return;
      }
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      setIsSubmitting(true);
      setShowConfirmDialog(false);

      const responses = examQuestions.map((q) => ({
        qId: q.id,
        userAns: currentAnswers[q.id] || null,
      }));

      try {
        const result = await submitExam({
          examId,
          userId,
          examType,
          maxScore,
          responses,
        });
        if (result.success && result.data) {
          clearCurrentExam();
          toast.success(`Exam submitted! Score: ${result.data.score}`);
          router.push(`/results/${result.data.attemptId}`);
        } else {
          toast.error(result.error || "Failed to submit exam");
          if (isAutoSubmit) hasAutoSubmitted.current = false;
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
        if (isAutoSubmit) hasAutoSubmitted.current = false;
      } finally {
        setIsSubmitting(false);
        isSubmittingRef.current = false;
      }
    },
    [
      examQuestions,
      examId,
      userId,
      examType,
      maxScore,
      currentAnswers,
      clearCurrentExam,
      router,
    ],
  );

  const handleStartExam = useCallback(() => startExam(), [startExam]);

  // Cancel during countdown — clear and go back to preview
  const handleCancelExam = useCallback(() => {
    clearCurrentExam();
    router.push("/preview");
  }, [clearCurrentExam, router]);

  // Auto-submit on timeout
  useEffect(() => {
    if (
      !isExamActive ||
      !timerInitialized ||
      timeRemaining !== 0 ||
      hasAutoSubmitted.current
    )
      return;
    hasAutoSubmitted.current = true;
    handleSubmit(true);
  }, [timeRemaining, isExamActive, handleSubmit, timerInitialized]);

  // Guards
  useEffect(() => {
    if (_hasHydrated && !isLoggedIn) router.push("/login");
  }, [isLoggedIn, _hasHydrated, router]);

  useEffect(() => {
    if (
      _hasHydrated &&
      isLoggedIn &&
      (!examQuestions || examQuestions.length === 0)
    )
      router.push("/preview");
  }, [_hasHydrated, isLoggedIn, examQuestions, router]);

  const toggleFlag = useCallback((qId: string) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      next.has(qId) ? next.delete(qId) : next.add(qId);
      return next;
    });
  }, []);

  const navigateTo = useCallback(
    (index: number) => {
      if (!examQuestions) return;
      setCurrentQuestionIndex(
        Math.max(0, Math.min(examQuestions.length - 1, index)),
      );
    },
    [examQuestions],
  );

  // FIX #2: toggle answer — clicking selected option deselects it
  const handleOptionClick = useCallback(
    (questionId: string, optionKey: string) => {
      const currentAnswer = currentAnswers[questionId];
      if (currentAnswer === optionKey) {
        // deselect: set to empty string or remove — store clears on empty
        setAnswer(questionId, "");
      } else {
        setAnswer(questionId, optionKey);
      }
    },
    [currentAnswers, setAnswer],
  );

  if (!_hasHydrated) return null;
  if (!isLoggedIn || !examQuestions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading exam…</span>
      </div>
    );
  }

  // FIX #1: pass onCancel to countdown
  if (!isExamActive)
    return (
      <PreExamCountdown
        onComplete={handleStartExam}
        onCancel={handleCancelExam}
      />
    );

  const currentQuestion = examQuestions[currentQuestionIndex];
  const answeredCount = Object.keys(currentAnswers).filter(
    (k) => currentAnswers[k] !== "",
  ).length;
  const unansweredCount = examQuestions.length - answeredCount;
  const isWarningTime = timeRemaining < 300;
  const isFlagged = flaggedQuestions.has(currentQuestion.id);
  const indicatorCount = answeredCount + flaggedQuestions.size;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 h-12 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">Tattva</span>
            <span className="hidden sm:inline text-xs text-muted-foreground border-l border-border pl-2 ml-1">
              {examType} Exam
            </span>
          </div>

          <div className="flex items-center gap-2">
            <HeaderTimer
              seconds={timeRemaining}
              totalSeconds={(durationMinutes || 0) * 60}
              isWarning={isWarningTime}
            />
            <button
              onClick={() => setShowPalette(true)}
              className="relative p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Open question palette"
            >
              <Menu className="h-5 w-5 text-foreground" />
              {indicatorCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          </div>
        </div>

        <div className="h-0.5 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${((currentQuestionIndex + 1) / examQuestions.length) * 100}%`,
            }}
          />
        </div>
      </header>

      {/* ── QUESTION PALETTE DRAWER ─────────────────────────────────────────── */}
      <PaletteDrawer
        open={showPalette}
        onClose={() => setShowPalette(false)}
        examQuestions={examQuestions}
        currentAnswers={currentAnswers}
        flaggedQuestions={flaggedQuestions}
        currentQuestionIndex={currentQuestionIndex}
        onSelect={navigateTo}
      />

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-28">
        <div className="mx-auto max-w-2xl lg:max-w-3xl px-4 lg:px-8 py-5 lg:py-10">
          <div className="flex items-center justify-between mb-4 lg:mb-7">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Question {currentQuestionIndex + 1}{" "}
              <span className="text-muted-foreground/50">
                / {examQuestions.length}
              </span>
            </span>
            {isFlagged && (
              <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                <Flag className="h-3 w-3" /> Marked for review
              </span>
            )}
          </div>

          <p className="text-base sm:text-lg lg:text-xl text-foreground leading-relaxed mb-6 lg:mb-9 font-medium">
            {currentQuestion.text}
          </p>

          {/* FIX #2: options — clicking selected deselects */}
          <div className="space-y-2 lg:space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected =
                currentAnswers[currentQuestion.id] === option.key &&
                currentAnswers[currentQuestion.id] !== "";

              return (
                <button
                  key={option.key}
                  onClick={() =>
                    handleOptionClick(currentQuestion.id, option.key)
                  }
                  className={cn(
                    "w-full flex items-center gap-3 lg:gap-4 px-3 lg:px-5 py-2.5 lg:py-4 rounded-lg border text-left transition-all group",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isSelected
                      ? "border-primary bg-primary/8 dark:bg-primary/15"
                      : "border-border hover:border-primary/40 hover:bg-muted/40",
                  )}
                >
                  <span
                    className={cn(
                      "w-7 h-7 lg:w-9 lg:h-9 rounded-md flex items-center justify-center text-xs lg:text-sm font-bold shrink-0 transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                    )}
                  >
                    {isSelected ? (
                      <Check className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                    ) : (
                      option.key.toUpperCase()
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-sm lg:text-base leading-snug",
                      isSelected
                        ? "text-foreground font-medium"
                        : "text-foreground/90",
                    )}
                  >
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Deselect hint */}
          {currentAnswers[currentQuestion.id] &&
            currentAnswers[currentQuestion.id] !== "" && (
              <p className="mt-3 text-xs text-muted-foreground text-center">
                Tap the selected option again to deselect
              </p>
            )}
        </div>
      </main>

      {/* ── FIXED BOTTOM NAV BAR ─────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="mx-auto max-w-2xl lg:max-w-3xl px-4 lg:px-8 py-2.5 lg:py-4 flex items-center justify-between gap-2">
          <button
            onClick={() => navigateTo(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            className={cn(
              "flex items-center gap-1.5 px-3 lg:px-5 py-2 lg:py-2.5 rounded-lg border text-sm lg:text-base font-medium transition-all",
              currentQuestionIndex === 0
                ? "border-border/50 text-muted-foreground/40 cursor-not-allowed"
                : "border-border text-foreground hover:bg-muted hover:border-primary/40",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div className="flex items-center gap-2 lg:gap-3">
            <button
              onClick={() => toggleFlag(currentQuestion.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 lg:px-5 py-2 lg:py-2.5 rounded-lg border text-sm lg:text-base font-medium transition-all",
                isFlagged
                  ? "border-amber-400 bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-amber-600 hover:border-amber-400",
              )}
            >
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isFlagged ? "Flagged" : "Review"}
              </span>
            </button>

            <button
              onClick={() => setShowConfirmDialog(true)}
              disabled={isSubmitting}
              className={cn(
                "flex items-center gap-1.5 px-4 lg:px-7 py-2 lg:py-2.5 rounded-lg text-sm lg:text-base font-semibold transition-all",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              )}
            >
              {isSubmitting ? "Submitting…" : "Submit"}
            </button>
          </div>

          <button
            onClick={() => navigateTo(currentQuestionIndex + 1)}
            disabled={currentQuestionIndex === examQuestions.length - 1}
            className={cn(
              "flex items-center gap-1.5 px-3 lg:px-5 py-2 lg:py-2.5 rounded-lg border text-sm lg:text-base font-medium transition-all",
              currentQuestionIndex === examQuestions.length - 1
                ? "border-border/50 text-muted-foreground/40 cursor-not-allowed"
                : "border-border text-foreground hover:bg-muted hover:border-primary/40",
            )}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* ── SUBMIT CONFIRM DIALOG ─────────────────────────────────────────────── */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm">
                <p>
                  You have answered{" "}
                  <strong className="text-foreground">{answeredCount}</strong>{" "}
                  of{" "}
                  <strong className="text-foreground">
                    {examQuestions.length}
                  </strong>{" "}
                  questions.
                </p>
                {unansweredCount > 0 && (
                  <p className="text-amber-600 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    {unansweredCount} question{unansweredCount !== 1 ? "s" : ""}{" "}
                    will be unattempted.
                  </p>
                )}
                {flaggedQuestions.size > 0 && (
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <Flag className="h-4 w-4 shrink-0 text-amber-500" />
                    {flaggedQuestions.size} question
                    {flaggedQuestions.size !== 1 ? "s" : ""} marked for review.
                  </p>
                )}
                <p className="text-muted-foreground">
                  This action cannot be undone.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Exam</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleSubmit(false)}>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
