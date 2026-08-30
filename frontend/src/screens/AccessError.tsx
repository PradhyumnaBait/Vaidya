import { AlertCircle } from "lucide-react";
import VaidyaWordmark from "@/components/VaidyaWordmark";
import { Button } from "@/components/ui";
import type { Screen } from "@/types";

interface AccessErrorProps {
  onNavigate: (screen: Screen) => void;
  meta?: Record<string, string>;
}

export default function AccessError({ onNavigate, meta }: AccessErrorProps) {
  const backScreen: Screen =
    meta?.role === "doctor" ? "doctor-login" :
    meta?.role === "nursing" ? "nursing-login" :
    meta?.role === "admin" ? "admin-login" : "staff-role";

  return (
    <div className="min-h-full flex flex-col" style={{ background: "#F6F6F7" }}>
      <header className="px-6 md:px-10 py-5 animate-fade-up">
        <VaidyaWordmark size="md" />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm text-center animate-fade-up stagger-1">
          <div className="flex justify-center mb-5">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-full border"
              style={{ background: "#FEF2F2", borderColor: "#FECACA" }}
            >
              <AlertCircle size={20} className="text-[#DC2626]" strokeWidth={1.75} />
            </div>
          </div>

          <h1 className="text-xl font-semibold text-[#18181B] mb-3">Access unavailable</h1>
          <p className="text-sm text-[#71717A] leading-relaxed mb-2">
            We couldn&apos;t complete your sign-in.
          </p>

          <div
            className="text-left rounded-lg border p-4 mb-7 mt-4"
            style={{ background: "#FAFAFA", borderColor: "#E4E4E7" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#A1A1AA] mb-2">Possible reasons</p>
            <ul className="flex flex-col gap-1.5">
              {[
                "Your credentials could not be verified.",
                "Your account may require institutional approval.",
                "Your session may have expired.",
              ].map((reason) => (
                <li key={reason} className="flex items-start gap-2 text-sm text-[#52525B]">
                  <div className="w-1 h-1 rounded-full bg-[#A1A1AA] mt-1.5 flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="primary" onClick={() => onNavigate(backScreen)} className="w-full">
              Try Again
            </Button>
            <Button variant="ghost" onClick={() => onNavigate("welcome")} className="w-full">
              Return to Vaidya
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
