'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App-level error caught:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#FAF8FF] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-8 max-w-md shadow-sm">
        <h2 className="text-[20px] font-bold text-[#18181B] mb-2">Something went wrong</h2>
        <p className="text-[14px] text-[#71717A] mb-6">
          An unexpected error occurred. You can retry the current action.
        </p>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-[#004AC6] text-white text-[14px] font-bold hover:bg-[#003EA8] transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
