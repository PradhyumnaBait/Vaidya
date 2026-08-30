import { Globe, ChevronRight, ShieldCheck } from "lucide-react";
import VaidyaWordmark from "@/components/ui/VaidyaWordmark";
import ClinicalVisual from "@/components/clinical/ClinicalVisual";
import { Button } from "@/components/ui";
import type { Screen } from "@/types";

interface WelcomeProps {
  onNavigate: (screen: Screen) => void;
}

export default function Welcome({ onNavigate }: WelcomeProps) {
  return (
    <div
      className="min-h-full flex flex-col"
      style={{ background: "#F6F6F7" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-5 animate-fade-up">
        <VaidyaWordmark size="md" />
        <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
          <ShieldCheck size={13} strokeWidth={1.75} />
          <span className="hidden sm:inline">Secure clinical platform</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 xl:px-16 py-10 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: Identity + CTAs */}
            <div className="flex flex-col gap-8">
              {/* Heading block */}
              <div className="flex flex-col gap-3 animate-fade-up stagger-1">
                <h1
                  className="text-[36px] sm:text-[42px] lg:text-[44px] font-semibold text-[#18181B] leading-[1.13]"
                  style={{ letterSpacing: "-0.022em" }}
                >
                  Welcome to Vaidya
                </h1>
                <p className="text-[15px] text-[#52525B] leading-[1.65] max-w-[420px]">
                  Your clinical information, prepared before the consultation.
                </p>
              </div>

              {/* Patient CTA */}
              <div className="flex flex-col gap-3 animate-fade-up stagger-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate("patient-intake")}
                  className="w-full sm:w-auto sm:self-start min-h-[52px] px-7 text-[15px] font-medium"
                >
                  Begin Patient Intake
                  <ChevronRight size={16} />
                </Button>
                <p className="text-sm text-[#71717A] flex items-center gap-1.5">
                  <Globe size={13} strokeWidth={1.75} className="text-[#A1A1AA] flex-shrink-0" />
                  Available in multiple Indian languages
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 animate-fade-up stagger-3">
                <div className="flex-1 h-px bg-[#E4E4E7]" />
                <span className="text-xs font-medium text-[#A1A1AA] uppercase tracking-[0.06em]">
                  or
                </span>
                <div className="flex-1 h-px bg-[#E4E4E7]" />
              </div>

              {/* Staff CTA */}
              <div className="animate-fade-up stagger-3">
                <button
                  onClick={() => onNavigate("staff-role")}
                  className="group flex items-center justify-between w-full sm:w-auto sm:inline-flex gap-4 px-5 py-3.5 rounded-lg border border-[#E4E4E7] bg-white hover:border-[#D4D4D8] hover:bg-[#FAFAFA] transition-all duration-150 active:scale-[0.99]"
                  style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
                >
                  <div className="text-left">
                    <div className="text-sm font-semibold text-[#18181B]">Staff & Clinical Access</div>
                    <div className="text-xs text-[#71717A] mt-0.5">For doctors, nursing staff, and administrators</div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-[#A1A1AA] group-hover:text-[#71717A] transition-colors flex-shrink-0"
                  />
                </button>
              </div>
            </div>

            {/* Right: Clinical Visual */}
            <div
              className="hidden lg:flex items-center justify-center"
              style={{ minHeight: 480 }}
            >
              <div className="relative w-full" style={{ maxWidth: 400, height: 480 }}>
                <ClinicalVisual />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-10 py-4 animate-fade-up stagger-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-[#A1A1AA]">
            Secure clinical intake · Physician verified
          </p>
          <p className="text-xs text-[#A1A1AA]">
            Designed for the Indian healthcare ecosystem
          </p>
        </div>
      </footer>
    </div>
  );
}
