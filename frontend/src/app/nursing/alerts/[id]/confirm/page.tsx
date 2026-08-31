'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NursingConfirmPage() {
  const router = useRouter()

  return (
    <div className="bg-[#F6F6F7] font-body-primary text-on-surface min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col border-r border-outline-variant/30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="px-lg py-lg flex items-center gap-md border-b border-outline-variant/20 mb-md">
          <span className="font-page-title text-page-title text-primary font-bold text-[22px]">Vaidya Nursing</span>
        </div>
        <nav className="flex-1 px-md flex flex-col gap-xs">
          <Link
            href="/nursing/dashboard"
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">view_list</span>
            <span className="text-body-compact">Patient Queue</span>
          </Link>
          <Link
            href="/nursing/alerts/enc-002"
            className="flex items-center justify-between px-md py-sm rounded-lg transition-all bg-primary-container text-on-primary-container font-semibold shadow-sm"
          >
            <div className="flex items-center gap-md">
              <span className="material-symbols-outlined text-[20px]">notification_important</span>
              <span className="text-body-compact">Triage Alerts</span>
            </div>
            <span className="bg-error text-on-error text-metadata-mono px-xs py-[2px] rounded-full min-w-[20px] text-center font-bold">8</span>
          </Link>
          <Link
            href="/nursing/history"
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">history</span>
            <span className="text-body-compact">History</span>
          </Link>
        </nav>
        <div className="px-md py-lg border-t border-outline-variant/20 flex flex-col gap-xs">
          <button className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all text-left">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="text-body-compact">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="pl-72">
        {/* Top Header */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-lg flex items-center justify-between">
          <div className="flex-1 max-w-xl">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-md text-outline">search</span>
              <input
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg py-sm pl-xl pr-md text-body-compact focus:outline-none focus:border-primary transition-colors"
                placeholder="Search patient ID, name, or MRN..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-lg">
            <div className="flex items-center gap-md pr-md border-r border-outline-variant/30">
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">help_outline</span>
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-surface" />
              </button>
            </div>
            <div className="flex items-center gap-md cursor-pointer group">
              <div className="text-right hidden sm:block">
                <div className="text-body-compact font-semibold text-on-surface">Dr. Ananya Rao</div>
                <div className="text-metadata-mono text-on-surface-variant">Triage Lead</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center border-2 border-primary-fixed group-hover:shadow-md transition-all text-white">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="relative pt-16 w-full min-h-screen">
          <div className="flex flex-col w-full h-full justify-center items-center p-lg relative overflow-hidden bg-background">
            <div className="w-full max-w-[640px] z-10 flex flex-col items-center py-8">
              {/* Success Animation Header */}
              <div className="flex flex-col items-center gap-md mb-xl text-center">
                <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center shadow-lg relative group transition-transform duration-500 hover:scale-105">
                  <div className="absolute inset-0 rounded-full border-2 border-secondary/20 animate-ping" />
                  <span className="material-symbols-outlined text-[40px] text-on-secondary-container">check_circle</span>
                </div>
                <h1 className="font-display-lg text-display-lg text-on-background mt-sm font-bold text-[36px]">Assessment Recorded</h1>
                <p className="font-body-primary text-body-primary text-on-surface-variant max-w-md">
                  The triage assessment has been securely logged to the patient&apos;s record.
                </p>
              </div>

              {/* Assessment Summary Card */}
              <div className="w-full bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-lg flex flex-col gap-md relative overflow-hidden border border-outline-variant/30">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-fixed via-primary to-surface-tint" />
                <div className="flex flex-col gap-xs mb-sm">
                  <span className="font-metadata-mono text-metadata-mono text-outline uppercase tracking-wider font-bold">Patient Detail</span>
                  <div className="flex items-center gap-sm">
                    <span className="font-section-heading text-section-heading text-on-surface font-bold text-[20px]">Priya Menon</span>
                    <span className="font-metadata-mono text-metadata-mono text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-md">MRN: 849-221-55X</span>
                  </div>
                </div>

                {/* Grid Data */}
                <div className="grid grid-cols-2 gap-y-md gap-x-lg py-md border-t border-surface-container-highest">
                  <div className="flex flex-col gap-xs">
                    <span className="font-metadata-mono text-metadata-mono text-outline uppercase tracking-wider font-bold">Action Taken</span>
                    <span className="font-body-primary text-body-primary text-on-surface font-medium flex items-center gap-sm">
                      <span className="w-2 h-2 rounded-full bg-secondary" />
                      Stable monitoring
                    </span>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <span className="font-metadata-mono text-metadata-mono text-outline uppercase tracking-wider font-bold">Assessed By</span>
                    <span className="font-body-primary text-body-primary text-on-surface font-medium">Nurse S. Kumar</span>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <span className="font-metadata-mono text-metadata-mono text-outline uppercase tracking-wider font-bold">Timestamp</span>
                    <span className="font-metadata-mono text-metadata-mono text-on-surface font-bold">14:32:05 IST / Oct 24</span>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <span className="font-metadata-mono text-metadata-mono text-outline uppercase tracking-wider font-bold">Audit Ref</span>
                    <span className="font-metadata-mono text-metadata-mono text-on-surface-variant bg-surface-container py-0.5 px-1.5 rounded w-max font-bold">TRIG-2026-0047</span>
                  </div>
                </div>

                {/* Status Chip */}
                <div className="mt-xs bg-surface-container flex items-center gap-sm p-sm rounded-lg border-l-2 border-outline-variant">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">queue</span>
                  <span className="font-body-compact text-body-compact text-on-surface-variant">Case remains in standard queue</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-md mt-xl w-full max-w-md">
                <button
                  onClick={() => router.push('/nursing/dashboard')}
                  className="w-full sm:flex-1 bg-primary text-on-primary font-body-compact text-body-compact font-semibold py-sm px-md rounded-lg shadow-md hover:bg-primary-container transition-all flex justify-center items-center gap-xs cursor-pointer h-12"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  <span>Back to Alert Queue</span>
                </button>
                <button
                  onClick={() => router.push('/nursing/dashboard')}
                  className="w-full sm:flex-1 bg-surface-container-high text-on-surface font-body-compact text-body-compact font-semibold py-sm px-md rounded-lg hover:bg-surface-dim transition-all flex justify-center items-center gap-xs cursor-pointer h-12 border border-outline-variant/30"
                >
                  <span>View Next Alert</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
