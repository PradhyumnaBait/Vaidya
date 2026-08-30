import { Stethoscope, HeartPulse, Building2, ChevronRight, ArrowLeft } from "lucide-react";
import VaidyaWordmark from "@/components/ui/VaidyaWordmark";
import type { Screen } from "@/types";

interface StaffRoleProps {
  onNavigate: (screen: Screen) => void;
}

const roles = [
  {
    screen: "doctor-login" as Screen,
    icon: Stethoscope,
    title: "Doctor",
    subtitle: "Physician workspace",
    description: "Review patient cases, clinical summaries and consultation information.",
    accent: "#2563EB",
    accentBg: "#EFF6FF",
  },
  {
    screen: "nursing-login" as Screen,
    icon: HeartPulse,
    title: "Nursing / Staff",
    subtitle: "Triage & patient operations",
    description: "Monitor patient status, urgent alerts and intake progress.",
    accent: "#0D9488",
    accentBg: "#F0FDFA",
  },
  {
    screen: "admin-login" as Screen,
    icon: Building2,
    title: "Admin",
    subtitle: "Hospital operations",
    description: "Monitor system activity, integrations and operational analytics.",
    accent: "#52525B",
    accentBg: "#F4F4F5",
  },
];

export default function StaffRole({ onNavigate }: StaffRoleProps) {
  return (
    <div className="min-h-full flex flex-col" style={{ background: "#F6F6F7" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-5 animate-fade-up">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("welcome")}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#F0F0F1] transition-colors text-[#71717A] hover:text-[#18181B]"
            aria-label="Back to welcome"
          >
            <ArrowLeft size={16} />
          </button>
          <VaidyaWordmark size="md" />
        </div>
        <div
          className="text-xs font-medium text-[#71717A] uppercase tracking-[0.07em] px-2.5 py-1 rounded border border-[#E4E4E7] bg-white"
        >
          Staff & Clinical Access
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center">
        <div className="w-full max-w-3xl mx-auto px-6 md:px-10 py-12">
          {/* Heading */}
          <div className="mb-10 animate-fade-up stagger-1">
            <h1
              className="text-[28px] sm:text-[32px] font-semibold text-[#18181B] leading-[1.2]"
              style={{ letterSpacing: "-0.018em" }}
            >
              Choose your workspace
            </h1>
            <p className="text-[14px] text-[#71717A] mt-2">
              Select the workspace you use for your work at the hospital.
            </p>
          </div>

          {/* Role cards */}
          <div className="flex flex-col gap-3">
            {roles.map((role, i) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.title}
                  onClick={() => onNavigate(role.screen)}
                  className={`group flex items-center gap-5 w-full text-left px-5 py-4 rounded-lg border border-[#E4E4E7] bg-white hover:border-[#D4D4D8] hover:shadow-sm transition-all duration-150 active:scale-[0.99] animate-fade-up`}
                  style={{
                    animationDelay: `${(i + 2) * 60}ms`,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
                    style={{ background: role.accentBg }}
                  >
                    <Icon size={18} strokeWidth={1.75} style={{ color: role.accent }} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[15px] font-semibold text-[#18181B]">{role.title}</span>
                      <span className="text-xs text-[#A1A1AA] font-medium">{role.subtitle}</span>
                    </div>
                    <p className="text-sm text-[#71717A] mt-0.5 leading-[1.5]">{role.description}</p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    size={16}
                    className="text-[#D4D4D8] group-hover:text-[#A1A1AA] transition-colors flex-shrink-0"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
