import { ArrowLeft, Mic, ScanLine, FileText } from "lucide-react";
import VaidyaWordmark from "@/components/ui/VaidyaWordmark";
import type { Screen } from "@/types";

interface PatientIntakeProps {
  onNavigate: (screen: Screen) => void;
}

export default function PatientIntake({ onNavigate }: PatientIntakeProps) {
  return (
    <div className="min-h-full flex flex-col" style={{ background: "#F6F6F7" }}>
      <header className="flex items-center gap-3 px-6 md:px-10 py-5 animate-fade-up">
        <button onClick={() => onNavigate("welcome")} className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#F0F0F1] transition-colors text-[#71717A] hover:text-[#18181B]" aria-label="Back">
          <ArrowLeft size={16} />
        </button>
        <VaidyaWordmark size="md" />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg text-center animate-fade-up stagger-1">
          <div className="mb-8">
            <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#18181B] leading-[1.2] mb-3" style={{ letterSpacing: "-0.018em" }}>
              How would you like to begin?
            </h1>
            <p className="text-sm text-[#71717A]">We&apos;ll guide you through the intake step by step.</p>
          </div>

          <div className="flex flex-col gap-3 text-left">
            {[
              { icon: Mic, label: "Speak your concerns", desc: "Tell us about your symptoms in your language", accent: "#2563EB", bg: "#EFF6FF" },
              { icon: ScanLine, label: "Scan your documents", desc: "Prescriptions, reports, or previous records", accent: "#0D9488", bg: "#F0FDFA" },
              { icon: FileText, label: "Type your information", desc: "Answer a few guided questions at your pace", accent: "#52525B", bg: "#F4F4F5" },
            ].map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.label}
                  className="group flex items-center gap-4 w-full text-left px-5 py-4 rounded-lg border border-[#E4E4E7] bg-white hover:border-[#D4D4D8] hover:shadow-sm transition-all duration-150 active:scale-[0.99]"
                  style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)", minHeight: 64 }}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0" style={{ background: opt.bg }}>
                    <Icon size={18} strokeWidth={1.75} style={{ color: opt.accent }} />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-[#18181B]">{opt.label}</div>
                    <div className="text-sm text-[#71717A] mt-0.5">{opt.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-[#A1A1AA] mt-6">Your information is private and will only be shared with your doctor.</p>
        </div>
      </main>
    </div>
  );
}
