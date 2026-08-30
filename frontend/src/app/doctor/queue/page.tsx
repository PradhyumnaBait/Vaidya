'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Users,
  Clock,
  AlertTriangle,
  FileText,
  ChevronRight,
  RefreshCw,
  BadgeCheck,
  Building2,
  X,
  Stethoscope,
} from 'lucide-react'
import { DEMO_ENCOUNTERS, DEMO_PATIENTS } from '@/constants/demo-data'
import { cn } from '@/lib/utils'

type StatusFilter = 'ALL' | 'READY_FOR_REVIEW' | 'UNDER_PHYSICIAN_REVIEW' | 'PROCESSING_DOCUMENTS' | 'INTERVIEWING'
type PriorityFilter = 'ALL' | 'URGENT' | 'NORMAL'

const PATIENT_METRICS: Record<string, { complaint: string; priority: 'URGENT' | 'NORMAL' | 'HIGH'; docs: number; waitMin: number; language: string }> = {
  'enc-001': {
    complaint: 'Epigastric pain, 3 months duration • Burning sensation',
    priority: 'NORMAL',
    docs: 3,
    waitMin: 14,
    language: 'मराठी',
  },
  'enc-002': {
    complaint: 'Acute chest discomfort, breathlessness radiating to left arm',
    priority: 'URGENT',
    docs: 1,
    waitMin: 4,
    language: 'English',
  },
  'enc-003': {
    complaint: 'Bilateral knee pain, generalized weakness, joint stiffness',
    priority: 'NORMAL',
    docs: 2,
    waitMin: 32,
    language: 'हिन्दी',
  },
  'enc-004': {
    complaint: 'Chronic indigestion, acid reflux, Ahara dietary irregularity',
    priority: 'NORMAL',
    docs: 1,
    waitMin: 22,
    language: 'हिन्दी',
  },
  'enc-005': {
    complaint: 'Recurring migraine, visual aura, disturbed sleep pattern',
    priority: 'NORMAL',
    docs: 0,
    waitMin: 9,
    language: 'Urdu',
  },
}

const STATE_BADGES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  READY_FOR_REVIEW: {
    label: 'Ready for Review',
    bg: 'bg-[#F0FDF4]',
    text: 'text-[#166534]',
    border: 'border-[#BBF7D0]',
  },
  UNDER_PHYSICIAN_REVIEW: {
    label: 'Under Review',
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1E40AF]',
    border: 'border-[#BFDBFE]',
  },
  PROCESSING_DOCUMENTS: {
    label: 'OCR Processing',
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
  },
  INTERVIEWING: {
    label: 'Intake in Progress',
    bg: 'bg-[#FAF8FF]',
    text: 'text-[#6B21A8]',
    border: 'border-[#E9D5FF]',
  },
}

