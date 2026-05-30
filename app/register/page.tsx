"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useExamStore } from "@/lib/exam-store";
import { registerUser } from "@/lib/api-client";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  Shield,
  Star,
} from "lucide-react";

const perks = [
  { icon: Zap, text: "Instant access to 3 exam modes" },
  { icon: Shield, text: "Your data is safe & private" },
  { icon: Star, text: "Track progress across all attempts" },
];

export default function RegisterPage() {
  const router = useRouter();
  const login = useExamStore((state) => state.login);

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const validateUsername = (value: string) => {
    if (value.length < 3) {
      setUsernameError("At least 3 characters");
      return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      setUsernameError("Letters and numbers only");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (value.length > 0) validateUsername(value);
    else setUsernameError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUsername(username)) return;
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (mobileNumber && !/^\d{10}$/.test(mobileNumber)) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerUser({
        displayName,
        username,
        password,
        mobileNumber: mobileNumber || undefined,
      });
      if (response.status === "ok") {
        login(
          response.id!,
          response.displayName!,
          response.username!,
          response.role!,
        );
        toast.success("Account created successfully!");
        router.push("/preview");
      } else {
        toast.error(response.error || "Registration failed");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength
  const pwStrength =
    password.length === 0
      ? 0
      : password.length < 8
        ? 1
        : password.length < 12
          ? 2
          : 3;
  const pwColors = ["", "bg-red-400", "bg-orange-400", "bg-teal-500"];
  const pwLabels = ["", "Weak", "Good", "Strong"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        .font-sora { font-family: 'Sora', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float  { 0%,100%{transform:translateY(0) rotate(0)}  50%{transform:translateY(-12px) rotate(4deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0)}  50%{transform:translateY(-8px) rotate(-3deg)} }

        .anim-1{animation:fadeUp .5s ease both}
        .anim-2{animation:fadeUp .5s .08s ease both}
        .anim-3{animation:fadeUp .5s .16s ease both}
        .anim-4{animation:fadeUp .5s .24s ease both}
        .anim-5{animation:fadeUp .5s .32s ease both}
        .anim-6{animation:fadeUp .5s .40s ease both}
        .anim-7{animation:fadeUp .5s .48s ease both}

        .float-1{animation:float  5s ease-in-out infinite}
        .float-2{animation:float2 7s ease-in-out infinite}

        .panel-bg {
          background: linear-gradient(145deg, #0f172a 0%, #1e293b 60%, #071a3e 100%);
        }
        .gradient-text {
          background: linear-gradient(135deg, #14b8a6 0%, #f97316 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .input-custom {
          height: 46px;
          border-radius: 12px;
          border: 1.5px solid hsl(var(--border));
          background: hsl(var(--background));
          padding: 0 14px;
          font-size: 0.875rem;
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
        .input-custom.error { border-color: hsl(var(--destructive)); }
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
        .btn-primary:hover:not(:disabled){opacity:.92;transform:translateY(-1px)}
        .btn-primary:disabled{opacity:.6;cursor:not-allowed}
      `}</style>

      <div className="min-h-screen bg-background font-sora flex flex-col lg:flex-row">
        {/* ── LEFT: Decorative panel ──────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:w-[42%] panel-bg flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
          {/* Floating shapes */}
          <div className="absolute top-20 right-12 w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/25 float-1" />
          <div className="absolute bottom-28 left-8 w-12 h-12 rounded-full bg-teal-500/20 border border-teal-500/25 float-2" />
          <div className="absolute top-1/2 right-6 w-9 h-9 rounded-xl bg-violet-500/15 float-1" />

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
              <p className="text-orange-400 font-semibold uppercase tracking-widest text-sm mb-4">
                Join for free
              </p>
              <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
                Start your path
                <br />
                to <span className="gradient-text">success</span>
              </h2>
              <p className="text-slate-400 mt-4 text-base leading-relaxed max-w-sm">
                Create your free account and begin practicing with India's most
                comprehensive SSC & RRB question bank.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {perks.map((p) => (
                <div key={p.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                    <p.icon className="h-4 w-4 text-orange-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{p.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="relative z-10 grid grid-cols-2 gap-3">
            {[
              { val: "10,000+", label: "Questions" },
              { val: "5000+", label: "Aspirants" },
              { val: "3", label: "Exam Modes" },
              { val: "Free", label: "Forever" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"
              >
                <p className="text-lg font-extrabold gradient-text">{s.val}</p>
                <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
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
            <div className="w-full max-w-md space-y-6">
              {/* Heading */}
              <div className="anim-1">
                <h1 className="text-3xl font-extrabold text-foreground">
                  Create account ✨
                </h1>
                <p className="text-muted-foreground mt-1.5 text-sm">
                  Free forever. No credit card required.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="anim-2 space-y-1.5">
                  <Label
                    htmlFor="displayName"
                    className="text-sm font-semibold text-foreground"
                  >
                    Full Name
                  </Label>
                  <input
                    id="displayName"
                    type="text"
                    placeholder="Enter your full name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="input-custom"
                  />
                </div>

                {/* Username */}
                <div className="anim-3 space-y-1.5">
                  <Label
                    htmlFor="username"
                    className="text-sm font-semibold text-foreground"
                  >
                    Username
                  </Label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Letters and numbers only"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    required
                    disabled={isLoading}
                    className={`input-custom ${usernameError ? "error" : ""}`}
                  />
                  {usernameError && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      {usernameError}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="anim-4 space-y-1.5">
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
                      placeholder="Min 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
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
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {/* Password strength bar */}
                  {password.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex gap-1 h-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-colors duration-300 ${i <= pwStrength ? pwColors[pwStrength] : "bg-muted"}`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-xs font-medium ${pwStrength === 1 ? "text-red-500" : pwStrength === 2 ? "text-orange-500" : "text-teal-600"}`}
                      >
                        {pwLabels[pwStrength]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Mobile */}
                <div className="anim-5 space-y-1.5">
                  <Label
                    htmlFor="mobile"
                    className="text-sm font-semibold text-foreground"
                  >
                    Mobile Number{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </Label>
                  <input
                    id="mobile"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) =>
                      setMobileNumber(
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    disabled={isLoading}
                    className="input-custom"
                  />
                </div>

                <div className="anim-6 pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Creating
                        Account…
                      </>
                    ) : (
                      <>
                        Create Free Account <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <p className="anim-7 text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
