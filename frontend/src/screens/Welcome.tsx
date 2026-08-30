import { Stethoscope, ShieldCheck, Languages, BadgeCheck } from "lucide-react";
import VaidyaWordmark from "@/components/VaidyaWordmark";
import ClinicalVisual from "@/components/ClinicalVisual";
import type { Screen } from "@/types";

interface WelcomeProps {
  onNavigate: (screen: Screen) => void;
}

export default function Welcome({ onNavigate }: WelcomeProps) {
  return (
    <div className="bg-radial-gradient min-h-screen w-full flex flex-col relative overflow-hidden text-[#191b23] selection:bg-[#2563eb] selection:text-white select-none">
      {/* Atmospheric Background Blurs */}
      <div className="noise-overlay z-0" />
      <div className="absolute top-[-10%] right-[-5%] w-[1000px] h-[1000px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[40%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Primary Content Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 relative z-10">
        
        {/* Left Region: Brand & Actions */}
        <div className="flex-1 flex flex-col justify-center max-w-3xl pt-6 lg:pt-0 pb-8 lg:pb-0 lg:pr-8" id="content-region">
          <header className="mb-10 animate-fade-up stagger-1">
            <div className="flex items-center gap-4 mb-8">
              <VaidyaWordmark size="md" showDescriptor={false} />
              <div className="h-6 w-px bg-[#c3c6d7]/50" />
              <span className="font-mono text-sm tracking-widest text-[#2563EB] font-medium uppercase">
                Clinical Intelligence
              </span>
            </div>

            <h1 className="text-[44px] sm:text-[56px] lg:text-[64px] leading-[1.1] font-semibold text-[#191b23] mb-5 tracking-[-0.03em] text-glow">
              Welcome to Vaidya
            </h1>
            <p className="text-[17px] sm:text-[20px] text-[#434655] max-w-xl leading-relaxed">
              Your clinical information, prepared before the consultation.
            </p>
          </header>

          {/* Action Cards */}
          <div className="space-y-5 animate-fade-up stagger-2 max-w-lg">
            
            {/* Primary Action: Begin Patient Intake */}
            <button
              onClick={() => onNavigate("patient-intake")}
              className="hero-card group relative w-full flex flex-col items-start justify-center px-8 py-7 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-[#2563eb]/30 cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-4 mb-2 relative z-10">
                <span className="p-2 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                  <Stethoscope size={28} strokeWidth={2} />
                </span>
                <span className="text-[22px] tracking-tight font-semibold text-[#191b23] group-hover:text-[#2563EB] transition-colors">
                  Begin Patient Intake
                </span>
              </div>
              <span className="text-[#434655] text-[15px] font-medium relative z-10 pl-14">
                Speak, tap, or scan your previous records.
              </span>
            </button>

            {/* Secondary Action: Staff & Clinical Access */}
            <button
              onClick={() => onNavigate("staff-role")}
              className="glass-panel-secondary group relative w-full flex flex-col items-start justify-center px-8 py-5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#737686]/30 cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="p-1.5 rounded-lg bg-white border border-[#E4E4E7] text-[#737686] group-hover:text-[#18181B] group-hover:border-[#2563EB] transition-all">
                  <ShieldCheck size={20} />
                </span>
                <span className="text-[17px] text-[#191b23] tracking-tight font-medium">
                  Staff &amp; Clinical Access
                </span>
              </div>
              <span className="text-[#737686] text-[14px] pl-10">
                For doctors, nursing staff, and administrators.
              </span>
            </button>
          </div>

          {/* Footer Info */}
          <footer className="mt-12 lg:mt-24 space-y-4 animate-fade-up stagger-3">
            <div className="flex items-center gap-3 text-[#434655]/90">
              <Languages size={18} className="text-[#2563EB]" />
              <span className="text-[14px] font-medium">Available in multiple Indian languages</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-px bg-[#c3c6d7]/30 flex-1 max-w-[60px]" />
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#737686] uppercase tracking-[0.15em]">
                <BadgeCheck size={14} className="text-[#16A34A]" />
                <span>Secure clinical intake • Physician verified</span>
              </div>
            </div>
          </footer>
        </div>

        {/* Right Region: Visual Anchor */}
        <div
          className="flex-1 hidden lg:flex items-center justify-center relative animate-fade-left stagger-4"
          id="visual-region"
        >
          <div className="perspective-container relative w-full max-w-[560px] aspect-square flex items-center justify-center">
            <ClinicalVisual />
          </div>
        </div>
      </div>
    </div>
  );
}
