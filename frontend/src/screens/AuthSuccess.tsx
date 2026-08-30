import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import VaidyaWordmark from "@/components/VaidyaWordmark";
import type { Screen } from "@/types";

interface AuthSuccessProps {
  onNavigate: (screen: Screen) => void;
  meta?: Record<string, string>;
}

const roleLabels: Record<string, { title: string; subtitle: string }> = {
  doctor: { title: "Physician workspace", subtitle: "Preparing your clinical workspace." },
  nursing: { title: "Triage & Patient Operations", subtitle: "Preparing triage and patient operations." },
  admin: { title: "Hospital Operations", subtitle: "Preparing hospital operations." },
};

import { useRouter } from "next/navigation";
import { useAuthStore, DEMO_USERS } from "@/store";

export default function AuthSuccess({ meta }: AuthSuccessProps) {
  const router = useRouter();
  const { login } = useAuthStore();
  const role = (meta?.role as "doctor" | "nursing" | "admin") || "doctor";
  const info = roleLabels[role] || roleLabels.doctor;

  useEffect(() => {
    // Set demo auth state
    if (role === "doctor") login(DEMO_USERS.doctor);
    else if (role === "nursing") login(DEMO_USERS.nursing);
    else if (role === "admin") login(DEMO_USERS.admin);

    const timer = setTimeout(() => {
      if (role === "doctor") router.push("/doctor/queue");
      else if (role === "nursing") router.push("/nursing/dashboard");
      else if (role === "admin") router.push("/admin");
      else router.push("/");
    }, 1200);

    return () => clearTimeout(timer);
  }, [role, router, login]);


  return (
    <div className="min-h-full flex flex-col" style={{ background: "#F6F6F7" }}>
      <header className="px-6 md:px-10 py-5 animate-fade-up">
        <VaidyaWordmark size="md" />
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center animate-fade-up stagger-1">
          <div className="flex justify-center mb-5">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F0FDF4] border border-[#BBF7D0]">
              <CheckCircle2 size={22} className="text-[#16A34A]" strokeWidth={1.75} />
            </div>
          </div>

          <h1 className="text-xl font-semibold text-[#18181B] mb-1">You&apos;re signed in.</h1>
          <p className="text-[15px] text-[#71717A] mb-6">Opening your workspace…</p>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm text-[#3F3F46]"
            style={{ background: "white", borderColor: "#E4E4E7" }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"
              style={{ boxShadow: "0 0 0 3px rgba(22,163,74,0.15)" }}
            />
            {info.title}
          </div>

          <p className="text-xs text-[#A1A1AA] mt-5">{info.subtitle}</p>

          {/* Progress indicator */}
          <div className="mt-8 mx-auto w-48">
            <div className="h-0.5 rounded-full bg-[#E4E4E7] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#2563EB]"
                style={{
                  width: "60%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                  background: "linear-gradient(90deg, #2563EB 0%, #60A5FA 50%, #2563EB 100%)",
                  backgroundSize: "200% 100%",
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
