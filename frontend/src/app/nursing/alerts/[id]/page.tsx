'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NursingAlertPage() {
  const router = useRouter()
  const [selectedAction, setSelectedAction] = useState('monitor')
  const [notes, setNotes] = useState('')

  const handleConfirmAssessment = () => {
    router.push('/nursing/alerts/enc-002/confirm')
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
          <div className="flex flex-col w-full">
            {/* Patient Header Context */}
            <div className="w-full bg-surface-container-lowest shadow-sm p-lg flex flex-col sm:flex-row sm:items-center justify-between gap-md rounded-b-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary-container opacity-20 blur-[80px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
              <div className="flex items-center gap-md relative z-10">
                <div className="w-16 h-16 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-page-title text-page-title shadow-md font-bold text-[24px]">
                  PM
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-sm">
                    <h1 className="font-page-title text-page-title text-on-surface">Priya Menon</h1>
                    <span className="font-metadata-mono text-metadata-mono bg-surface-container-high text-on-surface-variant px-sm py-[2px] rounded-full shadow-sm">42F</span>
                    <span className="font-metadata-mono text-metadata-mono bg-primary-container text-on-primary-container px-sm py-[2px] rounded-full shadow-sm font-bold">Token #23</span>
                  </div>
                  <div className="font-metadata-mono text-metadata-mono text-on-surface-variant mt-xs uppercase tracking-wider">
                    MRN: VAID-892-441-A
                  </div>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-sm bg-tertiary-container text-on-tertiary-container px-md py-sm rounded-lg shadow-sm animate-pulse font-bold">
                <span className="material-symbols-outlined">warning</span>
                <span className="font-section-heading text-section-heading">ALERT ACTIVE</span>
              </div>
            </div>

            {/* Main Workspace */}
            <div className="w-full p-lg max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-lg relative z-10">
              {/* Left Column: Alert Details (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-lg">
                {/* Red Flag Banner */}
                <div className="bg-tertiary-container text-on-tertiary-container p-lg rounded-xl shadow-md relative overflow-hidden flex items-start gap-md">
                  <span className="material-symbols-outlined text-[32px] mt-xs">favorite</span>
                  <div className="flex flex-col gap-sm relative z-10 w-full">
                    <div className="flex items-center justify-between">
                      <h2 className="font-page-title text-page-title">Cardiac Concern Detected</h2>
                      <span className="font-metadata-mono text-metadata-mono bg-tertiary text-on-tertiary px-sm py-[2px] rounded shadow-sm font-bold">RULE: CARDIAC_001</span>
                    </div>
                    <p className="font-body-primary text-body-primary opacity-90">
                      System flagged potential acute myocardial infarction based on symptomatic NLP extraction from patient intake audio. High priority escalation recommended.
                    </p>
                  </div>
                </div>

                {/* Verbatim Quote Block */}
                <div className="bg-surface-container-low p-md rounded-xl shadow-sm flex flex-col gap-sm">
                  <div className="flex items-center gap-xs text-on-surface-variant font-metadata-mono text-metadata-mono uppercase tracking-widest font-bold">
                    <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                    Source: Patient Audio Intake
                  </div>
                  <div className="bg-surface p-md rounded-lg shadow-sm flex flex-col gap-md">
                    <p className="font-body-primary text-body-primary text-on-surface text-[18px] italic relative pl-md">
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-surface-variant rounded-full" />
                      &quot;Mujhe seene mein bahut dard hai, aur yeh dard mere baayein haath tak jaa raha hai. Saans lene mein bhi dikkat ho rahi hai...&quot;
                    </p>
                    <div className="bg-surface-container-lowest p-sm rounded shadow-sm">
                      <span className="font-metadata-mono text-metadata-mono text-primary uppercase block mb-xs font-bold">Translated (Confidence: 98%)</span>
                      <p className="font-body-primary text-body-primary text-on-surface">
                        &quot;I have severe pain in my chest, and this pain is radiating to my left arm. I am also having difficulty breathing...&quot;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Extracted Entities & Clinical Fact Rows */}
                <div className="bg-surface-container-low p-lg rounded-xl shadow-sm flex flex-col gap-md">
                  <h3 className="font-section-heading text-section-heading text-on-surface flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary">data_object</span>
                    Extracted Clinical Entities
                  </h3>
                  <div className="flex flex-wrap gap-md mb-md">
                    <div className="inline-flex items-center gap-sm bg-error-container text-on-error-container px-sm py-xs rounded-full shadow-sm font-metadata-mono text-metadata-mono font-bold">
                      <span className="w-2 h-2 rounded-full bg-error" />
                      T1: Chest Pain
                    </div>
                    <div className="inline-flex items-center gap-sm bg-error-container text-on-error-container px-sm py-xs rounded-full shadow-sm font-metadata-mono text-metadata-mono font-bold">
                      <span className="w-2 h-2 rounded-full bg-error" />
                      T1: Left Arm Radiation
                    </div>
                    <div className="inline-flex items-center gap-sm bg-tertiary-container text-on-tertiary-container px-sm py-xs rounded-full shadow-sm font-metadata-mono text-metadata-mono font-bold">
                      <span className="w-2 h-2 rounded-full bg-tertiary" />
                      T2: Dyspnea
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between py-sm shadow-[0_1px_0_0_rgba(195,198,215,0.4)]">
                      <div className="flex items-center gap-md w-1/3">
                        <span className="material-symbols-outlined text-outline">thermostat</span>
                        <span className="font-body-compact text-body-compact text-on-surface-variant">Vitals: Temp</span>
                      </div>
                      <div className="font-metadata-mono text-metadata-mono text-on-surface w-1/3 text-center font-bold">99.2 °F</div>
                      <div className="font-metadata-mono text-metadata-mono text-outline w-1/3 text-right">97.0 - 99.0</div>
                    </div>
                    <div className="flex items-center justify-between py-sm bg-tertiary-container/10 -mx-sm px-sm rounded-sm">
                      <div className="flex items-center gap-md w-1/3">
                        <span className="material-symbols-outlined text-tertiary">monitor_heart</span>
                        <span className="font-body-compact text-body-compact text-on-surface font-bold">Vitals: BP</span>
                      </div>
                      <div className="font-metadata-mono text-metadata-mono text-tertiary font-bold w-1/3 text-center text-[16px]">155/95 mmHg</div>
                      <div className="font-metadata-mono text-metadata-mono text-outline w-1/3 text-right">120/80</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Acknowledgment Section (4 cols) */}
              <div className="lg:col-span-4">
                <div className="bg-surface-container-lowest p-lg rounded-xl shadow-lg sticky top-[88px] flex flex-col gap-lg">
                  <div>
                    <h3 className="font-section-heading text-section-heading text-on-surface mb-xs">Triage Assessment</h3>
                    <p className="font-body-compact text-body-compact text-on-surface-variant">Review the alert and determine the immediate care pathway for Token #23.</p>
                  </div>
                  <div className="flex flex-col gap-md" id="action-cards">
                    {/* Radio Card 1 */}
                    <label
                      onClick={() => setSelectedAction('escalate')}
                      className={`relative flex items-start gap-md p-md rounded-xl transition-colors cursor-pointer group shadow-sm overflow-hidden ${
                        selectedAction === 'escalate' ? 'bg-surface-variant' : 'bg-surface-container hover:bg-surface-container-high'
                      }`}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-error ${selectedAction === 'escalate' ? 'opacity-100' : 'opacity-0'}`} />
                      <input
                        className="mt-xs accent-error w-4 h-4 cursor-pointer"
                        name="triage_action"
                        type="radio"
                        value="escalate"
                        checked={selectedAction === 'escalate'}
                        onChange={() => setSelectedAction('escalate')}
                      />
                      <div className="flex flex-col">
                        <span className="font-section-heading text-section-heading text-on-surface font-bold">Immediate Escalation</span>
                        <span className="font-body-compact text-body-compact text-on-surface-variant">Route to Emergency Room / Resus. Bypass standard queue.</span>
                      </div>
                    </label>

                    {/* Radio Card 2 */}
                    <label
                      onClick={() => setSelectedAction('monitor')}
                      className={`relative flex items-start gap-md p-md rounded-xl transition-colors cursor-pointer group shadow-sm overflow-hidden ${
                        selectedAction === 'monitor' ? 'bg-surface-variant' : 'bg-surface-container hover:bg-surface-container-high'
                      }`}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-tertiary ${selectedAction === 'monitor' ? 'opacity-100' : 'opacity-0'}`} />
                      <input
                        className="mt-xs accent-tertiary w-4 h-4 cursor-pointer"
                        name="triage_action"
                        type="radio"
                        value="monitor"
                        checked={selectedAction === 'monitor'}
                        onChange={() => setSelectedAction('monitor')}
                      />
                      <div className="flex flex-col">
                        <span className="font-section-heading text-section-heading text-on-surface font-bold">Stable Monitoring</span>
                        <span className="font-body-compact text-body-compact text-on-surface-variant">Admit to urgent care bed. Requires continuous ECG.</span>
                      </div>
                    </label>

                    {/* Radio Card 3 */}
                    <label
                      onClick={() => setSelectedAction('opd')}
                      className={`relative flex items-start gap-md p-md rounded-xl transition-colors cursor-pointer group shadow-sm overflow-hidden ${
                        selectedAction === 'opd' ? 'bg-surface-variant' : 'bg-surface-container hover:bg-surface-container-high'
                      }`}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-primary ${selectedAction === 'opd' ? 'opacity-100' : 'opacity-0'}`} />
                      <input
                        className="mt-xs accent-primary w-4 h-4 cursor-pointer"
                        name="triage_action"
                        type="radio"
                        value="opd"
                        checked={selectedAction === 'opd'}
                        onChange={() => setSelectedAction('opd')}
                      />
                      <div className="flex flex-col">
                        <span className="font-section-heading text-section-heading text-on-surface font-bold">OPD Appropriate</span>
                        <span className="font-body-compact text-body-compact text-on-surface-variant">Standard cardiology queue. Symptoms deemed non-acute.</span>
                      </div>
                    </label>
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="font-metadata-mono text-metadata-mono text-on-surface-variant uppercase font-bold">Clinical Notes (Optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-surface-container-low rounded-lg p-md font-body-compact text-body-compact text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container shadow-sm resize-none transition-colors border border-outline-variant/30"
                      placeholder="Add observations or justification..."
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={handleConfirmAssessment}
                    className="w-full bg-primary text-on-primary font-section-heading text-section-heading py-md rounded-lg shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-sm mt-sm cursor-pointer font-bold"
                  >
                    <span className="material-symbols-outlined">check_circle</span>
                    <span>Confirm Assessment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