export default function DoctorQueuePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('ALL')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedEncounterId, setSelectedEncounterId] = useState<string>('enc-001')

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const filteredEncounters = useMemo(() => {
    return DEMO_ENCOUNTERS.filter((enc) => {
      const patient = enc.patient || DEMO_PATIENTS.find((p) => p.id === enc.patientId)
      const meta = PATIENT_METRICS[enc.id] || { complaint: '', priority: 'NORMAL' }

      // Search matching name, token, or ABHA
      const matchesSearch =
        searchQuery === '' ||
        patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enc.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient?.abhaNumber?.includes(searchQuery) ||
        meta.complaint.toLowerCase().includes(searchQuery.toLowerCase())

      // Status matching
      const matchesStatus = statusFilter === 'ALL' || enc.state === statusFilter

      // Priority matching
      const matchesPriority =
        priorityFilter === 'ALL' ||
        (priorityFilter === 'URGENT' && meta.priority === 'URGENT') ||
        (priorityFilter === 'NORMAL' && meta.priority !== 'URGENT')

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [searchQuery, statusFilter, priorityFilter])

  const counts = useMemo(() => {
    return {
      total: DEMO_ENCOUNTERS.length,
      ready: DEMO_ENCOUNTERS.filter((e) => e.state === 'READY_FOR_REVIEW').length,
      urgent: Object.values(PATIENT_METRICS).filter((m) => m.priority === 'URGENT').length,
      avgWait: '16m',
    }
  }, [])

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF8FF] overflow-y-auto">
      {/* ─── Top Control Bar ────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#E1E2ED] px-6 py-5 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#1E40AF] text-[11px] font-bold uppercase tracking-wider border border-[#BFDBFE]">
                <Stethoscope size={13} className="text-[#2563EB]" />
                All India Institute of Ayurveda • OPD Console
              </span>
            </div>
            <h1 className="text-[26px] font-bold text-[#18181B] tracking-tight">
              Patient Queue
            </h1>
            <p className="text-[13px] text-[#71717A]">
              Real-time intake stream prepared by VAIDYA Kiosk for physician review.
            </p>
          </div>

          {/* Quick Metrics Chips */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#FAF8FF] border border-[#E1E2ED] px-4 py-2 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#004AC6]/10 text-[#004AC6] flex items-center justify-center font-bold text-sm">
                <Users size={16} />
              </div>
              <div>
                <p className="text-[11px] text-[#71717A] uppercase font-bold tracking-wider">Queue Total</p>
                <p className="text-[18px] font-bold text-[#18181B] leading-none">{counts.total}</p>
              </div>
            </div>

            <div className="bg-[#F0FDF4] border border-[#BBF7D0] px-4 py-2 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold text-sm">
                <BadgeCheck size={16} />
              </div>
              <div>
                <p className="text-[11px] text-[#166534] uppercase font-bold tracking-wider">Ready for Review</p>
                <p className="text-[18px] font-bold text-[#166534] leading-none">{counts.ready}</p>
              </div>
            </div>

            <div className="bg-[#FEF2F2] border border-[#FECACA] px-4 py-2 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center font-bold text-sm">
                <AlertTriangle size={16} />
              </div>
              <div>
                <p className="text-[11px] text-[#991B1B] uppercase font-bold tracking-wider">Urgent Triage</p>
                <p className="text-[18px] font-bold text-[#991B1B] leading-none">{counts.urgent}</p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              className={cn(
                'p-2.5 rounded-xl border border-[#E1E2ED] bg-white text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-all shadow-xs active:scale-95',
                isRefreshing && 'animate-spin'
              )}
              title="Refresh Queue"
              aria-label="Refresh Queue"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Main Queue Workspace ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto p-6 w-full flex-1 flex flex-col gap-6">
        {/* Search & Filter Ribbon */}
        <div className="bg-white rounded-2xl p-4 border border-[#E1E2ED] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
            <input
              type="text"
              placeholder="Search by patient name, Token, ABHA ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-8 text-[13px] bg-[#FAF8FF] border border-[#E1E2ED] rounded-xl text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#004AC6] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#18181B]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
            <div className="flex items-center gap-1 bg-[#FAF8FF] p-1 rounded-xl border border-[#E1E2ED]">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all',
                  statusFilter === 'ALL'
                    ? 'bg-white text-[#004AC6] shadow-xs font-bold'
                    : 'text-[#71717A] hover:text-[#18181B]'
                )}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('READY_FOR_REVIEW')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all',
                  statusFilter === 'READY_FOR_REVIEW'
                    ? 'bg-white text-[#16A34A] shadow-xs font-bold'
                    : 'text-[#71717A] hover:text-[#18181B]'
                )}
              >
                Ready
              </button>
              <button
                onClick={() => setStatusFilter('UNDER_PHYSICIAN_REVIEW')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all',
                  statusFilter === 'UNDER_PHYSICIAN_REVIEW'
                    ? 'bg-white text-[#2563EB] shadow-xs font-bold'
                    : 'text-[#71717A] hover:text-[#18181B]'
                )}
              >
                In Review
              </button>
            </div>

            <button
              onClick={() => setPriorityFilter(priorityFilter === 'URGENT' ? 'ALL' : 'URGENT')}
              className={cn(
                'px-3 py-2 rounded-xl text-[12px] font-bold border transition-all flex items-center gap-1.5',
                priorityFilter === 'URGENT'
                  ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                  : 'bg-white text-[#71717A] border-[#E1E2ED] hover:text-[#18181B]'
              )}
            >
              <AlertTriangle size={13} />
              <span>Urgent Only</span>
            </button>
          </div>
        </div>

        {/* Patient Queue Table / Cards */}
        <div className="space-y-3">
          {filteredEncounters.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E1E2ED] p-12 text-center">
              <Users size={32} className="mx-auto text-[#A1A1AA] mb-3" />
              <h3 className="text-[16px] font-bold text-[#18181B]">No patients found</h3>
              <p className="text-[13px] text-[#71717A] mt-1">
                No cases match the active search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('ALL')
                  setPriorityFilter('ALL')
                }}
                className="mt-4 px-4 py-2 text-[13px] font-semibold text-[#004AC6] bg-[#EFF6FF] rounded-xl hover:bg-[#DBEAFE] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredEncounters.map((enc) => {
              const patient = enc.patient || DEMO_PATIENTS.find((p) => p.id === enc.patientId)
              const meta = PATIENT_METRICS[enc.id] || {
                complaint: 'Clinical intake pending',
                priority: 'NORMAL',
                docs: 0,
                waitMin: 10,
                language: 'English',
              }
              const badge = STATE_BADGES[enc.state] || STATE_BADGES.READY_FOR_REVIEW
              const isSelected = selectedEncounterId === enc.id

              return (
                <div
                  key={enc.id}
                  onClick={() => setSelectedEncounterId(enc.id)}
                  className={cn(
                    'bg-white rounded-2xl p-5 border transition-all duration-150 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:shadow-md active:scale-[0.995]',
                    isSelected
                      ? 'border-[#004AC6] ring-2 ring-[#004AC6]/10 shadow-sm'
                      : 'border-[#E1E2ED] hover:border-[#C3C6D7]'
                  )}
                >
                  {/* Left Column: Token + Patient Identity */}
                  <div className="flex items-start gap-4 min-w-[280px]">
                    {/* Big Token Badge */}
                    <div className="w-14 h-14 rounded-2xl bg-[#004AC6]/10 border border-[#004AC6]/20 text-[#004AC6] flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#004AC6]">OPD</span>
                      <span className="text-[17px] font-extrabold font-mono leading-none">{enc.tokenNumber}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[17px] font-bold text-[#18181B]">
                          {patient?.name}
                        </h3>
                        {meta.priority === 'URGENT' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] text-[10px] font-bold uppercase tracking-wider animate-pulse">
                            <AlertTriangle size={10} />
                            Urgent
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#71717A]">
                        <span>{patient?.age} yrs • {patient?.sex === 'M' || patient?.sex === 'male' ? 'Male' : 'Female'}</span>
                        <span>•</span>
                        <span className="bg-[#FAF8FF] px-2 py-0.5 rounded border border-[#E1E2ED] font-medium text-[#434655]">
                          {meta.language}
                        </span>
                        {patient?.abhaNumber && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-[#004AC6]">
                              ABHA: {patient.abhaNumber}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Chief Complaint & Documents */}
                  <div className="flex-1 lg:px-4 space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                      Chief Complaint &amp; Intake
                    </p>
                    <p className="text-[14px] text-[#18181B] font-medium leading-snug line-clamp-2">
                      {meta.complaint}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[12px] text-[#71717A]">
                      <span className="flex items-center gap-1">
                        <FileText size={13} className="text-[#004AC6]" />
                        <span>{meta.docs} {meta.docs === 1 ? 'doc' : 'docs'} attached</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#006A61] font-medium">
                        <Building2 size={13} />
                        <span>{enc.department}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Status + Action */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#F4F4F5]">
                    <div className="text-left lg:text-right space-y-1">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border',
                          badge.bg,
                          badge.text,
                          badge.border
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {badge.label}
                      </span>
                      <div className="flex items-center lg:justify-end gap-1 text-[11px] text-[#71717A]">
                        <Clock size={11} />
                        <span>Waiting {meta.waitMin}m</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/doctor/encounter/${enc.id}`)
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#004AC6] text-white text-[13px] font-bold hover:bg-[#003EA8] transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <span>Review Case</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
