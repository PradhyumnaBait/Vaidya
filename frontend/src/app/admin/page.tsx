'use client'

import { useState, useMemo } from 'react'
import {
  Building2,
  ScrollText,
  Users,
  FileText,
  Clock,
  RefreshCw,
  Search,
  Server,
  Zap,
} from 'lucide-react'
import {
  DEMO_ADMIN_METRICS,
  DEMO_INTEGRATIONS,
  DEMO_AUDIT_EVENTS,
} from '@/constants/demo-data'
import { formatTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

type AuditFilter = 'ALL' | 'CLINICAL' | 'TRIAGE' | 'INTEGRATION' | 'AUTH'

export default function AdminOverviewPage() {
  const [auditFilter, setAuditFilter] = useState<AuditFilter>('ALL')
  const [auditSearch, setAuditSearch] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 400)
  }

  const filteredAuditEvents = useMemo(() => {
    return DEMO_AUDIT_EVENTS.filter((evt) => {
      const matchesCategory = auditFilter === 'ALL' || evt.eventType === auditFilter
      const matchesSearch =
        auditSearch === '' ||
        evt.description.toLowerCase().includes(auditSearch.toLowerCase()) ||
        (evt.actor && evt.actor.toLowerCase().includes(auditSearch.toLowerCase())) ||
        (evt.patientName && evt.patientName.toLowerCase().includes(auditSearch.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [auditFilter, auditSearch])

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF8FF] overflow-y-auto">
      {/* ─── Top Control Bar ────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#E1E2ED] px-6 py-5 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FAF8FF] text-[#006A61] text-[11px] font-bold uppercase tracking-wider border border-[#86F2E4]">
                <Building2 size={13} className="text-[#006A61]" />
                Hospital Operations &amp; System Health
              </span>
            </div>
            <h1 className="text-[26px] font-bold text-[#18181B] tracking-tight">
              Hospital Operations Overview
            </h1>
            <p className="text-[13px] text-[#71717A]">
              Infrastructure health, OPD intake metrics, and tamper-evident audit logs.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className={cn(
              'p-2.5 rounded-xl border border-[#E1E2ED] bg-white text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-all shadow-xs active:scale-95 self-start lg:self-auto',
              isRefreshing && 'animate-spin'
            )}
            title="Refresh System Metrics"
          >
            <RefreshCw size={17} />
          </button>
        </div>
      </div>

      {/* ─── Main Admin Workspace ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto p-6 md:p-8 w-full flex-1 flex flex-col gap-6">
        {/* KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Encounters */}
          <div className="bg-white p-5 rounded-3xl border border-[#E1E2ED] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#71717A] mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total OPD Intake</span>
              <div className="w-8 h-8 rounded-xl bg-[#004AC6]/10 text-[#004AC6] flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <p className="text-[28px] font-extrabold text-[#18181B] leading-none">
              {DEMO_ADMIN_METRICS.encountersToday}
            </p>
            <p className="text-[12px] text-[#166534] font-medium pt-1">
              {DEMO_ADMIN_METRICS.encountersCompleted} completed • {DEMO_ADMIN_METRICS.encountersInProgress} in queue
            </p>
          </div>

          {/* Average Intake Duration */}
          <div className="bg-white p-5 rounded-3xl border border-[#E1E2ED] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#71717A] mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">Avg. Intake Duration</span>
              <div className="w-8 h-8 rounded-xl bg-[#006A61]/10 text-[#006A61] flex items-center justify-center">
                <Clock size={16} />
              </div>
            </div>
            <p className="text-[28px] font-extrabold text-[#18181B] leading-none">
              {Math.floor(DEMO_ADMIN_METRICS.avgIntakeDurationSec / 60)}m {DEMO_ADMIN_METRICS.avgIntakeDurationSec % 60}s
            </p>
            <p className="text-[12px] text-[#71717A] font-medium pt-1">
              Multilingual touch &amp; speech speed
            </p>
          </div>

          {/* Documents Processed */}
          <div className="bg-white p-5 rounded-3xl border border-[#E1E2ED] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#71717A] mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">Records Processed</span>
              <div className="w-8 h-8 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center">
                <FileText size={16} />
              </div>
            </div>
            <p className="text-[28px] font-extrabold text-[#18181B] leading-none">
              {DEMO_ADMIN_METRICS.documentsProcessed}
            </p>
            <p className="text-[12px] text-[#166534] font-medium pt-1">
              {Math.round(DEMO_ADMIN_METRICS.avgOcrConfidence * 100)}% Avg OCR accuracy
            </p>
          </div>

          {/* AYUSH Protocols */}
          <div className="bg-white p-5 rounded-3xl border border-[#E1E2ED] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#71717A] mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">AYUSH Assessments</span>
              <div className="w-8 h-8 rounded-xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                <Zap size={16} />
              </div>
            </div>
            <p className="text-[28px] font-extrabold text-[#18181B] leading-none">
              {DEMO_ADMIN_METRICS.ayushSessions}
            </p>
            <p className="text-[12px] text-[#71717A] font-medium pt-1">
              Ahara-Vihara lifestyle profiles
            </p>
          </div>
        </div>

        {/* Integration Health Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E1E2ED] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server size={18} className="text-[#004AC6]" />
              <h2 className="text-[17px] font-bold text-[#18181B]">
                External Integration &amp; API Health
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#71717A]">
              7 endpoints active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {DEMO_INTEGRATIONS.map((integration) => {
              const isOk = integration.status === 'OPERATIONAL'
              return (
                <div
                  key={integration.name}
                  className="p-4 rounded-2xl border border-[#E1E2ED] bg-[#FAF8FF] flex flex-col justify-between gap-2 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-[14px] font-bold text-[#18181B]">
                        {integration.name}
                      </h3>
                      <p className="text-[12px] text-[#71717A]">
                        {integration.description}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 border',
                        isOk
                          ? 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]'
                          : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                      )}
                    >
                      {integration.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#71717A] pt-2 border-t border-[#E1E2ED]">
                    <span>Latency: <strong className="font-mono text-[#18181B]">{integration.latencyMs}ms</strong></span>
                    <span>Uptime: <strong className="font-mono text-[#18181B]">{integration.uptimePercent}%</strong></span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tamper-Evident Audit Log */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E1E2ED] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ScrollText size={18} className="text-[#004AC6]" />
              <div>
                <h2 className="text-[17px] font-bold text-[#18181B]">
                  System Audit Log
                </h2>
                <p className="text-[12px] text-[#71717A]">
                  Append-only immutable record of clinical and authentication events.
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#FAF8FF] p-1 rounded-xl border border-[#E1E2ED] self-start md:self-auto">
              {(['ALL', 'CLINICAL', 'TRIAGE', 'INTEGRATION', 'AUTH'] as AuditFilter[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setAuditFilter(tab)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-[11px] font-bold transition-all',
                    auditFilter === tab
                      ? 'bg-white text-[#004AC6] shadow-xs'
                      : 'text-[#71717A] hover:text-[#18181B]'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
            <input
              type="text"
              placeholder="Search audit trail by actor, patient, or event description..."
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-[13px] bg-[#FAF8FF] border border-[#E1E2ED] rounded-xl text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#004AC6] focus:bg-white transition-all"
            />
          </div>

          {/* Audit Events Table */}
          <div className="divide-y divide-[#F4F4F5] border border-[#E1E2ED] rounded-2xl overflow-hidden">
            {filteredAuditEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-white hover:bg-[#FAF8FF] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px]"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5 border',
                      event.eventType === 'CLINICAL' && 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]',
                      event.eventType === 'TRIAGE' && 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
                      event.eventType === 'INTEGRATION' && 'bg-[#FAF8FF] text-[#006A61] border-[#86F2E4]',
                      event.eventType === 'AUTH' && 'bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]'
                    )}
                  >
                    {event.eventType}
                  </span>

                  <div>
                    <p className="font-semibold text-[#18181B]">
                      {event.description}
                    </p>
                    <p className="text-[11px] text-[#71717A] mt-0.5">
                      Actor: <span className="font-medium text-[#434655]">{event.actor}</span>
                      {event.patientName && ` • Patient: ${event.patientName}`}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="font-mono text-[11px] text-[#71717A]">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
