'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function NursingHistoryPage() {
  const [activeTab, setActiveTab] = useState('all')

  const historyRows = [
    {
      id: 'h-1',
      status: 'escalated',
      statusIcon: 'priority_high',
      name: 'Priya Menon',
      mrn: '893-4A2',
      action: 'Code Blue initiated. Transferred to ICU Bed 4. Intubation protocol started.',
      attending: 'Dr. S. Sharma',
      time: '10:42 AM',
    },
    {
      id: 'h-2',
      status: 'stable',
      statusIcon: 'check',
      name: 'Dhananjay Patil',
      mrn: '712-9B4',
      action: 'Vitals stabilized post IV fluid administration. Admitted to general ward for observation.',
      attending: 'Nurse K. Devi',
      time: '09:15 AM',
    },
    {
      id: 'h-3',
      status: 'stable',
      statusIcon: 'check',
      name: 'Aarav Patel',
      mrn: '441-2C9',
      action: 'Asthma exacerbation resolved with nebulizer treatment. Discharged with follow-up instructions.',
      attending: 'Dr. A. Rao',
      time: '08:30 AM',
    },
    {
      id: 'h-4',
      status: 'false_alert',
      statusIcon: 'close',
      name: 'Unknown Patient',
      mrn: '---',
      action: 'Sensor malfunction on Bed 12. Alert cleared manually. Maintenance notified.',
      attending: 'Tech M. Singh',
      time: '07:55 AM',
    },
  ]

  const filteredRows = historyRows.filter((row) => {
    if (activeTab === 'all') return true
    if (activeTab === 'escalated') return row.status === 'escalated'
    if (activeTab === 'stable') return row.status === 'stable'
    if (activeTab === 'false_alert') return row.status === 'false_alert'
    return true
  })

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
            className="flex items-center gap-md px-md py-sm rounded-lg transition-all bg-primary-container text-on-primary-container font-semibold shadow-sm"
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
          <div className="flex flex-col w-full h-full p-lg gap-lg font-body-primary bg-background text-on-surface">
            {/* Title & Top Action Bar */}
            <div className="flex flex-row justify-between items-end w-full">
              <div className="flex flex-col gap-xs">
                <h1 className="font-page-title text-page-title text-primary font-bold text-[28px]">Triage History</h1>
                <p className="font-body-compact text-body-compact text-on-surface-variant">Shift overview and resolved alerts for operational audit.</p>
              </div>
              <div className="flex flex-row gap-sm">
                <button
                  onClick={() => alert('CSV Export initiated.')}
                  className="flex flex-row items-center gap-xs px-md py-sm bg-surface-container-low text-primary rounded-full hover:bg-surface-container-high transition-colors border border-outline-variant/30 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span className="font-metadata-mono text-metadata-mono uppercase tracking-wider font-bold">Export CSV</span>
                </button>
                <button
                  onClick={() => alert('Filter drawer opened.')}
                  className="flex flex-row items-center gap-xs px-md py-sm bg-primary text-on-primary rounded-full hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  <span className="font-metadata-mono text-metadata-mono uppercase tracking-wider font-bold">Advanced Filters</span>
                </button>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-4 gap-md w-full">
              <div className="flex flex-col p-md bg-surface-container-lowest rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-outline-variant/20">
                <span className="font-metadata-mono text-metadata-mono text-on-surface-variant uppercase mb-xs font-bold">Total Alerts</span>
                <span className="font-display-lg text-display-lg text-on-surface font-bold text-[32px]">6</span>
              </div>
              <div className="flex flex-col p-md bg-surface-container-lowest rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-outline-variant/20">
                <span className="font-metadata-mono text-metadata-mono text-on-surface-variant uppercase mb-xs font-bold">Escalated</span>
                <span className="font-display-lg text-display-lg text-error font-bold text-[32px]">1</span>
              </div>
              <div className="flex flex-col p-md bg-surface-container-lowest rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-outline-variant/20">
                <span className="font-metadata-mono text-metadata-mono text-on-surface-variant uppercase mb-xs font-bold">Stable</span>
                <span className="font-display-lg text-display-lg text-secondary font-bold text-[32px]">4</span>
              </div>
              <div className="flex flex-col p-md bg-surface-container-lowest rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-outline-variant/20">
                <span className="font-metadata-mono text-metadata-mono text-on-surface-variant uppercase mb-xs font-bold">False Alert</span>
                <span className="font-display-lg text-display-lg text-on-surface-variant font-bold text-[32px]">1</span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-row gap-md border-b-[1px] border-outline-variant/30 w-full">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-md py-sm font-section-heading text-section-heading transition-colors cursor-pointer ${
                  activeTab === 'all' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                All Alerts
              </button>
              <button
                onClick={() => setActiveTab('escalated')}
                className={`px-md py-sm font-section-heading text-section-heading transition-colors cursor-pointer ${
                  activeTab === 'escalated' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Escalated
              </button>
              <button
                onClick={() => setActiveTab('stable')}
                className={`px-md py-sm font-section-heading text-section-heading transition-colors cursor-pointer ${
                  activeTab === 'stable' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Stable
              </button>
              <button
                onClick={() => setActiveTab('false_alert')}
                className={`px-md py-sm font-section-heading text-section-heading transition-colors cursor-pointer ${
                  activeTab === 'false_alert' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                False Alert
              </button>
            </div>

            {/* Table Area */}
            <div className="flex flex-col w-full bg-surface-container-lowest rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant/20">
              <div className="grid grid-cols-[60px_200px_1fr_150px_120px] gap-md px-lg py-sm bg-surface-container-low border-b-[1px] border-outline-variant/20">
                <div className="font-metadata-mono text-metadata-mono text-on-surface-variant font-bold">Status</div>
                <div className="font-metadata-mono text-metadata-mono text-on-surface-variant font-bold">Patient</div>
                <div className="font-metadata-mono text-metadata-mono text-on-surface-variant font-bold">Action Taken</div>
                <div className="font-metadata-mono text-metadata-mono text-on-surface-variant font-bold">Attending</div>
                <div className="font-metadata-mono text-metadata-mono text-on-surface-variant text-right font-bold">Time</div>
              </div>

              <div className="flex flex-col w-full">
                {filteredRows.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[60px_200px_1fr_150px_120px] gap-md px-lg py-md border-b-[1px] border-surface-variant hover:bg-surface-container-low transition-colors items-center group cursor-pointer"
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      row.status === 'escalated' ? 'bg-error-container text-on-error-container' : row.status === 'stable' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-highest text-on-surface-variant'
                    }`}>
                      <span className="material-symbols-outlined text-[18px]">{row.statusIcon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-body-primary text-body-primary font-semibold text-on-surface ${row.status === 'false_alert' ? 'line-through opacity-70' : ''}`}>
                        {row.name}
                      </span>
                      <span className="font-metadata-mono text-metadata-mono text-on-surface-variant">MRN: {row.mrn}</span>
                    </div>
                    <div className={`font-body-compact text-body-compact ${row.status === 'false_alert' ? 'text-on-surface-variant italic' : 'text-on-surface'}`}>
                      {row.action}
                    </div>
                    <div className="font-body-compact text-body-compact text-on-surface-variant">{row.attending}</div>
                    <div className="font-metadata-mono text-metadata-mono text-on-surface-variant text-right group-hover:text-primary transition-colors font-bold">
                      {row.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
