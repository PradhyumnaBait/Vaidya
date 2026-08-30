'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Heart,
  FileText,
  Pill,
  LogOut,
  ChevronRight,
  Eye,
} from 'lucide-react'
import VaidyaWordmark from '@/components/VaidyaWordmark'
import {
  DEMO_PATIENTS,
  DEMO_DOCUMENTS_ENC001,
  DEMO_TIMELINE_ENC001,
} from '@/constants/demo-data'
import { formatIndianDate } from '@/lib/utils'
import { useAuthStore } from '@/store'
import type { MedicalDocument } from '@/types'

export default function PatientDashboardPage() {
  const router = useRouter()
  const { logout } = useAuthStore()
  const patient = DEMO_PATIENTS[0] // Dhananjay Patil
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(null)
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DOCUMENTS' | 'PRESCRIPTIONS' | 'TIMELINE'>('OVERVIEW')

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#FAF8FF] flex flex-col text-[#191B23] antialiased selection:bg-[#2563EB] selection:text-white">
      {/* ─── Top Patient Navigation Bar ────────────────────────────── */}
      <header className="bg-white border-b border-[#E1E2ED] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <VaidyaWordmark size="sm" showDescriptor={false} />
            </Link>
            <div className="h-4 w-px bg-[#E1E2ED] hidden sm:block" />
            <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider text-[#006A61] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
              Patient Portal
            </span>
          </div>

          {/* User Profile + Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#006A61]/10 text-[#006A61] flex items-center justify-center font-bold text-xs">
                DP
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-[13px] font-bold text-[#18181B]">{patient.name}</p>
                <p className="text-[11px] font-mono text-[#71717A]">ABHA: {patient.abhaNumber}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-[#71717A] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
              title="Log out of Patient Portal"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content Container ────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-5 md:px-8 py-8 w-full flex-1 flex flex-col gap-8">
        {/* Patient Greeting & Identity Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E2ED] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#006A61] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm shadow-teal-500/20">
              <Heart size={30} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight">
                  Good morning, Dhananjay
                </h1>
                <span className="bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                  ● ABHA Linked
                </span>
              </div>
              <p className="text-[14px] text-[#52525B]">
                Your health information is organized here.
              </p>
              <p className="text-[12px] font-mono text-[#004AC6] pt-0.5">
                ABHA: {patient.abhaNumber} • 67 years • Male
              </p>
            </div>
          </div>

          {/* Quick Overview Pill */}
          <div className="flex items-center gap-3 self-start md:self-auto bg-[#FAF8FF] p-3 rounded-2xl border border-[#E1E2ED]">
            <div className="text-center px-3 border-r border-[#E1E2ED]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Today&apos;s Token</p>
              <p className="text-[18px] font-extrabold text-[#004AC6] font-mono">A-028</p>
            </div>
            <div className="text-center px-3 border-r border-[#E1E2ED]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Medicines</p>
              <p className="text-[18px] font-extrabold text-[#18181B] font-mono">2</p>
            </div>
            <div className="text-center px-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Documents</p>
              <p className="text-[18px] font-extrabold text-[#18181B] font-mono">3</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E1E2ED] pb-3 overflow-x-auto">
          {[
            { id: 'OVERVIEW', label: 'Today’s Visit' },
            { id: 'PRESCRIPTIONS', label: 'Prescriptions (2)' },
            { id: 'DOCUMENTS', label: 'Medical Documents (3)' },
            { id: 'TIMELINE', label: 'Health Journey' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#004AC6] text-white shadow-xs'
                  : 'bg-white text-[#71717A] border border-[#E1E2ED] hover:text-[#18181B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Today's Visit */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Live OPD Visit Status Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E1E2ED] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E1E2ED]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#004AC6]/10 text-[#004AC6] flex flex-col items-center justify-center font-mono">
                    <span className="text-[9px] font-bold uppercase">OPD</span>
                    <span className="text-[16px] font-extrabold leading-none">A-028</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#004AC6] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                      Active OPD Consultation
                    </span>
                    <h2 className="text-[18px] font-bold text-[#18181B] mt-1">
                      Internal Medicine Consultation
                    </h2>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                  Prepared by VAIDYA • Under Physician Review
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px]">
                <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
                    Chief Complaint Recorded
                  </span>
                  <p className="text-[14px] font-bold text-[#18181B] mt-1">
                    Epigastric pain, 3 months duration
                  </p>
                  <p className="text-[11px] text-[#71717A] mt-1">
                    Recorded via Kiosk Voice Intake (Marathi)
                  </p>
                </div>

                <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
                    Hospital Department
                  </span>
                  <p className="text-[14px] font-bold text-[#18181B] mt-1">
                    All India Institute of Ayurveda
                  </p>
                  <p className="text-[11px] text-[#71717A] mt-1">
                    OPD Consultation Room 104
                  </p>
                </div>

                <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
                    Attached Records
                  </span>
                  <p className="text-[14px] font-bold text-[#18181B] mt-1">
                    3 physical files scanned
                  </p>
                  <p className="text-[11px] text-[#16A34A] font-semibold mt-1">
                    ✓ Optical OCR verified
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Overviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prescriptions Preview */}
              <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-bold text-[#18181B] flex items-center gap-2">
                    <Pill size={18} className="text-[#004AC6]" />
                    <span>Active Prescriptions</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('PRESCRIPTIONS')}
                    className="text-[12px] font-semibold text-[#004AC6] hover:underline"
                  >
                    View all (2) →
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E1E2ED] flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-bold text-[#18181B]">Tab. Metformin 500 mg</p>
                      <p className="text-[12px] text-[#71717A]">Twice daily with meals (BID) • AIIMS Delhi</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                      Active
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E1E2ED] flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-bold text-[#18181B]">Tab. Amlodipine 5 mg</p>
                      <p className="text-[12px] text-[#71717A]">Once daily morning (OD) • AIIMS Delhi</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Scanned Documents Preview */}
              <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-bold text-[#18181B] flex items-center gap-2">
                    <FileText size={18} className="text-[#006A61]" />
                    <span>Scanned Documents</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('DOCUMENTS')}
                    className="text-[12px] font-semibold text-[#006A61] hover:underline"
                  >
                    View all (3) →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {DEMO_DOCUMENTS_ENC001.slice(0, 2).map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E1E2ED] hover:border-[#006A61] transition-colors cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-[14px] font-bold text-[#18181B] group-hover:text-[#006A61] transition-colors">
                          {doc.originalFilename}
                        </p>
                        <p className="text-[12px] text-[#71717A]">
                          {doc.documentType.replace(/_/g, ' ')} • {Math.round((doc.ocrConfidence || 0.9) * 100)}% Digitized
                        </p>
                      </div>
                      <Eye size={16} className="text-[#A1A1AA] group-hover:text-[#006A61]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Prescriptions */}
        {activeTab === 'PRESCRIPTIONS' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E2ED] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E1E2ED]">
              <div>
                <h2 className="text-[20px] font-bold text-[#18181B]">
                  Prescriptions &amp; Medications
                </h2>
                <p className="text-[13px] text-[#71717A] mt-0.5">
                  Prescribed medications digitized and linked to your ABHA health profile.
                </p>
              </div>

              <span className="text-[11px] font-bold text-[#166534] bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#BBF7D0] self-start sm:self-auto">
                ● Synced to ABHA Health Locker
              </span>
            </div>

            {/* Today's OPD Prescription Banner */}
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#004AC6] bg-white px-2.5 py-0.5 rounded border border-[#BFDBFE]">
                  Today&apos;s OPD Consultation • Dr. Sunita Rao
                </span>
                <span className="text-[12px] font-mono text-[#004AC6]">31 Aug 2026</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-xl border border-[#BFDBFE] space-y-1">
                  <p className="font-bold text-[#18181B] text-[14px]">Tab. Pantoprazole 40mg</p>
                  <p className="text-[12px] text-[#52525B]">1 Tablet • Once daily before breakfast (OD) • 14 days</p>
                  <p className="text-[11px] text-[#004AC6] font-semibold">For: Acid Peptic Disease / Epigastric burning</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#BFDBFE] space-y-1">
                  <p className="font-bold text-[#18181B] text-[14px]">Syrup Sucralfate 10ml</p>
                  <p className="text-[12px] text-[#52525B]">2 Teaspoons • Three times daily after meals (TDS) • 7 days</p>
                  <p className="text-[11px] text-[#004AC6] font-semibold">For: Gastric mucosal protection</p>
                </div>
              </div>
            </div>

            {/* Ongoing Chronic Prescriptions */}
            <div>
              <h3 className="text-[15px] font-bold text-[#18181B] mb-3">Ongoing Long-term Prescriptions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#FAF8FF] p-5 rounded-2xl border border-[#E1E2ED] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#004AC6] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                      Diabetes Mellitus
                    </span>
                    <span className="text-[12px] font-mono text-[#71717A]">AIIMS Delhi</span>
                  </div>
                  <h4 className="text-[16px] font-bold text-[#18181B]">Tab. Metformin 500mg</h4>
                  <p className="text-[13px] text-[#52525B]">Dosage: 1 tablet twice daily after meals (BID)</p>
                  <p className="text-[11px] text-[#16A34A] font-semibold pt-1">✓ Active Medication</p>
                </div>

                <div className="bg-[#FAF8FF] p-5 rounded-2xl border border-[#E1E2ED] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#004AC6] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                      Hypertension
                    </span>
                    <span className="text-[12px] font-mono text-[#71717A]">AIIMS Delhi</span>
                  </div>
                  <h4 className="text-[16px] font-bold text-[#18181B]">Tab. Amlodipine 5mg</h4>
                  <p className="text-[13px] text-[#52525B]">Dosage: 1 tablet once daily morning (OD)</p>
                  <p className="text-[11px] text-[#16A34A] font-semibold pt-1">✓ Active Medication</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Medical Documents */}
        {activeTab === 'DOCUMENTS' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E2ED] shadow-xs space-y-6">
            <div>
              <h2 className="text-[20px] font-bold text-[#18181B]">
                Scanned Medical Documents
              </h2>
              <p className="text-[13px] text-[#71717A] mt-0.5">
                Physical medical files scanned and processed into your digital health record.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEMO_DOCUMENTS_ENC001.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="p-5 rounded-2xl border border-[#E1E2ED] bg-[#FAF8FF] hover:border-[#004AC6] transition-all cursor-pointer flex flex-col justify-between gap-4 group shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#004AC6] px-2 py-0.5 rounded">
                        {doc.documentType.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-[#166534] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                        {Math.round((doc.ocrConfidence || 0.9) * 100)}% OCR
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-[#18181B] group-hover:text-[#004AC6] transition-colors">
                      {doc.originalFilename}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-[12px] text-[#71717A] pt-3 border-t border-[#E1E2ED]">
                    <span>{doc.extractedFactsCount || 4} facts extracted</span>
                    <span className="text-[#004AC6] font-bold flex items-center gap-1 group-hover:underline">
                      <span>Inspect</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Health Journey Timeline */}
        {activeTab === 'TIMELINE' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E2ED] shadow-xs space-y-6">
            <div>
              <h2 className="text-[20px] font-bold text-[#18181B]">
                Longitudinal Health Journey
              </h2>
              <p className="text-[13px] text-[#71717A] mt-0.5">
                Chronological health timeline merging past hospital records with today&apos;s intake.
              </p>
            </div>

            <div className="relative pl-6 border-l-2 border-[#E1E2ED] space-y-6">
              {DEMO_TIMELINE_ENC001.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#004AC6]" />
                  <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED] hover:border-[#004AC6] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h4 className="text-[15px] font-bold text-[#18181B]">
                        {item.title}
                      </h4>
                      <span className="text-[12px] font-mono text-[#71717A]">
                        {item.eventDate ? formatIndianDate(item.eventDate) : 'Approximate'}
                      </span>
                    </div>
                    {item.detail && (
                      <p className="text-[13px] text-[#52525B]">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ─── Document Detail Modal ──────────────────────────────────── */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-[#E1E2ED] shadow-xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-[#E1E2ED] pb-3">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#004AC6] bg-[#EFF6FF] px-2 py-0.5 rounded">
                  {selectedDoc.documentType.replace(/_/g, ' ')}
                </span>
                <h3 className="text-[17px] font-bold text-[#18181B] mt-1">
                  {selectedDoc.originalFilename}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-[#71717A] hover:text-[#18181B] font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-[13px]">
              <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Digitization Quality:</span>
                  <span className="font-bold text-[#166534]">
                    {Math.round((selectedDoc.ocrConfidence || 0.9) * 100)}% Accuracy
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Extracted Entities:</span>
                  <span className="font-bold text-[#18181B]">
                    {selectedDoc.extractedFactsCount || 4} Clinical Facts
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">OCR Status:</span>
                  <span className="font-bold text-[#004AC6] uppercase text-[11px]">
                    {selectedDoc.status}
                  </span>
                </div>
              </div>

              <p className="text-[12px] text-[#71717A] italic">
                This document is linked to your ABHA health record and was provided during patient intake.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E1E2ED]">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl text-[13px] font-bold text-[#004AC6] bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
