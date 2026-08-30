'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle2, RotateCcw, Stethoscope } from 'lucide-react'
import { ClinicalConflict } from '@/types'

interface ConflictCardProps {
  conflict: ClinicalConflict
  onResolve: (resolution: 'RESOLVED_A' | 'RESOLVED_B' | 'RESOLVED_UNCERTAIN', note?: string) => Promise<void>
}

export function ConflictCard({ conflict, onResolve }: ConflictCardProps) {
  const [note] = useState('')
  const [resolving, setResolving] = useState(false)
  const [resolvedDecision, setResolvedDecision] = useState<'RESOLVED_A' | 'RESOLVED_B' | 'RESOLVED_UNCERTAIN' | null>(null)

  const handleResolve = async (resolution: 'RESOLVED_A' | 'RESOLVED_B' | 'RESOLVED_UNCERTAIN') => {
    setResolving(true)
    await onResolve(resolution, note)
    setResolvedDecision(resolution)
    setResolving(false)
  }

  if (resolvedDecision) {
    return (
      <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] shadow-xs">
        <div className="flex items-center gap-3 text-[#166534]">
          <CheckCircle2 size={18} className="text-[#16A34A] shrink-0" />
          <div>
            <p className="text-[14px] font-bold">
              {resolvedDecision === 'RESOLVED_B' && `Confirmed Patient Report: ${conflict.factB.rawValue}`}
              {resolvedDecision === 'RESOLVED_A' && `Confirmed Prescription Record: ${conflict.factA.rawValue}`}
              {resolvedDecision === 'RESOLVED_UNCERTAIN' && 'Marked for Physician Physical Examination'}
            </p>
            {note && <p className="text-[12px] text-[#71717A] mt-0.5">Physician Note: &quot;{note}&quot;</p>}
          </div>
        </div>

        <button
          onClick={() => setResolvedDecision(null)}
          className="text-[12px] font-semibold text-[#166534] hover:underline flex items-center gap-1"
        >
          <RotateCcw size={12} />
          <span>Change Decision</span>
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#F59E0B]/40 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
      {/* Discrepancy Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F4F4F5]">
        <div className="flex items-center gap-2.5 text-[#B45309]">
          <AlertTriangle size={18} className="text-[#D97706]" />
          <h4 className="text-[16px] font-bold text-[#18181B]">
            Clinical Discrepancy • {conflict.fieldLabel}
          </h4>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase text-[#B45309] bg-[#FFFBEB] px-2.5 py-0.5 rounded-full border border-[#FDE68A]">
          Physician Verification Required
        </span>
      </div>

      <p className="text-[13px] text-[#52525B]">
        Conflicting allergy records detected between physical document OCR and multilingual kiosk intake:
      </p>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Patient Report */}
        <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#004AC6]">
            PATIENT REPORTED (Voice Intake)
          </span>
          <p className="text-[17px] font-bold text-[#18181B]">
            {conflict.factB.rawValue}
          </p>
          <p className="text-[11px] text-[#71717A]">
            Source: Kiosk Voice Intake (mr-IN)
          </p>
        </div>

        {/* Prescription Record */}
        <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E1E2ED] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
            RECORD (Prescription Scan)
          </span>
          <p className="text-[17px] font-bold text-[#18181B]">
            {conflict.factA.rawValue}
          </p>
          <p className="text-[11px] text-[#71717A]">
            Source: Prescription_Jan2025.jpg (94% OCR)
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          disabled={resolving}
          onClick={() => handleResolve('RESOLVED_B')}
          className="px-4 py-2 rounded-xl bg-[#004AC6] hover:bg-[#003EA8] text-white text-[12px] font-bold transition-all shadow-xs active:scale-95"
        >
          Confirm Patient Report
        </button>

        <button
          disabled={resolving}
          onClick={() => handleResolve('RESOLVED_A')}
          className="px-4 py-2 rounded-xl bg-white border border-[#E1E2ED] hover:bg-[#FAF8FF] text-[#18181B] text-[12px] font-bold transition-all shadow-xs active:scale-95"
        >
          Confirm Record
        </button>

        <button
          disabled={resolving}
          onClick={() => handleResolve('RESOLVED_UNCERTAIN')}
          className="px-3 py-2 text-[12px] font-semibold text-[#71717A] hover:text-[#18181B] flex items-center gap-1.5"
        >
          <Stethoscope size={13} />
          <span>Mark for Physical Exam</span>
        </button>
      </div>
    </div>
  )
}
