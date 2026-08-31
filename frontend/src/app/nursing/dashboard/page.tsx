'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NursingDashboardPage() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState('10:42 AM')
  const [selectedPatient, setSelectedPatient] = useState({
    id: 'pat-001',
    name: 'Dhananjay Patil',
    initials: 'DP',
    age: 67,
    gender: 'MALE',
    mrn: '849-221',
    cc: 'Epigastric pain, 2 days duration.',
    details: 'Patient reports dull ache worsening after meals. No vomiting. Mild nausea present.',
    condition: 'T2 Diabetes',
    hr: '88 bpm',
    temp: '98.6°F',
  })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

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
          <div className="flex flex-col w-full h-[calc(100vh-64px)] overflow-hidden bg-background font-body-primary text-on-surface">
            <div className="flex flex-1 overflow-hidden">
              {/* Left Column: Patient Queue (~65%) */}
              <div className="flex-1 flex flex-col h-full border-r border-outline-variant/30 overflow-y-auto">
                <div className="sticky top-0 bg-surface/90 backdrop-blur-md z-10 px-lg py-md border-b border-outline-variant/20 flex items-center justify-between">
                  <div>
                    <h1 className="font-page-title text-page-title text-on-surface">Triage Queue</h1>
                    <p className="text-metadata-mono text-on-surface-variant">
                      Last updated: <span>{currentTime}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className="text-metadata-mono text-on-surface-variant uppercase tracking-wider">Sort by:</span>
                    <button className="flex items-center gap-xs px-sm py-xs bg-surface-container-high rounded-lg text-body-compact text-on-surface font-semibold hover:bg-surface-container transition-colors">
                      Severity <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
                    </button>
                  </div>
                </div>

                <div className="p-lg flex flex-col gap-xl">
                  {/* SECTION A: Active Alerts */}
                  <section className="flex flex-col gap-sm">
                    <div className="flex items-center gap-sm mb-xs">
                      <span className="material-symbols-outlined text-tertiary">warning</span>
                      <h2 className="font-section-heading text-section-heading text-tertiary">Active Alerts</h2>
                      <span className="bg-tertiary-container text-on-tertiary-container text-metadata-mono px-2 py-0.5 rounded-full ml-xs font-bold">2 Pending</span>
                    </div>

                    {/* Alert Row 1 - Priya Menon */}
                    <div
                      onClick={() => router.push('/nursing/alerts/enc-002')}
                      className="bg-[#FFFBEB] rounded-xl p-md shadow-sm border border-[#F59E0B]/30 hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-md relative overflow-hidden group"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F59E0B]" />
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-md">
                          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-page-title text-on-surface font-bold">
                            PM
                          </div>
                          <div>
                            <div className="flex items-center gap-sm">
                              <h3 className="font-section-heading text-section-heading text-on-surface">Priya Menon</h3>
                              <span className="text-metadata-mono text-on-surface-variant">52F</span>
                              <span className="text-metadata-mono bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant border border-outline-variant/30">#23</span>
                            </div>
                            <p className="text-body-compact text-on-surface-variant mt-0.5">Arrival: 10:35 AM • Wait: 7m</p>
                          </div>
                        </div>
                        <div className="bg-tertiary/10 border border-tertiary/30 text-tertiary px-sm py-xs rounded-full flex items-center gap-xs text-metadata-mono font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                          T1: Kiosk Input
                        </div>
                      </div>
                      <div className="flex items-center gap-sm bg-white/50 p-sm rounded-lg border border-[#F59E0B]/20">
                        <span className="material-symbols-outlined text-tertiary text-[20px]">monitor_heart</span>
                        <p className="text-body-primary font-medium text-on-surface">Chest pain with left arm radiation</p>
                      </div>
                      <div className="flex justify-end mt-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push('/nursing/alerts/enc-002')
                          }}
                          className="px-md py-sm border border-[#F59E0B] text-[#B45309] rounded-lg text-body-compact font-semibold hover:bg-[#F59E0B]/10 transition-colors flex items-center gap-xs cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">check_circle</span>
                          Acknowledge Alert
                        </button>
                      </div>
                    </div>

                    {/* Alert Row 2 - Rohan Kumar */}
                    <div
                      onClick={() => router.push('/nursing/alerts/enc-002')}
                      className="bg-[#FFFBEB] rounded-xl p-md shadow-sm border border-[#F59E0B]/30 hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-sm relative overflow-hidden opacity-80 group hover:opacity-100"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F59E0B]/50" />
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-md">
                          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-page-title text-body-compact text-on-surface font-bold">
                            RK
                          </div>
                          <div>
                            <h3 className="font-section-heading text-body-primary font-semibold text-on-surface">
                              Rohan Kumar <span className="text-metadata-mono text-on-surface-variant font-normal ml-xs">28M</span>{' '}
                              <span className="text-metadata-mono bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant border border-outline-variant/30 ml-xs">#26</span>
                            </h3>
                          </div>
                        </div>
                        <span className="text-body-compact text-tertiary font-medium">Difficulty breathing (Asthma history)</span>
                      </div>
                    </div>
                  </section>

                  {/* SECTION B: Routine Queue */}
                  <section className="flex flex-col gap-sm mt-md">
                    <div className="flex items-center gap-sm mb-xs border-b border-outline-variant/20 pb-sm">
                      <h2 className="font-section-heading text-section-heading text-on-surface">Routine Queue</h2>
                      <span className="bg-surface-container-highest text-on-surface-variant text-metadata-mono px-2 py-0.5 rounded-full ml-xs">12 Patients</span>
                    </div>

                    {/* Routine Row 1 - Dhananjay Patil */}
                    <div
                      onClick={() => {
                        setSelectedPatient({
                          id: 'pat-001',
                          name: 'Dhananjay Patil',
                          initials: 'DP',
                          age: 67,
                          gender: 'MALE',
                          mrn: '849-221',
                          cc: 'Epigastric pain, 2 days duration.',
                          details: 'Patient reports dull ache worsening after meals. No vomiting. Mild nausea present.',
                          condition: 'T2 Diabetes',
                          hr: '88 bpm',
                          temp: '98.6°F',
                        })
                      }}
                      className={`p-md rounded-xl border-l-2 cursor-pointer flex flex-col gap-sm relative transition-all ${
                        selectedPatient.id === 'pat-001'
                          ? 'bg-primary/5 border-l-primary shadow-sm border border-outline-variant/30'
                          : 'bg-surface border-outline-variant/20 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-md">
                          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-page-title font-bold">
                            DP
                          </div>
                          <div>
                            <div className="flex items-center gap-sm">
                              <h3 className="font-section-heading text-section-heading text-primary">Dhananjay Patil</h3>
                              <span className="text-metadata-mono text-on-surface-variant">67M</span>
                              <span className="text-metadata-mono bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant border border-outline-variant/30">#31</span>
                            </div>
                            <p className="text-body-compact text-on-surface-variant mt-0.5">Arrival: 09:15 AM • Wait: 1h 27m</p>
                          </div>
                        </div>
                        <div className="bg-secondary/10 border border-secondary/30 text-secondary px-sm py-xs rounded-full flex items-center gap-xs text-metadata-mono font-bold">
                          <span className="material-symbols-outlined text-[14px]">task_alt</span>
                          Interview Complete
                        </div>
                      </div>
                      <div className="ml-[56px]">
                        <p className="text-body-primary text-on-surface"><span className="font-semibold">CC:</span> Epigastric pain, 2 days duration</p>
                      </div>
                    </div>

                    {/* Routine Row 2 - Sunita Nayak */}
                    <div
                      onClick={() => router.push('/nursing/patients/pat-002')}
                      className="bg-surface rounded-xl p-md border border-outline-variant/20 shadow-sm hover:shadow-md cursor-pointer flex flex-col gap-sm transition-all group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-md">
                          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-page-title text-on-surface-variant font-bold">
                            SN
                          </div>
                          <div>
                            <div className="flex items-center gap-sm">
                              <h3 className="font-section-heading text-section-heading text-on-surface group-hover:text-primary transition-colors">Sunita Nayak</h3>
                              <span className="text-metadata-mono text-on-surface-variant">45F</span>
                              <span className="text-metadata-mono bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant border border-outline-variant/30">#32</span>
                            </div>
                            <p className="text-body-compact text-on-surface-variant mt-0.5">Arrival: 09:40 AM • Wait: 1h 02m</p>
                          </div>
                        </div>
                        <div className="bg-surface-container-high border border-outline-variant/50 text-on-surface-variant px-sm py-xs rounded-full flex items-center gap-xs text-metadata-mono">
                          <span className="material-symbols-outlined text-[14px]">pending</span>
                          Pending Vitals
                        </div>
                      </div>
                      <div className="ml-[56px]">
                        <p className="text-body-primary text-on-surface"><span className="font-semibold">CC:</span> Persistent cough, mild fever</p>
                      </div>
                    </div>

                    {/* Routine Row 3 - Amit Kumar */}
                    <div
                      onClick={() => router.push('/nursing/patients/pat-003')}
                      className="bg-surface rounded-xl p-md border border-outline-variant/20 shadow-sm hover:shadow-md cursor-pointer flex flex-col gap-sm transition-all group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-md">
                          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-page-title text-on-surface-variant font-bold">
                            AK
                          </div>
                          <div>
                            <div className="flex items-center gap-sm">
                              <h3 className="font-section-heading text-section-heading text-on-surface group-hover:text-primary transition-colors">Amit Kumar</h3>
                              <span className="text-metadata-mono text-on-surface-variant">34M</span>
                              <span className="text-metadata-mono bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant border border-outline-variant/30">#35</span>
                            </div>
                            <p className="text-body-compact text-on-surface-variant mt-0.5">Arrival: 10:10 AM • Wait: 32m</p>
                          </div>
                        </div>
                        <div className="bg-surface-container-high border border-outline-variant/50 text-on-surface-variant px-sm py-xs rounded-full flex items-center gap-xs text-metadata-mono">
                          <span className="material-symbols-outlined text-[14px]">pending</span>
                          Pending Vitals
                        </div>
                      </div>
                      <div className="ml-[56px]">
                        <p className="text-body-primary text-on-surface"><span className="font-semibold">CC:</span> Ankle sprain, right side</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Right Column: Detail View (Fixed 380px) */}
              <div className="w-[380px] bg-surface-container-lowest h-full overflow-y-auto flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.03)] z-20">
                <div className="p-lg pb-md border-b border-outline-variant/20 bg-surface-container-lowest sticky top-0 z-10">
                  <div className="flex justify-between items-start mb-md">
                    <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center font-display-lg text-on-primary-container shadow-sm border border-primary/10 font-bold text-[24px]">
                      {selectedPatient.initials}
                    </div>
                    <button className="text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <h2 className="font-page-title text-[28px] leading-tight text-on-surface mb-xs">{selectedPatient.name}</h2>
                  <div className="flex items-center gap-sm text-body-compact text-on-surface-variant">
                    <span>{selectedPatient.age} YRS</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant" />
                    <span>{selectedPatient.gender}</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant" />
                    <span className="font-metadata-mono">MRN: {selectedPatient.mrn}</span>
                  </div>
                </div>

                <div className="p-lg flex flex-col gap-lg flex-1">
                  <div className="flex flex-col gap-sm">
                    <h3 className="text-metadata-mono text-on-surface-variant uppercase tracking-wider font-bold">Chief Complaint</h3>
                    <div className="bg-surface p-md rounded-xl border border-outline-variant/20 shadow-sm">
                      <p className="text-body-primary text-on-surface font-medium leading-relaxed">{selectedPatient.cc}</p>
                      <p className="text-body-compact text-on-surface-variant mt-sm">{selectedPatient.details}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-sm">
                    <h3 className="text-metadata-mono text-on-surface-variant uppercase tracking-wider flex items-center justify-between font-bold">
                      Clinical Facts
                      <span className="material-symbols-outlined text-[16px] cursor-help">info</span>
                    </h3>
                    <div className="flex flex-col border border-outline-variant/20 rounded-xl overflow-hidden bg-surface shadow-sm">
                      <div className="flex items-center justify-between p-sm border-b border-outline-variant/20 bg-surface-container-lowest">
                        <div className="flex items-center gap-sm">
                          <span className="material-symbols-outlined text-outline text-[18px]">medical_information</span>
                          <span className="text-body-compact text-on-surface">Condition</span>
                        </div>
                        <div className="text-right">
                          <div className="font-metadata-mono text-on-surface font-semibold">{selectedPatient.condition}</div>
                          <div className="text-[10px] text-on-surface-variant uppercase bg-surface-container px-1 py-0.5 rounded mt-0.5 inline-block">Verified</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-sm border-b border-outline-variant/20 bg-surface-container-lowest">
                        <div className="flex items-center gap-sm">
                          <span className="material-symbols-outlined text-outline text-[18px]">favorite</span>
                          <span className="text-body-compact text-on-surface">Heart Rate</span>
                        </div>
                        <div className="text-right flex items-center gap-xs">
                          <span className="font-metadata-mono text-on-surface">{selectedPatient.hr}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-sm bg-surface-container-lowest">
                        <div className="flex items-center gap-sm">
                          <span className="material-symbols-outlined text-outline text-[18px]">thermostat</span>
                          <span className="text-body-compact text-on-surface">Temp</span>
                        </div>
                        <div className="text-right">
                          <span className="font-metadata-mono text-on-surface">{selectedPatient.temp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-lg border-t border-outline-variant/20 bg-surface-container-lowest sticky bottom-0">
                  <div className="flex flex-col gap-sm">
                    <button
                      onClick={() => router.push(`/nursing/patients/${selectedPatient.id}`)}
                      className="w-full py-sm bg-primary text-on-primary rounded-lg font-section-heading text-body-compact hover:bg-primary-fixed-variant transition-colors shadow-sm flex justify-center items-center gap-xs cursor-pointer"
                    >
                      <span>Mark Ready for Physician</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                    <button
                      onClick={() => router.push(`/nursing/patients/${selectedPatient.id}`)}
                      className="w-full py-sm bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-lg font-section-heading text-body-compact transition-colors border border-outline-variant/30 cursor-pointer"
                    >
                      View Full Case
                    </button>
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
