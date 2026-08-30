'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, FileText, CheckCircle2, AlertTriangle, Loader2, Plus, ArrowRight, MoreVertical } from 'lucide-react'
import { useIntakeStore } from '@/store'

export default function PatientDocumentsPage() {
  const router = useRouter()
  const { addDocumentId } = useIntakeStore()
  const [selectedType, setSelectedType] = useState('Prescription')

  const sampleDocs = [
    {
      id: 'doc-1',
      name: 'Cardiology_Prescription_Oct23.pdf',
      status: 'COMPLETE',
      details: '4 items extracted • OCR 94%',
      type: 'Prescription',
    },
    {
      id: 'doc-2',
      name: 'Lipid_Panel_Fasting.png',
      status: 'REVIEW_REQUIRED',
      details: 'Low clarity on page 2 • OCR 68%',
      type: 'Lab Report',
    },
    {
      id: 'doc-3',
      name: 'Discharge_Summary_Apollo.pdf',
      status: 'PROCESSING',
      details: 'Extracting clinical entities... 45%',
      type: 'Discharge Summary',
    },
  ]

  const handleScanClick = () => {
    router.push('/patient/documents/scan')
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      const newDocId = `doc-${Date.now()}-${selectedFile.name}`
      addDocumentId(newDocId)
      router.push('/patient/documents/quality')
    }
  }

  const handleContinue = () => {
    router.push('/patient/review')
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] text-[#191b23] flex flex-col justify-between select-none">
      {/* Header Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[#E4E4E7]">
        <div className="max-w-[600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[14px] text-[#2563EB] tracking-tight uppercase">VAIDYA</span>
          </div>
          <span className="text-[11px] font-mono text-[#71717A]">~3 min remaining</span>
        </div>
        <div className="w-full h-1 bg-[#E1E2ED]">
          <div className="h-full bg-[#2563EB] w-[80%] transition-all duration-500" />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[640px] mx-auto px-4 pt-20 pb-36 flex flex-col gap-6 flex-1">
        
        {/* Title */}
        <div className="flex flex-col gap-1 pt-2">
          <h1 className="text-[26px] sm:text-[30px] font-semibold text-[#191b23] leading-tight">
            Do you have any medical records to share?<br />
            <span className="text-[18px] text-[#71717A] font-normal">क्या आपके पास साझा करने के लिए कोई मेडिकल रिकॉर्ड हैं?</span>
          </h1>
          <p className="text-[14px] text-[#71717A]">
            You can share prescriptions, lab reports, or discharge summaries.
          </p>
        </div>

        {/* Upload Zone Button Card */}
        <div className="w-full bg-[#E7E7F3]/60 border-2 border-dashed border-[#C3C6D7] hover:border-[#2563EB] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-colors group cursor-pointer relative">
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-full bg-[#2563EB] text-white flex items-center justify-center mb-1 group-active:scale-95 transition-transform shadow-md">
              <Camera size={26} />
            </div>
            <span className="font-bold text-[17px] text-[#191b23]">Tap to scan a document</span>
            <span className="text-[13px] text-[#71717A]">
              or <span className="text-[#2563EB] font-semibold underline">Choose from your files</span>
            </span>
          </label>
        </div>

        {/* Document Type Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#71717A]">
            What type of document?
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['Prescription', 'Lab Report', 'Discharge Summary', 'Other'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedType === t
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'bg-white text-[#191b23] border border-[#E4E4E7] hover:bg-[#F9F9FA]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Added Documents List (Multi-Doc Review P-19 & Processing P-18) */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[16px] font-bold text-[#191b23]">Uploaded Documents (3)</h2>
          
          {sampleDocs.map((doc) => {
            const isComplete = doc.status === 'COMPLETE'
            const isWarning = doc.status === 'REVIEW_REQUIRED'
            const isProcessing = doc.status === 'PROCESSING'

            return (
              <div
                key={doc.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  isWarning ? 'bg-[#FFDAD6]/20 border-[#FFDAD6]' : 'bg-white border-[#E4E4E7] shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isComplete ? 'bg-[#86F2E4]/40 text-[#006F66]' : isWarning ? 'bg-[#FFDBCD] text-[#BC4800]' : 'bg-[#DBE1FF] text-[#2563EB]'
                  }`}>
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-semibold text-[15px] text-[#191b23] truncate">{doc.name}</span>
                    <div className="flex items-center gap-1.5 text-[12px] mt-0.5">
                      {isComplete && (
                        <span className="flex items-center gap-1 text-[#006F66] font-mono font-bold">
                          <CheckCircle2 size={14} /> COMPLETE
                        </span>
                      )}
                      {isWarning && (
                        <span className="flex items-center gap-1 text-[#BC4800] font-mono font-bold">
                          <AlertTriangle size={14} /> REVIEW REQUIRED
                        </span>
                      )}
                      {isProcessing && (
                        <span className="flex items-center gap-1 text-[#2563EB] font-mono font-bold animate-pulse">
                          <Loader2 size={14} className="animate-spin" /> PROCESSING 45%
                        </span>
                      )}
                      <span className="text-[#A1A1AA]">•</span>
                      <span className="text-[#71717A] truncate">{doc.details}</span>
                    </div>
                  </div>
                </div>

                <button className="p-1.5 text-[#71717A] hover:text-[#191b23] rounded cursor-pointer">
                  <MoreVertical size={18} />
                </button>
              </div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-2">
          <button
            onClick={handleScanClick}
            className="w-full h-[48px] bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] font-semibold text-[15px] rounded-xl flex items-center justify-center gap-2 cursor-pointer border border-[#BFDBFE]"
          >
            <Plus size={18} />
            <span>Add another document</span>
          </button>
        </div>
      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#E4E4E7] flex flex-col gap-2 z-50 max-w-[600px] mx-auto">
        <button
          onClick={handleContinue}
          className="w-full h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>Continue to review</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}
