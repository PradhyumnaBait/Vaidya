'use client'

import { useEffect, useState } from 'react'
import { useUIStore } from '@/store'
import { ClinicalFact } from '@/types'
import { Drawer } from '@/components/ui'
import { ProvenanceChip } from './provenance-chip'
import { SkeletonRow } from '@/components/ui/skeleton'
import {
  FileText,
  Mic,
  CheckCircle2,
  Search,
} from 'lucide-react'

export function EvidenceDrawer() {
  const { evidenceDrawerOpen, evidenceFactId, closeEvidenceDrawer, addToast } = useUIStore()
  const [fact, setFact] = useState<ClinicalFact | null>(null)
  const [loading, setLoading] = useState(false)
  const [isFactVerified, setIsFactVerified] = useState(false)

  useEffect(() => {
    if (evidenceFactId && evidenceDrawerOpen) {
      setLoading(true)
      setIsFactVerified(false)
      import('@/constants/demo-data').then(({ DEMO_FACTS_ENC001 }) => {
        const found = DEMO_FACTS_ENC001.find((f) => f.id === evidenceFactId)
        setFact(found ?? null)
        setLoading(false)
      })
    }
  }, [evidenceFactId, evidenceDrawerOpen])

  const handleVerify = () => {
    setIsFactVerified(true)
    addToast({
      type: 'success',
      title: 'Fact Verified by Physician',
      body: `"${fact?.rawValue}" confirmed against optical source proof.`,
    })
    setTimeout(() => {
      closeEvidenceDrawer()
    }, 400)
  }

  return (
    <Drawer open={evidenceDrawerOpen} onClose={closeEvidenceDrawer} title="Optical Source Evidence">
      <div className="p-6 space-y-6">
        {loading && (
          <div className="space-y-4">
            <SkeletonRow />
            <SkeletonRow />
          </div>
        )}

        {!loading && fact && (
          <>
            {/* The Fact Highlight */}
            <div className="bg-[#FAF8FF] rounded-2xl p-5 border border-[#E1E2ED] space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#004AC6]">
                  {fact.domain} • {fact.fieldName.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] font-bold uppercase bg-[#EFF6FF] text-[#004AC6] px-2 py-0.5 rounded border border-[#BFDBFE]">
                  Extracted Entity
                </span>
              </div>
              <p className="text-[20px] font-bold text-[#18181B] leading-snug">
                {fact.rawValue}
                {fact.valueUnit && <span className="text-[15px] font-semibold text-[#71717A] ml-1">{fact.valueUnit}</span>}
              </p>
            </div>

            {/* Source Classification */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] block">
                Source Channel &amp; Provenance
              </span>
              <div className="bg-white p-4 rounded-2xl border border-[#E1E2ED] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#004AC6]/10 text-[#004AC6] flex items-center justify-center">
                    {fact.sourceType === 'DOCUMENT_EXTRACT' ? <FileText size={20} /> : <Mic size={20} />}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#18181B]">
                      {fact.sourceType === 'DOCUMENT_EXTRACT'
                        ? 'Scanned Physical Record'
                        : 'Patient Voice Intake (Kiosk)'}
                    </p>
                    <p className="text-[11px] font-mono text-[#71717A]">
                      {fact.sourceDocumentId ? `Doc ID: ${fact.sourceDocumentId}` : 'Audio Session: sess-001 (Marathi)'}
                    </p>
                  </div>
                </div>
                <ProvenanceChip
                  tier={fact.confidenceTier}
                  sourceType={fact.sourceType}
                  confidence={fact.ocrConfidence ?? fact.confidence}
                />
              </div>
            </div>

            {/* Visual Source Proof Crop / Audio Transcript */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] block">
                {fact.sourceType === 'DOCUMENT_EXTRACT' ? 'Optical Bounding Box Crop' : 'Speech Transcript'}
              </span>

              {fact.sourceType === 'DOCUMENT_EXTRACT' ? (
                <div className="bg-[#FAF8FF] border-2 border-dashed border-[#004AC6]/40 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#71717A]">
                    <span>Crop: Page {fact.sourcePage || 1} • Bounding Box [x:120, y:450]</span>
                    <span className="text-[#166534] font-bold bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                      {Math.round((fact.ocrConfidence || 0.94) * 100)}% OCR Accuracy
                    </span>
                  </div>

                  {/* Simulated Crop Rendering */}
                  <div className="bg-white p-3 rounded-xl border border-[#004AC6]/30 shadow-xs font-mono text-[14px] font-bold text-[#18181B] border-l-4 border-l-[#004AC6]">
                    {fact.sourceText || fact.rawValue}
                  </div>
                  <p className="text-[11px] text-[#71717A] italic">
                    Scanned document verified from physical file presented at Kiosk Station 01.
                  </p>
                </div>
              ) : (
                <div className="bg-[#FAF8FF] border border-[#E1E2ED] rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[#004AC6] text-[12px] font-bold">
                    <Mic size={14} />
                    <span>Bhashini Multilingual Speech Model (mr-IN)</span>
                  </div>
                  <p className="text-[14px] text-[#18181B] font-medium italic bg-white p-3 rounded-xl border border-[#E1E2ED]">
                    &quot;३ महिन्यांपासून जेवणानंतर पोटात तीव्र जळजळ आणि दुखणे जाणवते...&quot;
                  </p>
                  <p className="text-[11px] text-[#71717A]">
                    English Translation: &quot;I have been experiencing severe burning stomach pain after meals for 3 months...&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Physician Verification Decision */}
            <div className="pt-4 border-t border-[#E1E2ED] space-y-3">
              <button
                onClick={handleVerify}
                className={`w-full h-11 text-[14px] font-bold rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 ${
                  isFactVerified
                    ? 'bg-[#16A34A] text-white'
                    : 'bg-[#004AC6] hover:bg-[#003EA8] text-white'
                }`}
              >
                <CheckCircle2 size={16} />
                <span>{isFactVerified ? 'Fact Confirmed ✓' : 'Mark as Physician Verified'}</span>
              </button>

              <button
                onClick={closeEvidenceDrawer}
                className="w-full h-10 text-[13px] font-semibold text-[#71717A] hover:text-[#18181B] hover:bg-[#FAF8FF] border border-[#E1E2ED] rounded-2xl transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </>
        )}

        {!loading && !fact && (
          <div className="text-center py-12 space-y-2">
            <Search size={32} className="mx-auto text-[#A1A1AA]" />
            <p className="text-[15px] font-bold text-[#18181B]">Source Evidence Not Found</p>
            <p className="text-[12px] text-[#71717A]">
              The selected fact does not contain attached optical crops.
            </p>
          </div>
        )}
      </div>
    </Drawer>
  )
}
