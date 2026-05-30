"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useExamStore } from "@/lib/exam-store";
import { loginUser } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Award,
} from "lucide-react";

const highlights = [
  { icon: CheckCircle, text: "10,000+ curated SSC & RRB questions" },
  { icon: TrendingUp, text: "Real-time performance analytics" },
  { icon: Award, text: "Authentic +2 / −0.67 marking scheme" },
];

export default function LoginPage() {
  const router = useRouter();
  const login = useExamStore((state) => state.login);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await loginUser({ identifier, password });
      if (response.status === "ok") {
        login(
          response.id!,
          response.displayName!,
          response.username!,
          response.role!,
        );
        toast.success("Welcome back!");
        router.push("/preview");
      } else {
        toast.error(response.error || "Login failed");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        .font-sora { font-family: 'Sora', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(-12px) rotate(4deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(-8px) rotate(-3deg); }
        }
        .anim-1 { animation: fadeUp 0.5s ease both; }
        .anim-2 { animation: fadeUp 0.5s 0.1s ease both; }
        .anim-3 { animation: fadeUp 0.5s 0.2s ease both; }
        .anim-4 { animation: fadeUp 0.5s 0.3s ease both; }
        .anim-5 { animation: fadeUp 0.5s 0.4s ease both; }
        .float-1 { animation: float  5s ease-in-out infinite; }
        .float-2 { animation: float2 7s ease-in-out infinite; }

        .panel-bg {
          background: linear-gradient(145deg, #0f172a 0%, #1e293b 60%, #0f2744 100%);
        }
        .gradient-text {
          background: linear-gradient(135deg, #14b8a6 0%, #f97316 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .input-custom {
          height: 48px;
          border-radius: 12px;
          border: 1.5px solid hsl(var(--border));
          background: hsl(var(--background));
          padding: 0 14px;
          font-size: 0.9rem;
          width: 100%;
          color: hsl(var(--foreground));
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'Sora', sans-serif;
        }
        .input-custom:focus {
          border-color: #14b8a6;
          box-shadow: 0 0 0 3px rgba(20,184,166,0.12);
        }
        .input-custom::placeholder { color: hsl(var(--muted-foreground)); }
        .btn-primary {
          width: 100%;
          height: 50px;
          background: linear-gradient(135deg, #14b8a6, #0d9488);
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.2s, transform 0.2s;
          font-family: 'Sora', sans-serif;
          box-shadow: 0 8px 24px -4px rgba(20,184,166,0.35);
        }
        .btn-primary:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div className="min-h-screen bg-background font-sora flex flex-col lg:flex-row">
        {/* ── LEFT: Decorative panel (hidden on mobile) ─────────────────────── */}
        <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] panel-bg flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
          {/* Floating shapes */}
          <div className="absolute top-16 right-16 w-20 h-20 rounded-2xl bg-teal-500/15 border border-teal-500/25 float-1" />
          <div className="absolute bottom-32 left-10 w-14 h-14 rounded-full bg-orange-500/20 border border-orange-500/25 float-2" />
          <div className="absolute top-1/2 right-8 w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 float-1" />
          <div className="absolute bottom-16 right-1/3 w-8 h-8 rounded-full bg-teal-400/20 float-2" />

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-orange-500 flex items-center justify-center shadow-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Tattva
            </span>
          </Link>

          {/* Hero text */}
          <div className="relative z-10 space-y-6">
            <div>
              <p className="text-teal-400 font-semibold uppercase tracking-widest text-sm mb-4">
                Welcome back
              </p>
              <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
                Continue your
                <br />
                <span className="gradient-text">exam journey</span>
              </h2>
              <p className="text-slate-400 mt-4 text-base leading-relaxed max-w-sm">
                Thousands of aspirants are practicing right now. Don't fall
                behind.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-3 pt-2">
              {highlights.map((h) => (
                <div key={h.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center shrink-0">
                    <h.icon className="h-4 w-4 text-teal-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{h.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom quote */}
          <div className="relative z-10 bg-white/5 backdrop-blur rounded-2xl p-5 border border-white/10">
            <p className="text-slate-300 text-sm italic leading-relaxed">
              "Tattva helped me crack RRB NTPC in my first attempt. The mock
              tests are spot on!"
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold">
                R
              </div>
              <span className="text-slate-400 text-xs font-medium">
                Ravi K. — RRB NTPC 2024
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form panel ───────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col">
          {/* Mobile header */}
          <div className="lg:hidden border-b border-border px-5 py-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-orange-500 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">Tattva</span>
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md space-y-8">
              {/* Heading */}
              <div className="anim-1">
                <h1 className="text-3xl font-extrabold text-foreground">
                  Welcome back 👋
                </h1>
                <p className="text-muted-foreground mt-2">
                  Login to continue your preparation
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="anim-2 space-y-1.5">
                  <Label
                    htmlFor="identifier"
                    className="text-sm font-semibold text-foreground"
                  >
                    Username or Mobile Number
                  </Label>
                  <input
                    id="identifier"
                    type="text"
                    placeholder="Enter username or mobile"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    disabled={isLoading}
                    className="input-custom"
                  />
                </div>

                <div className="anim-3 space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-foreground"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="input-custom pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="anim-4 pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Logging in…
                      </>
                    ) : (
                      <>
                        Login <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <p className="anim-5 text-sm text-muted-foreground text-center">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                >
                  Create one free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
