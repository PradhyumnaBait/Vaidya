interface VaidyaWordmarkProps {
  size?: "sm" | "md" | "lg";
  showDescriptor?: boolean;
}

export default function VaidyaWordmark({ size = "md", showDescriptor = true }: VaidyaWordmarkProps) {
  const sizes = {
    sm: { name: "text-base tracking-[-0.02em] font-semibold", descriptor: "text-[10px] tracking-[0.08em]" },
    md: { name: "text-xl tracking-[-0.02em] font-semibold", descriptor: "text-[11px] tracking-[0.08em]" },
    lg: { name: "text-2xl tracking-[-0.025em] font-semibold", descriptor: "text-xs tracking-[0.08em]" },
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center rounded"
        style={{
          width: size === "sm" ? 28 : size === "md" ? 32 : 38,
          height: size === "sm" ? 28 : size === "md" ? 32 : 38,
          background: "#2563EB",
        }}
      >
        <svg
          width={size === "sm" ? 14 : size === "md" ? 16 : 20}
          height={size === "sm" ? 14 : size === "md" ? 16 : 20}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M3 4L10 16L17 4"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 4L10 10.5L13.5 4"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div className={`${sizes[size].name} text-[#18181B] leading-none`}>VAIDYA</div>
        {showDescriptor && (
          <div className={`${sizes[size].descriptor} font-medium uppercase text-[#71717A] mt-0.5`}>
            Clinical Intelligence
          </div>
        )}
      </div>
    </div>
  );
}
