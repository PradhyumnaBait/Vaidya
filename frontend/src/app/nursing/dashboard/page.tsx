'use client'

import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  HeartPulse,
  Thermometer,
  Sparkles,
  RefreshCw,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react'
import { DEMO_TRIAGE_QUEUE, DEMO_RED_FLAG_ENC002 } from '@/constants/demo-data'
import { useUIStore } from '@/store'
import { cn } from '@/lib/utils'

export default function NursingDashboardPage() {
  const { addToast } = useUIStore()
  const [selectedCaseId, setSelectedCaseId] = useState<string>('enc-002')
  const [alertAcknowledged, setAlertAcknowledged] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false)
  const [vitals, setVitals] = useState({
    bp: '128/82',
    pulse: '76',
    spo2: '98%',
    temp: '98.4 °F',
  })

  const handleAcknowledgeAlert = () => {
    setAlertAcknowledged(true)
    addToast({
      type: 'success',
      title: 'Triage Alert Acknowledged',
      body: 'Nurse triage confirmed stable. Case escalated to Physician Queue.',
    })
  }

  const handleSaveVitals = () => {
    setVitalsModalOpen(false)
    addToast({
      type: 'success',
      title: 'Vitals Recorded',
      body: `BP: ${vitals.bp}, Pulse: ${vitals.pulse} bpm, SpO2: ${vitals.spo2} logged for OPD case.`,
    })
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF8FF] overflow-y-auto">
      {/* ─── Top Control Bar ────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#E1E2ED] px-6 py-5 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#F0FDF4] text-[#166534] text-[11px] font-bold uppercase tracking-wider border border-[#BBF7D0]">
                <HeartPulse size={13} className="text-[#16A34A]" />
                Triage &amp; OPD Nursing Operations
              </span>
            </div>
            <h1 className="text-[26px] font-bold text-[#18181B] tracking-tight">
              Nursing &amp; Triage Station
            </h1>
            <p className="text-[13px] text-[#71717A]">
              Monitor live kiosk intakes, urgent triage flags, and assist waiting outpatients.
            </p>
          </div>

          {/* KPI Counters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#FAF8FF] border border-[#E1E2ED] px-4 py-2 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#004AC6]/10 text-[#004AC6] flex items-center justify-center font-bold text-sm">
                <Users size={16} />
              </div>
              <div>
                <p className="text-[11px] text-[#71717A] uppercase font-bold tracking-wider">In Waiting Hall</p>
                <p className="text-[18px] font-bold text-[#18181B] leading-none">14</p>
              </div>
            </div>

            <div className="bg-[#FEF2F2] border border-[#FECACA] px-4 py-2 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center font-bold text-sm">
                <AlertTriangle size={16} />
              </div>
              <div>
                <p className="text-[11px] text-[#991B1B] uppercase font-bold tracking-wider">Active Alerts</p>
                <p className="text-[18px] font-bold text-[#991B1B] leading-none">{alertAcknowledged ? '0' : '1'}</p>
              </div>
            </div>

            <div className="bg-[#F0FDF4] border border-[#BBF7D0] px-4 py-2 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold text-sm">
                <Activity size={16} />
              </div>
              <div>
                <p className="text-[11px] text-[#166534] uppercase font-bold tracking-wider">Kiosk Station</p>
                <p className="text-[18px] font-bold text-[#166534] leading-none">Online</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsRefreshing(true)
                setTimeout(() => setIsRefreshing(false), 500)
              }}
              className={cn(
                'p-2.5 rounded-xl border border-[#E1E2ED] bg-white text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-all shadow-xs active:scale-95',
                isRefreshing && 'animate-spin'
              )}
              title="Refresh Triage Queue"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Main Triage Layout ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto p-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Triage Alert Banner & Waiting Queue */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Urgent Alert Banner */}
          {!alertAcknowledged ? (
            <div className="border border-[#DC2626]/30 border-l-4 border-l-[#DC2626] rounded-2xl bg-[#FEF2F2] p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#991B1B]">
                  <ShieldAlert size={20} className="text-[#DC2626]" />
                  <span className="text-[15px] font-bold">
                    Urgent Clinical Triage Alert • Cardiac Rule Flag
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold bg-[#DC2626] text-white px-2 py-0.5 rounded">
                  PRIORITY 1
                </span>
              </div>

              <div className="bg-white rounded-xl p-4 border border-[#FECACA] space-y-2">
                <div className="flex items-center justify-between text-[12px] text-[#71717A]">
                  <span className="font-bold text-[#18181B]">Patient: Priya Menon (42F • Token A-023)</span>
                  <span>Triggered at Kiosk Station 01</span>
                </div>
                <p className="text-[14px] text-[#991B1B] font-semibold italic">
                  &quot;{DEMO_RED_FLAG_ENC002.triggerText}&quot;
                </p>
                <p className="text-[12px] text-[#71717A]">
                  English Translation: &quot;{DEMO_RED_FLAG_ENC002.triggerTextTranslated}&quot;
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[12px] text-[#991B1B] font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping" />
                  Immediate nursing assessment recommended
                </span>

                <button
                  onClick={handleAcknowledgeAlert}
                  className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[13px] font-bold transition-all shadow-xs active:scale-95"
                >
                  Acknowledge &amp; Triage Stable
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-[#166534]">
                <CheckCircle2 size={18} className="text-[#16A34A]" />
                <span className="text-[14px] font-bold">
                  Cardiac Alert for Priya Menon acknowledged • Case marked stable for OPD Review
                </span>
              </div>
              <button
                onClick={() => setAlertAcknowledged(false)}
                className="text-[12px] text-[#166534] underline font-medium"
              >
                Reset Demo Alert
              </button>
            </div>
          )}

          {/* Operational Triage Queue */}
          <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-[#18181B]">
                  Live OPD Intake Queue
                </h2>
                <p className="text-[12px] text-[#71717A]">
                  Track progress of patients at waiting hall kiosks.
                </p>
              </div>
              <span className="text-[12px] font-bold text-[#004AC6] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE]">
                3 Active Cases
              </span>
            </div>

            <div className="space-y-3">
              {DEMO_TRIAGE_QUEUE.map((triageCase) => {
                const isSelected = selectedCaseId === triageCase.encounterId
                return (
                  <div
                    key={triageCase.encounterId}
                    onClick={() => setSelectedCaseId(triageCase.encounterId)}
                    className={cn(
                      'p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4',
                      isSelected
                        ? 'bg-[#FAF8FF] border-[#004AC6] ring-2 ring-[#004AC6]/10'
                        : 'bg-white border-[#E1E2ED] hover:border-[#C3C6D7]'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#004AC6]/10 text-[#004AC6] flex flex-col items-center justify-center shrink-0">
                        <span className="text-[9px] font-bold uppercase">OPD</span>
                        <span className="text-[15px] font-extrabold font-mono leading-none">
                          {triageCase.tokenNumber === '23' ? 'A-023' : triageCase.tokenNumber === '31' ? 'A-028' : 'A-031'}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[16px] font-bold text-[#18181B]">
                            {triageCase.patient.name}
                          </h3>
                          <span className="text-[12px] text-[#71717A]">
                            ({triageCase.patient.age} yrs • {triageCase.patient.sex})
                          </span>
                        </div>
                        <p className="text-[13px] text-[#434655] font-medium mt-0.5">
                          {triageCase.chiefComplaint}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-[#71717A] mt-1.5">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>Waiting {triageCase.waitMinutes} mins</span>
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-[#004AC6]">
                            Kiosk Station 01
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setVitalsModalOpen(true)
                        }}
                        className="px-3.5 py-2 rounded-xl border border-[#E1E2ED] bg-white hover:bg-[#FAF8FF] text-[12px] font-bold text-[#18181B] transition-all flex items-center gap-1.5"
                      >
                        <Thermometer size={14} className="text-[#004AC6]" />
                        <span>Log Vitals</span>
                      </button>

                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-[11px] font-bold border',
                          triageCase.hasActiveAlert && !alertAcknowledged
                            ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                            : 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]'
                        )}
                      >
                        {triageCase.hasActiveAlert && !alertAcknowledged ? 'Urgent Alert' : 'Intake Ready'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Nursing Station Actions & Vitals Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Vital Entry Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[#18181B] flex items-center gap-2">
                <Activity size={18} className="text-[#16A34A]" />
                <span>Station Vitals Entry</span>
              </h3>
              <span className="text-[11px] font-bold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                Live
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FAF8FF] p-3 rounded-xl border border-[#E1E2ED]">
                <span className="text-[11px] font-bold text-[#71717A] uppercase">Blood Pressure</span>
                <p className="text-[18px] font-extrabold text-[#18181B] font-mono mt-0.5">{vitals.bp}</p>
                <span className="text-[10px] text-[#71717A]">mmHg • Normal</span>
              </div>

              <div className="bg-[#FAF8FF] p-3 rounded-xl border border-[#E1E2ED]">
                <span className="text-[11px] font-bold text-[#71717A] uppercase">Heart Rate</span>
                <p className="text-[18px] font-extrabold text-[#18181B] font-mono mt-0.5">{vitals.pulse}</p>
                <span className="text-[10px] text-[#71717A]">bpm • Regular</span>
              </div>

              <div className="bg-[#FAF8FF] p-3 rounded-xl border border-[#E1E2ED]">
                <span className="text-[11px] font-bold text-[#71717A] uppercase">Oxygen SpO2</span>
                <p className="text-[18px] font-extrabold text-[#16A34A] font-mono mt-0.5">{vitals.spo2}</p>
                <span className="text-[10px] text-[#16A34A]">Optimal</span>
              </div>

              <div className="bg-[#FAF8FF] p-3 rounded-xl border border-[#E1E2ED]">
                <span className="text-[11px] font-bold text-[#71717A] uppercase">Temperature</span>
                <p className="text-[18px] font-extrabold text-[#18181B] font-mono mt-0.5">{vitals.temp}</p>
                <span className="text-[10px] text-[#71717A]">Oral • Afebrile</span>
              </div>
            </div>

            <button
              onClick={() => setVitalsModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-[#004AC6] text-white text-[13px] font-bold hover:bg-[#003EA8] transition-all flex items-center justify-center gap-1.5 active:scale-98"
            >
              <span>Update Patient Vitals</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Kiosk Station Hardware Health */}
          <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-xs space-y-4">
            <h3 className="text-[16px] font-bold text-[#18181B] flex items-center gap-2">
              <Sparkles size={18} className="text-[#004AC6]" />
              <span>Waiting Hall Kiosk Health</span>
            </h3>

            <div className="space-y-2.5 text-[13px]">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8FF] border border-[#E1E2ED]">
                <span className="font-medium text-[#434655]">Station 01 (Main Lobby)</span>
                <span className="text-[11px] font-bold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                  ● Active (5173)
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8FF] border border-[#E1E2ED]">
                <span className="font-medium text-[#434655]">Optical Document Scanner</span>
                <span className="text-[11px] font-bold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                  Ready
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8FF] border border-[#E1E2ED]">
                <span className="font-medium text-[#434655]">Thermal Token Dispenser</span>
                <span className="text-[11px] font-bold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                  Paper OK (88%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Vitals Entry Modal ────────────────────────────────────── */}
      {vitalsModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E1E2ED] shadow-xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-[#E1E2ED] pb-3">
              <h3 className="text-[18px] font-bold text-[#18181B] flex items-center gap-2">
                <Thermometer size={20} className="text-[#004AC6]" />
                <span>Log Clinical Vitals</span>
              </h3>
              <button
                onClick={() => setVitalsModalOpen(false)}
                className="text-[#71717A] hover:text-[#18181B] font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-[13px]">
              <div>
                <label className="font-bold text-[#434655] block mb-1">Blood Pressure (Systolic / Diastolic)</label>
                <input
                  type="text"
                  value={vitals.bp}
                  onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                  className="w-full h-10 px-3 border border-[#E1E2ED] rounded-xl bg-[#FAF8FF] font-mono font-bold text-[14px]"
                />
              </div>

              <div>
                <label className="font-bold text-[#434655] block mb-1">Pulse Rate (BPM)</label>
                <input
                  type="text"
                  value={vitals.pulse}
                  onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                  className="w-full h-10 px-3 border border-[#E1E2ED] rounded-xl bg-[#FAF8FF] font-mono font-bold text-[14px]"
                />
              </div>

              <div>
                <label className="font-bold text-[#434655] block mb-1">Oxygen Saturation (SpO2)</label>
                <input
                  type="text"
                  value={vitals.spo2}
                  onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                  className="w-full h-10 px-3 border border-[#E1E2ED] rounded-xl bg-[#FAF8FF] font-mono font-bold text-[14px]"
                />
              </div>

              <div>
                <label className="font-bold text-[#434655] block mb-1">Body Temperature (°F)</label>
                <input
                  type="text"
                  value={vitals.temp}
                  onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                  className="w-full h-10 px-3 border border-[#E1E2ED] rounded-xl bg-[#FAF8FF] font-mono font-bold text-[14px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E1E2ED]">
              <button
                onClick={() => setVitalsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold text-[#71717A] hover:bg-[#F4F4F5]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVitals}
                className="px-5 py-2 rounded-xl bg-[#004AC6] text-white text-[13px] font-bold hover:bg-[#003EA8] transition-all"
              >
                Save Vitals Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
