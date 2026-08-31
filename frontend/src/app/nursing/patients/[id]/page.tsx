'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NursingPatientDetailPage() {
  const router = useRouter()
  const [priority, setPriority] = useState('standard')

  const handleUpdatePriority = () => {
    alert(`Priority updated to ${priority.toUpperCase()}`)
  }

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
            className="flex items-center gap-md px-md py-sm rounded-lg transition-all bg-primary-container text-on-primary-container font-semibold shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">view_list</span>
            <span className="text-body-compact">Patient Queue</span>
          </Link>
          <Link
            href="/nursing/alerts/enc-002"
            className="flex items-center justify-between px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
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
          <div className="flex flex-col w-full p-lg gap-lg">
            {/* Header Top Row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-md">
                <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-page-title font-page-title text-primary font-bold text-[24px]">
                  DP
                </div>
                <div className="flex flex-col gap-xs">
                  <div className="flex items-center gap-sm">
                    <h1 className="text-display-lg font-display-lg text-on-surface m-0 font-bold text-[32px]">Dhananjay Patil</h1>
                    <span className="px-sm py-xs bg-surface-container rounded-full text-metadata-mono font-metadata-mono text-on-surface-variant font-bold">MRN: 8849-2A</span>
                  </div>
                  <div className="flex items-center gap-md text-body-primary font-body-primary text-on-surface-variant">
                    <span>42 Yrs</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant" />
                    <span>Male</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant" />
                    <span>Blood: O+</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push('/nursing/dashboard')}
                className="px-md py-sm bg-surface-container rounded-lg text-body-compact font-body-compact font-semibold text-on-surface flex items-center gap-sm hover:bg-surface-container-high transition-colors border border-outline-variant/30 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Back to Queue</span>
              </button>
            </div>

            {/* Known Allergy Banner */}
            <div className="w-full bg-error rounded-xl p-md flex items-center justify-between text-on-error shadow-sm mb-sm">
              <div className="flex items-center gap-md">
                <span className="material-symbols-outlined text-[24px]">warning</span>
                <div className="flex flex-col">
                  <span className="text-body-compact font-body-compact font-semibold uppercase tracking-wider">Known Allergy</span>
                  <span className="text-body-primary font-body-primary font-bold">Penicillin - Severe Anaphylaxis</span>
                </div>
              </div>
              <button className="px-md py-sm bg-on-error/20 rounded-lg text-body-compact font-body-compact text-on-error hover:bg-on-error/30 transition-colors font-semibold">
                Acknowledged (Dr. Rao)
              </button>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-12 gap-lg">
              {/* Left Column (8 cols) */}
              <div className="col-span-8 flex flex-col gap-lg">
                {/* Triage Vitals */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm p-lg flex flex-col gap-md relative overflow-hidden border border-outline-variant/30">
                  <div className="flex items-center justify-between z-10">
                    <h2 className="text-section-heading font-section-heading text-on-surface m-0 font-bold text-[20px]">Triage Vitals</h2>
                    <div className="flex items-center gap-sm px-sm py-xs bg-surface-container rounded-full border border-outline-variant/50">
                      <span className="w-2 h-2 rounded-full bg-secondary" />
                      <span className="text-metadata-mono font-metadata-mono text-on-surface-variant">Recorded 12 mins ago</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-md z-10">
                    <div className="flex flex-col gap-xs p-md bg-surface rounded-lg border border-outline-variant/20">
                      <span className="text-body-compact font-body-compact text-on-surface-variant font-bold">Blood Pressure</span>
                      <div className="flex items-baseline gap-xs">
                        <span className="text-page-title font-page-title text-on-surface font-bold text-[24px]">138/85</span>
                        <span className="text-metadata-mono font-metadata-mono text-outline">mmHg</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-xs p-md bg-surface rounded-lg border border-outline-variant/20">
                      <span className="text-body-compact font-body-compact text-on-surface-variant font-bold">SpO2</span>
                      <div className="flex items-baseline gap-xs">
                        <span className="text-page-title font-page-title text-on-surface font-bold text-[24px]">98</span>
                        <span className="text-metadata-mono font-metadata-mono text-outline">%</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-xs p-md bg-surface rounded-lg border border-outline-variant/20">
                      <span className="text-body-compact font-body-compact text-on-surface-variant font-bold">Pulse</span>
                      <div className="flex items-baseline gap-xs">
                        <span className="text-page-title font-page-title text-on-surface font-bold text-[24px]">88</span>
                        <span className="text-metadata-mono font-metadata-mono text-outline">bpm</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chief Complaint & Current Medications */}
                <div className="grid grid-cols-2 gap-md">
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm p-md flex flex-col gap-sm border border-outline-variant/30">
                    <h3 className="text-body-compact font-body-compact font-semibold text-on-surface-variant uppercase tracking-wider">Chief Complaint</h3>
                    <p className="text-body-primary font-body-primary text-on-surface">Patient reports persistent dull ache in lower right abdomen for the past 24 hours. Accompanied by mild nausea but no vomiting.</p>
                    <div className="mt-auto pt-sm flex items-center gap-xs">
                      <span className="px-sm py-[2px] rounded-full bg-surface-container text-metadata-mono font-metadata-mono text-on-surface-variant border border-outline-variant/50 font-bold">T1: Verified</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest rounded-xl shadow-sm p-md flex flex-col gap-sm border border-outline-variant/30">
                    <h3 className="text-body-compact font-body-compact font-semibold text-on-surface-variant uppercase tracking-wider">Current Medications</h3>
                    <ul className="flex flex-col gap-xs text-body-primary font-body-primary text-on-surface">
                      <li className="flex items-center gap-sm"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Metformin 500mg (Daily)</li>
                      <li className="flex items-center gap-sm"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Atorvastatin 20mg (Nightly)</li>
                    </ul>
                    <div className="mt-auto pt-sm flex items-center gap-xs">
                      <span className="px-sm py-[2px] rounded-full bg-surface-container text-metadata-mono font-metadata-mono text-on-surface-variant border border-outline-variant/50 font-bold">T2: Patient Reported</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols) */}
              <div className="col-span-4 flex flex-col gap-lg">
                {/* Queue Priority */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm p-lg flex flex-col gap-md border border-outline-variant/30">
                  <h2 className="text-section-heading font-section-heading text-on-surface m-0 font-bold text-[18px]">Queue Priority</h2>
                  <div className="flex flex-col gap-sm">
                    <label className={`flex items-center p-md rounded-lg cursor-pointer transition-colors border ${priority === 'standard' ? 'bg-surface border-outline-variant' : 'bg-surface border-outline-variant/20'}`}>
                      <input
                        className="w-4 h-4 text-primary focus:ring-primary border-outline-variant cursor-pointer"
                        name="priority"
                        type="radio"
                        value="standard"
                        checked={priority === 'standard'}
                        onChange={() => setPriority('standard')}
                      />
                      <div className="ml-sm flex flex-col">
                        <span className="text-body-primary font-body-primary font-semibold text-on-surface">Standard</span>
                        <span className="text-metadata-mono font-metadata-mono text-on-surface-variant">Wait time: ~45 mins</span>
                      </div>
                    </label>

                    <label className={`flex items-center p-md rounded-lg cursor-pointer transition-colors border ${priority === 'priority' ? 'bg-tertiary-container/20 border-tertiary-container/40' : 'bg-tertiary-container/10 border-tertiary-container/30'}`}>
                      <input
                        className="w-4 h-4 text-tertiary focus:ring-tertiary border-tertiary-container cursor-pointer"
                        name="priority"
                        type="radio"
                        value="priority"
                        checked={priority === 'priority'}
                        onChange={() => setPriority('priority')}
                      />
                      <div className="ml-sm flex flex-col">
                        <span className="text-body-primary font-body-primary font-semibold text-tertiary">Priority</span>
                        <span className="text-metadata-mono font-metadata-mono text-tertiary">Wait time: ~15 mins</span>
                      </div>
                    </label>

                    <label className={`flex items-center p-md rounded-lg cursor-pointer transition-colors border ${priority === 'urgent' ? 'bg-error-container/30 border-error-container/60' : 'bg-error-container/20 border-error-container/50'}`}>
                      <input
                        className="w-4 h-4 text-error focus:ring-error border-error-container cursor-pointer"
                        name="priority"
                        type="radio"
                        value="urgent"
                        checked={priority === 'urgent'}
                        onChange={() => setPriority('urgent')}
                      />
                      <div className="ml-sm flex flex-col">
                        <span className="text-body-primary font-body-primary font-semibold text-error">Urgent</span>
                        <span className="text-metadata-mono font-metadata-mono text-error">Immediate attention</span>
                      </div>
                    </label>
                  </div>
                  <button
                    onClick={handleUpdatePriority}
                    className="mt-sm w-full py-sm bg-primary text-on-primary rounded-lg text-body-compact font-body-compact font-semibold hover:bg-primary-fixed-variant transition-colors shadow-sm cursor-pointer h-10"
                  >
                    Update Priority
                  </button>
                </div>

                {/* Intake Progress */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm p-lg flex flex-col gap-md border border-outline-variant/30">
                  <div className="flex items-center justify-between">
                    <h2 className="text-section-heading font-section-heading text-on-surface m-0 font-bold text-[18px]">Intake Progress</h2>
                    <span className="text-body-compact font-body-compact font-semibold text-secondary text-[16px]">80%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-4/5 rounded-full" />
                  </div>
                  <div className="flex flex-col gap-xs mt-sm space-y-1">
                    <div className="flex items-center justify-between text-body-compact font-body-compact">
                      <span className="text-on-surface flex items-center gap-sm font-medium">
                        <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span> Demographics
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-body-compact font-body-compact">
                      <span className="text-on-surface flex items-center gap-sm font-medium">
                        <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span> Vitals
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-body-compact font-body-compact">
                      <span className="text-on-surface flex items-center gap-sm font-medium">
                        <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span> History
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-body-compact font-body-compact">
                      <span className="text-on-surface-variant flex items-center gap-sm">
                        <span className="material-symbols-outlined text-[16px]">radio_button_unchecked</span> Imaging Upload
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
