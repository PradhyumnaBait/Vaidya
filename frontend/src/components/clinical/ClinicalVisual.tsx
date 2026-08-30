import { useEffect, useState } from "react";

const layers = [
  {
    label: "Patient Input",
    sublabel: "Voice · Touch · Document",
    items: ["Chief complaint captured", "Language: Hindi (auto-detected)", "Voice transcript ready"],
    accent: "#2563EB",
    accentBg: "#EFF6FF",
    z: 0,
  },
  {
    label: "Document Analysis",
    sublabel: "Multi-modal extraction",
    items: ["CBC report · 14 Mar 2024", "Prescription · Apollo Hospital", "X-Ray findings processed"],
    accent: "#0D9488",
    accentBg: "#F0FDFA",
    z: 1,
  },
  {
    label: "Structured Information",
    sublabel: "Clinical facts · Timeline",
    items: ["Hb: 9.2 g/dL  [flagged ↓]", "Duration: 3 months, progressive", "Co-morbidity: T2DM (2019)"],
    accent: "#16A34A",
    accentBg: "#F0FDF4",
    z: 2,
  },
  {
    label: "Physician Review",
    sublabel: "Case brief · Evidence-linked",
    items: ["AI summary · 3 sources", "Conflict resolved · 1 item", "Ready for consultation"],
    accent: "#2563EB",
    accentBg: "#EFF6FF",
    z: 3,
  },
];

export default function ClinicalVisual() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none"
      aria-hidden="true"
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 60% 45%, rgba(37,99,235,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Stack container */}
      <div
        className="relative"
        style={{
          width: 340,
          height: 400,
          perspective: "1100px",
          perspectiveOrigin: "50% 45%",
        }}
      >
        {layers.map((layer, i) => {
          const yOffset = i * 76;
          const delay = mounted ? `${i * 80 + 200}ms` : "0ms";

          return (
            <div
              key={layer.label}
              className="absolute w-full"
              style={{
                top: yOffset,
                opacity: mounted ? 1 : 0,
                transform: mounted
                  ? "translateY(0px)"
                  : "translateY(10px)",
                transition: `opacity 300ms ease-out ${delay}, transform 300ms ease-out ${delay}`,
              }}
            >
              {/* Panel */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E4E4E7",
                  borderRadius: 8,
                  padding: "10px 14px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                  transform: `rotateX(${14 - i * 1.5}deg) rotateY(-14deg) translateZ(${i * 6}px)`,
                  transformOrigin: "50% 50%",
                  willChange: "transform",
                }}
              >
                {/* Panel header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: layer.accent,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#18181B",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {layer.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 10,
                      color: "#A1A1AA",
                      fontWeight: 400,
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
                          width: 16,
                          height: 14,
                          background: layer.accentBg,
                          borderRadius: 3,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          color: "#3F3F46",
                          fontWeight: 400,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Layer indicator */}
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5"
                  style={{ opacity: 0.3 }}
                >
                  {layers.map((_, k) => (
                    <div
                      key={k}
                      style={{
                        width: 3,
                        height: k === i ? 16 : 8,
                        background: k === i ? layer.accent : "#D4D4D8",
                        borderRadius: 2,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Connector line */}
              {i < layers.length - 1 && (
                <div
                  className="absolute"
                  style={{
                    left: 28,
                    bottom: -14,
                    width: 1,
                    height: 14,
                    background: "linear-gradient(to bottom, #E4E4E7, transparent)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom label */}
      <div
        className="absolute bottom-4 left-0 right-0 flex justify-center"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 400ms ease-out 600ms",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 10,
            color: "#A1A1AA",
            letterSpacing: "0.06em",
            fontWeight: 500,
            textTransform: "uppercase",
          }}
        >
          Clinical intelligence flow
        </span>
      </div>
    </div>
  );
}
