import { useState } from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import VaidyaWordmark from "@/components/VaidyaWordmark";
import { Button, Input, PasswordInput, Divider, AlertBanner } from "@/components/ui";
import type { Screen } from "@/types";

interface AdminLoginProps {
  onNavigate: (screen: Screen, meta?: Record<string, string>) => void;
}

export default function AdminLogin({ onNavigate }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof fieldError = {};
    if (!email) errors.email = "Admin email is required";
    if (!password) errors.password = "Password is required";
    if (Object.keys(errors).length) { setFieldError(errors); return; }
    setFieldError({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    onNavigate("auth-success", { role: "admin" });
  };

  return (
    <div className="min-h-full flex flex-col" style={{ background: "#F6F6F7" }}>
      <header className="flex items-center gap-3 px-6 md:px-10 py-5 animate-fade-up">
        <button onClick={() => onNavigate("staff-role")} className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#F0F0F1] transition-colors text-[#71717A] hover:text-[#18181B]" aria-label="Back">
          <ArrowLeft size={16} />
        </button>
        <VaidyaWordmark size="md" />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-up stagger-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F4F4F5]">
              <Building2 size={15} strokeWidth={1.75} className="text-[#52525B]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.07em] text-[#71717A]">Hospital Operations</span>
          </div>

          <h1 className="text-[26px] font-semibold text-[#18181B] leading-[1.2] mb-1" style={{ letterSpacing: "-0.016em" }}>Administrator sign in</h1>
          <p className="text-sm text-[#71717A] mb-7">Access operational analytics, system configuration and audit information.</p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label="Admin email"
              type="email"
              placeholder="admin@hospital.in"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldError((p) => ({ ...p, email: undefined })); }}
              error={fieldError.email}
              autoComplete="email"
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldError((p) => ({ ...p, password: undefined })); }}
              error={fieldError.password}
              autoComplete="current-password"
            />

            <div className="flex justify-end">
              <button type="button" onClick={() => onNavigate("forgot-password", { role: "admin" })} className="text-sm text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
                Forgot password?
              </button>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">Sign In</Button>
          </form>

          <Divider />

          <p className="text-sm text-[#71717A] text-center">
            Need administrative access?{" "}
            <button onClick={() => onNavigate("admin-request")} className="text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors">
              Request access
            </button>
          </p>

          <p className="text-xs text-center text-[#A1A1AA] mt-8">Authorized administrators only</p>
        </div>
      </main>
    </div>
  );
}
