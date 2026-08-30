'use client'
import { useEffect, useState } from "react";

const layers = [
  {
    label: "Patient Input",
    sublabel: "Voice · Touch · Document",
    items: ["Chief complaint captured", "Language: Hindi (auto-detected)", "Voice transcript ready"],
    accent: "#2563EB",
    accentBg: "#EFF6FF",
  },
  {
    label: "Document Analysis",
    sublabel: "Multi-modal extraction",
    items: ["CBC report · 14 Mar 2024", "Prescription · Apollo Hospital", "X-Ray findings processed"],
    accent: "#0D9488",
    accentBg: "#F0FDFA",
  },
  {
    label: "Structured Information",
    sublabel: "Clinical facts · Timeline",
    items: ["Hb: 9.2 g/dL  [flagged ↓]", "Duration: 3 months, progressive", "Co-morbidity: T2DM (2019)"],
    accent: "#16A34A",
    accentBg: "#F0FDF4",
  },
  {
    label: "Physician Review",
    sublabel: "Case brief · Evidence-linked",
    items: ["AI summary · 3 sources", "Conflict resolved · 1 item", "Ready for consultation"],
    accent: "#2563EB",
    accentBg: "#EFF6FF",
  },
];

export default function ClinicalVisual() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none py-6"
      aria-hidden="true"
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(37,99,235,0.08) 0%, transparent 70%)",
        }}
      />

      {/* 3D Stack container */}
      <div
        className="relative"
        style={{
          width: 330,
          height: 380,
          perspective: "1000px",
          perspectiveOrigin: "50% 40%",
          transformStyle: "preserve-3d",
        }}
      >
        {layers.map((layer, i) => {
          const yOffset = i * 78;
          const delay = `${i * 90 + 100}ms`;

          return (
            <div
              key={layer.label}
              className="absolute w-full"
              style={{
                top: yOffset,
                opacity: mounted ? 1 : 0,
                transform: mounted
                  ? "translateY(0px)"
                  : "translateY(16px)",
                transition: `opacity 400ms ease-out ${delay}, transform 400ms ease-out ${delay}`,
              }}
            >
              {/* 3D Panel Surface */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E4E4E7",
                  borderRadius: 10,
                  padding: "12px 16px",
                  boxShadow:
                    "0 4px 20px -2px rgba(0,0,0,0.08), 0 2px 6px -1px rgba(0,0,0,0.04)",
                  transform: `rotateX(${12 - i * 1.5}deg) rotateY(-12deg) translateZ(${i * 8}px)`,
                  transformOrigin: "50% 50%",
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                }}
              >
                {/* Panel header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: layer.accent,
                        flexShrink: 0,
                        boxShadow: `0 0 6px ${layer.accent}`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#18181B",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {layer.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 10,
                      color: "#71717A",
                      fontWeight: 500,
                    }}
                  >
                    {layer.sublabel}
                  </span>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "#F4F4F5", marginBottom: 8 }} />

                {/* Items */}
                <div className="flex flex-col gap-1.5">
                  {layer.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div
                        style={{
                          width: 14,
                          height: 12,
                          background: layer.accentBg,
                          borderRadius: 3,
                          border: `1px solid ${layer.accent}30`,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "#3F3F46",
                          fontWeight: 400,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Layer indicator dots */}
                <div
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5"
                  style={{ opacity: 0.4 }}
                >
                  {layers.map((_, k) => (
                    <div
                      key={k}
                      style={{
                        width: 3,
                        height: k === i ? 18 : 8,
                        background: k === i ? layer.accent : "#D4D4D8",
                        borderRadius: 2,
                        transition: "all 200ms",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Connecting vertical guide */}
              {i < layers.length - 1 && (
                <div
                  className="absolute"
                  style={{
                    left: 28,
                    bottom: -16,
                    width: 2,
                    height: 16,
                    background:
                      "linear-gradient(to bottom, #2563EB40, transparent)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom label */}
      <div
        className="absolute bottom-2 left-0 right-0 flex justify-center"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 400ms ease-out 600ms",
        }}
      >
        <span
          className="px-3 py-1 rounded-full bg-white border border-[#E4E4E7] shadow-2xs"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 10,
            color: "#71717A",
            letterSpacing: "0.06em",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          Clinical intelligence flow
        </span>
      </div>
    </div>
  );
}
