import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import VaidyaWordmark from "@/components/ui/VaidyaWordmark";
import { Button, PasswordInput, PasswordStrength, AlertBanner } from "@/components/ui";
import type { Screen } from "@/types";

interface PasswordResetProps {
  onNavigate: (screen: Screen) => void;
}

export default function PasswordReset({ onNavigate }: PasswordResetProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { setError("Please enter a new password."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-full flex flex-col" style={{ background: "#F6F6F7" }}>
      <header className="px-6 md:px-10 py-5 animate-fade-up">
        <VaidyaWordmark size="md" />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-up stagger-1">
          {!submitted ? (
            <>
              <h1 className="text-[24px] font-semibold text-[#18181B] leading-[1.2] mb-1" style={{ letterSpacing: "-0.014em" }}>
                Set a new password
              </h1>
              <p className="text-sm text-[#71717A] mb-7">Choose a strong password for your Vaidya account.</p>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                {error && <AlertBanner type="error" message={error} />}

                <div className="flex flex-col gap-1.5">
                  <PasswordInput
                    label="New password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    hint="At least 8 characters"
                    autoComplete="new-password"
                  />
                  <PasswordStrength password={password} />
                </div>

                <PasswordInput
                  label="Confirm new password"
                  placeholder="Repeat your new password"
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                  autoComplete="new-password"
                />

                <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-1 w-full">
                  Update Password
                </Button>
                <Button type="button" variant="ghost" onClick={() => onNavigate("staff-role")} className="w-full">
                  Cancel
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center animate-fade-up">
              <div className="flex justify-center mb-5">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F0FDF4] border border-[#BBF7D0]">
                  <CheckCircle2 size={22} className="text-[#16A34A]" strokeWidth={1.75} />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-[#18181B] mb-2">Password updated</h2>
              <p className="text-sm text-[#71717A] leading-relaxed mb-7">
                You can now sign in securely with your new password.
              </p>
              <Button variant="primary" onClick={() => onNavigate("staff-role")}>
                Continue to Sign In
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
