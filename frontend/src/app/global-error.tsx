'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="bg-[#FAF8FF] min-h-screen flex items-center justify-center p-6 text-center font-sans">
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-8 max-w-md shadow-sm">
          <h2 className="text-[20px] font-bold text-[#18181B] mb-2">Application Error</h2>
          <p className="text-[14px] text-[#71717A] mb-6">
            A critical application error occurred.
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-[#004AC6] text-white text-[14px] font-bold hover:bg-[#003EA8] transition-all"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  )
}
