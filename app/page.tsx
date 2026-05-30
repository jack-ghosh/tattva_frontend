"use client";

import Link from "next/link";
import { useExamStore } from "@/lib/exam-store";
import {
  BookOpen,
  Clock,
  Target,
  Award,
  CheckCircle,
  TrendingUp,
  Users,
  ArrowRight,
  Zap,
  Star,
} from "lucide-react";

const examTypes = [
  {
    id: "15MIN",
    title: "15 Min Sprint",
    questions: 25,
    duration: 15,
    description: "Quick daily revision session",
    icon: Clock,
    color: "from-teal-400 to-teal-600",
    bg: "bg-teal-50 dark:bg-teal-950/30",
    border: "border-teal-200 dark:border-teal-800",
    tag: "Popular",
  },
  {
    id: "30MIN",
    title: "30 Min Challenge",
    questions: 50,
    duration: 30,
    description: "Balanced practice under pressure",
    icon: Target,
    color: "from-orange-400 to-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800",
    tag: "Recommended",
  },
  {
    id: "RRB",
    title: "RRB Full Mock",
    questions: 100,
    duration: 90,
    description: "Full-length RRB NTPC simulation",
    icon: BookOpen,
    color: "from-violet-400 to-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-800",
    tag: "Advanced",
  },
];

const features = [
  {
    icon: CheckCircle,
    title: "Curated Questions",
    description:
      "Expertly crafted questions covering all SSC CGL & RRB NTPC topics",
    color: "text-teal-500",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor performance with detailed analytics and full history",
    color: "text-orange-500",
  },
  {
    icon: Award,
    title: "Real Exam Feel",
    description:
      "Authentic marking scheme: +2 / −0.67 / 0 with auto-submit timer",
    color: "text-violet-500",
  },
  {
    icon: Users,
    title: "Expert Verified",
    description:
      "All questions reviewed and approved by subject matter experts",
    color: "text-teal-500",
  },
];

const stats = [
  { value: "10,000+", label: "Questions" },
  { value: "5000+", label: "Aspirants" },
  { value: "95%", label: "Satisfaction" },
  { value: "3", label: "Exam Modes" },
];

