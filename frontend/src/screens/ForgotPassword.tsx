import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import VaidyaWordmark from "@/components/ui/VaidyaWordmark";
import { Button, Input } from "@/components/ui";
import type { Screen } from "@/types";

interface ForgotPasswordProps {
  onNavigate: (screen: Screen, meta?: Record<string, string>) => void;
  meta?: Record<string, string>;
}

export default function ForgotPassword({ onNavigate, meta }: ForgotPasswordProps) {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const backScreen: Screen =
    meta?.role === "doctor" ? "doctor-login" :
    meta?.role === "nursing" ? "nursing-login" :
    meta?.role === "admin" ? "admin-login" : "staff-role";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) { setError("Please enter your work email or Staff ID."); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-full flex flex-col" style={{ background: "#F6F6F7" }}>
      <header className="flex items-center gap-3 px-6 md:px-10 py-5 animate-fade-up">
        <button onClick={() => onNavigate(backScreen)} className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#F0F0F1] transition-colors text-[#71717A] hover:text-[#18181B]" aria-label="Back">
          <ArrowLeft size={16} />
        </button>
        <VaidyaWordmark size="md" />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-up stagger-1">
          {!submitted ? (
            <>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#EFF6FF] mb-6">
                <Mail size={17} strokeWidth={1.75} className="text-[#2563EB]" />
              </div>

              <h1 className="text-[24px] font-semibold text-[#18181B] leading-[1.2] mb-1" style={{ letterSpacing: "-0.014em" }}>Account recovery</h1>
              <p className="text-sm text-[#71717A] mb-7">
                Enter your registered work email or Staff ID and we&apos;ll help you regain access.
              </p>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                {error && <p className="text-sm text-[#DC2626]">{error}</p>}
                <Input
                  label="Work email or Staff ID"
                  type="text"
                  placeholder="email@hospital.in or AIIMS-XXXX"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setError(""); }}
                  autoComplete="username"
                />
                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">Continue</Button>
                <Button type="button" variant="ghost" onClick={() => onNavigate(backScreen)} className="w-full">Back to Sign In</Button>
              </form>
            </>
          ) : (
            <div className="text-center animate-fade-up">
              <div className="flex justify-center mb-5">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#EFF6FF] border border-[#BFDBFE]">
                  <Mail size={20} className="text-[#2563EB]" strokeWidth={1.75} />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-[#18181B] mb-2">Check your email</h2>
              <p className="text-sm text-[#71717A] leading-relaxed mb-7">
                If the account exists, recovery instructions have been sent to the associated email address.
              </p>
              <Button variant="secondary" onClick={() => onNavigate(backScreen)}>Return to sign in</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
