import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import VaidyaWordmark from "@/components/ui/VaidyaWordmark";
import type { Screen } from "@/types";

interface AuthSuccessProps {
  onNavigate: (screen: Screen) => void;
  meta?: Record<string, string>;
}

const roleText: Record<string, string> = {
  doctor: "Preparing your clinical workspace...",
  nursing: "Preparing triage and patient operations...",
  admin: "Preparing hospital operations...",
};

export default function AuthSuccess({ onNavigate, meta }: AuthSuccessProps) {
  const role = meta?.role || "doctor";

  useEffect(() => {
    const t = setTimeout(() => {
      onNavigate("welcome");
    }, 2000);
    return () => clearTimeout(t);
  }, [onNavigate]);

  return (
    <div className="min-h-full flex flex-col" style={{ background: "#F6F6F7" }}>
      <header className="px-6 md:px-10 py-5 animate-fade-up">
        <VaidyaWordmark size="md" />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm text-center animate-fade-up">
          <div className="flex justify-center mb-5">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F0FDF4] border border-[#BBF7D0]">
              <CheckCircle2 size={22} className="text-[#16A34A]" strokeWidth={1.75} />
            </div>
          </div>

          <h1 className="text-[22px] font-semibold text-[#18181B] mb-1" style={{ letterSpacing: "-0.014em" }}>
            You&apos;re signed in.
          </h1>
          <p className="text-sm text-[#71717A] mb-8">
            Opening your workspace…
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-[#71717A]">
            <div
              className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"
              style={{ animation: "pulse-ring 1.5s ease-out infinite" }}
            />
            <span>{roleText[role] || "Preparing workspace..."}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
