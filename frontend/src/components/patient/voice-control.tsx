'use client'
import { useState, useCallback } from 'react'
import { Mic, Square, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

type VoiceState = 'ready' | 'listening' | 'processing' | 'confirming' | 'retry' | 'unavailable'

interface VoiceControlProps {
  onTranscription: (text: string, confidence: number) => void
  language?: string
  size?: 'md' | 'lg'
}

export function VoiceControl({ onTranscription, size = 'md' }: VoiceControlProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('ready')
  const sizeClass = size === 'lg' ? 'w-24 h-24' : 'w-[72px] h-[72px]'

  const simulateTranscription = useCallback(() => {
    setVoiceState('processing')
    setTimeout(() => {
      setVoiceState('confirming')
      // Simulate a transcription result
      onTranscription('Mujhe 3 hafte se pet dard ho raha hai', 0.87)
    }, 1500)
  }, [onTranscription])

  const handleMicClick = () => {
    if (voiceState === 'ready') setVoiceState('listening')
    else if (voiceState === 'listening') simulateTranscription()
    else if (voiceState === 'retry') setVoiceState('listening')
  }

  const STATE_CONFIG = {
    ready:       { bg: '#F4F4F5', border: '1.5px solid #D4D4D8', iconColor: '#71717A', label: 'Tap to speak' },
    listening:   { bg: '#EFF6FF', border: 'none', iconColor: '#2563EB', label: 'Listening...' },
    processing:  { bg: '#EFF6FF', border: 'none', iconColor: '#A1A1AA', label: 'Processing...' },
    confirming:  { bg: '#F0FDF4', border: 'none', iconColor: '#16A34A', label: 'Did we get that right?' },
    retry:       { bg: '#FEF2F2', border: '1px solid #FCA5A5', iconColor: '#DC2626', label: 'Tap to try again' },
    unavailable: { bg: '#F4F4F5', border: 'none', iconColor: '#A1A1AA', label: 'Voice unavailable' },
  }

  const config = STATE_CONFIG[voiceState]

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {voiceState === 'listening' && (
          <>
            <div className={cn('absolute inset-0 rounded-full border-2 border-[var(--color-accent)]/40 voice-ring')} style={{ transform: 'scale(1.4)' }} />
            <div className={cn('absolute inset-0 rounded-full border border-[var(--color-accent)]/20 voice-ring-delay')} style={{ transform: 'scale(1.7)' }} />
          </>
        )}
        <button
          onClick={handleMicClick}
          disabled={voiceState === 'unavailable' || voiceState === 'processing'}
          className={cn('relative rounded-full flex items-center justify-center transition-colors duration-fast', sizeClass)}
          style={{ background: config.bg, border: config.border }}
          aria-label={`Voice input — ${config.label}`}
        >
          {voiceState === 'processing' ? (
            <svg className="processing-arc w-7 h-7" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke={config.iconColor} strokeWidth="2" strokeDasharray="40" strokeDashoffset="15" strokeLinecap="round"/>
            </svg>
          ) : voiceState === 'listening' ? (
            <Square size={20} fill={config.iconColor} color={config.iconColor} />
          ) : voiceState === 'retry' ? (
            <RotateCcw size={24} color={config.iconColor} />
          ) : (
            <Mic size={size === 'lg' ? 30 : 24} fill={voiceState === 'confirming' ? config.iconColor : 'none'} color={config.iconColor} />
          )}
        </button>
      </div>
      <p className="text-[13px]" style={{ color: config.iconColor }}>{config.label}</p>
    </div>
  )
}
