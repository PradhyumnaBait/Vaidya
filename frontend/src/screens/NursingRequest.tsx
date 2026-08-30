import { useState } from "react";
import { ArrowLeft, HeartPulse, CheckCircle2 } from "lucide-react";
import VaidyaWordmark from "@/components/ui/VaidyaWordmark";
import { Button, Input, PasswordInput, PasswordStrength, AlertBanner } from "@/components/ui";
import type { Screen } from "@/types";

interface NursingRequestProps {
  onNavigate: (screen: Screen) => void;
}

export default function NursingRequest({ onNavigate }: NursingRequestProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    if (!data.get("name") || !password) { setError("Please fill in all required fields."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-full flex flex-col" style={{ background: "#F6F6F7" }}>
        <header className="px-6 md:px-10 py-5"><VaidyaWordmark size="md" /></header>
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md text-center animate-fade-up">
            <div className="flex justify-center mb-5">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F0FDF4] border border-[#BBF7D0]">
                <CheckCircle2 size={22} className="text-[#16A34A]" strokeWidth={1.75} />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-[#18181B] mb-2">Access request submitted</h2>
            <p className="text-sm text-[#71717A] leading-relaxed mb-7">
              Your request has been sent for verification.
            </p>
            <Button variant="secondary" onClick={() => onNavigate("nursing-login")}>
              Return to sign in
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col" style={{ background: "#F6F6F7" }}>
      <header className="flex items-center gap-3 px-6 md:px-10 py-5 animate-fade-up">
        <button onClick={() => onNavigate("nursing-login")} className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#F0F0F1] transition-colors text-[#71717A] hover:text-[#18181B]" aria-label="Back">
          <ArrowLeft size={16} />
        </button>
        <VaidyaWordmark size="md" />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md animate-fade-up stagger-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F0FDFA]">
              <HeartPulse size={15} strokeWidth={1.75} className="text-[#0D9488]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.07em] text-[#71717A]">Triage &amp; Patient Operations</span>
          </div>

          <h1 className="text-[24px] font-semibold text-[#18181B] leading-[1.2] mb-1" style={{ letterSpacing: "-0.014em" }}>Request access</h1>
          <p className="text-sm text-[#71717A] mb-7">Enter your hospital staff details to request access.</p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
            {error && <AlertBanner type="error" message={error} />}
            <Input label="Full name" name="name" type="text" placeholder="Priya Nair" autoComplete="name" />
            <Input label="Staff ID" name="staffId" type="text" placeholder="AIIMS-NURSE-XXXX" />
            <Input label="Professional email" name="email" type="email" placeholder="priya@hospital.in" autoComplete="email" />
            <Input label="Hospital / Institution" name="hospital" type="text" placeholder="AIIMS New Delhi" />
            <Input label="Department" name="department" type="text" placeholder="Emergency / OPD" />
            <Input label="Phone number" name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" />
            <div className="flex flex-col gap-1.5">
              <PasswordInput label="Create password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
              <PasswordStrength password={password} />
            </div>
            <PasswordInput label="Confirm password" placeholder="Repeat your password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
            <p className="text-xs text-[#A1A1AA] mt-1">Access may require hospital verification.</p>
            <div className="flex flex-col gap-2 mt-2">
              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">Request Access</Button>
              <Button type="button" variant="ghost" onClick={() => onNavigate("nursing-login")} className="w-full">Back to Sign In</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