export default function LandingPage() {
  const isLoggedIn = useExamStore((state) => state.isLoggedIn);

  return (
    <>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        .font-sora { font-family: 'Sora', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-16px) rotate(3deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-10px) rotate(-4deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .anim-1 { animation: fadeUp 0.6s ease both; }
        .anim-2 { animation: fadeUp 0.6s 0.12s ease both; }
        .anim-3 { animation: fadeUp 0.6s 0.24s ease both; }
        .anim-4 { animation: fadeUp 0.6s 0.36s ease both; }
        .anim-5 { animation: fadeUp 0.6s 0.48s ease both; }

        .float-1 { animation: float  5s ease-in-out infinite; }
        .float-2 { animation: float2 7s ease-in-out infinite; }
        .float-3 { animation: float  6s 1s ease-in-out infinite; }

        .pulse-ring::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: currentColor;
          animation: pulse-ring 2s ease-out infinite;
        }

        .card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.12);
        }

        .hero-bg {
          background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(20,184,166,0.12) 0%, transparent 60%),
                      radial-gradient(ellipse 50% 40% at 90% 60%, rgba(249,115,22,0.08) 0%, transparent 50%);
        }

        .gradient-text {
          background: linear-gradient(135deg, #14b8a6 0%, #f97316 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cta-bg {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
        }
      `}</style>

      <div className="min-h-screen bg-background font-sora">
        {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-orange-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                Tattva
              </span>
            </Link>

            <nav className="flex items-center gap-2">
              {isLoggedIn ? (
                <Link
                  href="/preview"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-teal-500/20"
                >
                  Go to Dashboard <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-teal-500/20"
                  >
                    Get Started <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        <main>
          {/* ── HERO ────────────────────────────────────────────────────────── */}
          <section className="relative overflow-hidden hero-bg py-24 md:py-36 px-4">
            {/* Floating decorative shapes */}
            <div className="absolute top-20 left-[8%] w-16 h-16 rounded-2xl bg-teal-400/20 border border-teal-400/30 float-1 hidden lg:block" />
            <div className="absolute top-32 right-[12%] w-10 h-10 rounded-full bg-orange-400/25 border border-orange-400/30 float-2 hidden lg:block" />
            <div className="absolute bottom-20 left-[18%] w-12 h-12 rounded-xl bg-violet-400/20 border border-violet-400/20 float-3 hidden lg:block" />
            <div className="absolute top-1/2 right-[6%] w-8 h-8 rounded-lg bg-teal-300/20 border border-teal-300/30 float-1 hidden xl:block" />

            <div className="relative mx-auto max-w-4xl text-center">
              {/* Pill badge */}
              <div className="anim-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 text-sm font-medium mb-8">
                <Zap className="h-3.5 w-3.5 fill-current" />
                India's smartest exam prep platform
              </div>

              <h1 className="anim-2 text-4xl sm:text-5xl md:text-7xl font-extrabold text-foreground leading-[1.08] tracking-tight mb-6">
                Crack <span className="gradient-text">SSC CGL</span>
                <br />& RRB NTPC
              </h1>

              <p className="anim-3 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Practice with expertly curated questions, track your progress in
                real time, and walk into your exam with unshakeable confidence.
              </p>

              <div className="anim-4 flex flex-col sm:flex-row gap-3 justify-center">
                {isLoggedIn ? (
                  <Link
                    href="/preview"
                    className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-teal-500/25 text-base"
                  >
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-teal-500/25 text-base"
                    >
                      Start Practicing Free <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2 px-8 py-3.5 bg-card border-2 border-border text-foreground font-semibold rounded-2xl hover:border-teal-300 hover:bg-teal-50/50 transition-all text-base"
                    >
                      Login to Continue
                    </Link>
                  </>
                )}
              </div>

              {/* Social proof */}
              <div className="anim-5 mt-12 flex items-center justify-center gap-1.5">
                <div className="flex -space-x-2">
                  {[
                    "bg-teal-400",
                    "bg-orange-400",
                    "bg-violet-400",
                    "bg-pink-400",
                  ].map((c, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-full ${c} border-2 border-background flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-orange-400 text-orange-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-1">
                  5000+ aspirants trust Tattva
                </span>
              </div>
            </div>
          </section>

          {/* ── STATS STRIP ─────────────────────────────────────────────────── */}
          <section className="border-y border-border bg-muted/30 py-8 px-4">
            <div className="mx-auto max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl sm:text-3xl font-extrabold gradient-text">
                    {s.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── EXAM TYPES ──────────────────────────────────────────────────── */}
          <section className="py-20 px-4">
            <div className="mx-auto max-w-6xl">
              <div className="text-center mb-14">
                <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-3">
                  Practice Modes
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                  Choose Your Challenge
                </h2>
                <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                  Every mode uses the authentic marking scheme. Pick your
                  intensity.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {examTypes.map((exam) => (
                  <div
                    key={exam.id}
                    className={`card-hover relative rounded-2xl border-2 ${exam.border} ${exam.bg} p-6 flex flex-col gap-4`}
                  >
                    {/* Tag */}
                    <span
                      className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${exam.color} text-white`}
                    >
                      {exam.tag}
                    </span>

                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exam.color} flex items-center justify-center shadow-md`}
                    >
                      <exam.icon className="h-6 w-6 text-white" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {exam.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {exam.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        { label: "Qs", value: exam.questions },
                        { label: "Mins", value: exam.duration },
                        { label: "Scoring", value: "+2/−0.67" },
                      ].map((d) => (
                        <div
                          key={d.label}
                          className="bg-background/70 rounded-xl p-2 text-center"
                        >
                          <p className="text-sm font-bold text-foreground">
                            {d.value}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {d.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FEATURES ────────────────────────────────────────────────────── */}
          <section className="py-20 px-4 bg-muted/30">
            <div className="mx-auto max-w-6xl">
              <div className="text-center mb-14">
                <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-3">
                  Why Tattva
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                  Built for Serious Aspirants
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="card-hover bg-card rounded-2xl border border-border p-6 flex flex-col gap-3"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl bg-muted flex items-center justify-center ${f.color}`}
                    >
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                      {f.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ─────────────────────────────────────────────────────────── */}
          <section className="py-24 px-4">
            <div className="mx-auto max-w-3xl">
              <div className="cta-bg rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full translate-x-1/3 translate-y-1/3" />

                <div className="relative">
                  <p className="text-teal-400 font-semibold uppercase tracking-widest text-sm mb-4">
                    Start Today
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 leading-tight">
                    Your exam is waiting.
                    <br />
                    Are you ready?
                  </h2>
                  <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    Join 5000+ aspirants already preparing with Tattva. Free to
                    start, no card required.
                  </p>
                  {isLoggedIn ? (
                    <Link
                      href="/preview"
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-teal-500/30"
                    >
                      Go to Dashboard <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-teal-500/30"
                    >
                      Create Free Account <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <footer className="border-t border-border py-8 px-4">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-teal-400 to-orange-500 flex items-center justify-center">
                <BookOpen className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-bold text-foreground">Tattva</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Tattva. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
