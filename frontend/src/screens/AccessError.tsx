import { AlertCircle } from "lucide-react";
import VaidyaWordmark from "@/components/ui/VaidyaWordmark";
import { Button } from "@/components/ui";
import type { Screen } from "@/types";

interface AccessErrorProps {
  onNavigate: (screen: Screen) => void;
}

export default function AccessError({ onNavigate }: AccessErrorProps) {
  return (
    <div className="min-h-full flex flex-col" style={{ background: "#F6F6F7" }}>
      <header className="px-6 md:px-10 py-5 animate-fade-up">
        <VaidyaWordmark size="md" />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center animate-fade-up stagger-1">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FEF2F2] border border-[#FECACA]">
              <AlertCircle size={22} className="text-[#DC2626]" strokeWidth={1.75} />
            </div>
          </div>

          <h1 className="text-[24px] font-semibold text-[#18181B] leading-[1.2] mb-2" style={{ letterSpacing: "-0.014em" }}>
            Access unavailable
          </h1>
          <p className="text-sm text-[#71717A] mb-6">
            We couldn&apos;t complete your sign-in.
          </p>

          <div className="bg-white border border-[#E4E4E7] rounded-lg p-5 text-left mb-8" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
            <p className="text-xs font-semibold text-[#71717A] uppercase tracking-[0.06em] mb-3">
              Possible reasons
            </p>
            <ul className="flex flex-col gap-2 text-sm text-[#3F3F46]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A1A1AA] mt-2 flex-shrink-0" />
                <span>Your credentials could not be verified.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A1A1AA] mt-2 flex-shrink-0" />
                <span>Your account may require institutional approval.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A1A1AA] mt-2 flex-shrink-0" />
                <span>Your session may have expired.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="primary" size="lg" onClick={() => onNavigate("staff-role")} className="w-full">
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
