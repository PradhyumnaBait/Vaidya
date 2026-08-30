'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Globe } from 'lucide-react'
import { useIntakeStore } from '@/store'

export default function PatientRegisterPage() {
  const router = useRouter()
  const { setNewPatient, language } = useIntakeStore()

  const [fullName, setFullName] = useState('')
  const [inputType, setInputType] = useState<'age' | 'dob'>('age')
  const [age, setAge] = useState('')
  const [dob, setDob] = useState('')
  const [sex, setSex] = useState<'male' | 'female' | 'other' | ''>('')
  const [mobile, setMobile] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim()) {
      setError('Please enter your full name.')
      return
    }

    if (inputType === 'age' && (!age || parseInt(age, 10) <= 0)) {
      setError('Please enter a valid age.')
      return
    }

    if (inputType === 'dob' && !dob) {
      setError('Please enter your date of birth.')
      return
    }

    if (!sex) {
      setError('Please select sex.')
      return
    }

    const cleanMobile = mobile.replace(/\D/g, '')
    if (cleanMobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }

    const calculatedAge = inputType === 'age' ? parseInt(age, 10) : new Date().getFullYear() - new Date(dob).getFullYear()

    setNewPatient({
      name: fullName.trim(),
      age: calculatedAge,
      gender: sex,
      phone: cleanMobile,
      preferredLanguage: language || 'hi',
    })

    router.push('/patient/consent')
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] text-[#191b23] flex flex-col justify-between select-none">
      {/* Header Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[#E4E4E7]">
        <div className="max-w-[600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[14px] text-[#2563EB] tracking-tight uppercase">VAIDYA</span>
            <span className="px-1.5 py-0.5 bg-[#E7E7F3] rounded text-[10px] font-mono text-[#434655] uppercase">
              AIIA OPD
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#71717A]">~12 min remaining</span>
        </div>
        <div className="w-full h-1 bg-[#E1E2ED]">
          <div className="h-full bg-[#2563EB] w-[10%] transition-all duration-500" />
        </div>
      </header>

      {/* Main Form Content */}
      <main className="w-full max-w-[560px] mx-auto px-4 pt-20 pb-36 flex flex-col gap-6">
        {/* Title */}
        <div className="flex flex-col gap-1 pt-2">
          <h1 className="text-[24px] font-semibold text-[#191b23] leading-tight">
            A few details to get started
            <span className="block text-[18px] text-[#434655] font-normal">शुरू करने के लिए कुछ जानकारी</span>
          </h1>
          <p className="text-[14px] text-[#71717A]">
            This takes about 2 minutes. Your information is kept strictly confidential.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#191b23] flex justify-between">
              <span>Full Name <span className="text-[#DC2626]">*</span></span>
              <span className="text-[#71717A]">पूरा नाम</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter patient's full name"
              className="w-full h-[52px] px-4 rounded-xl bg-white border border-[#E4E4E7] text-[16px] text-[#191b23] placeholder:text-[#A1A1AA] focus:border-[#2563EB] focus:outline-none"
              required
            />
          </div>

          {/* Age / DOB */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#191b23] flex justify-between">
              <span>Age / Date of Birth <span className="text-[#DC2626]">*</span></span>
              <span className="text-[#71717A]">उम्र / जन्म तिथि</span>
            </label>
            <div className="flex p-1 bg-[#E7E7F3] rounded-lg">
              <button
                type="button"
                onClick={() => setInputType('age')}
                className={`flex-1 py-2 text-center rounded-md text-[14px] font-medium transition-all ${
                  inputType === 'age' ? 'bg-white text-[#191b23] shadow-sm' : 'text-[#71717A]'
                }`}
              >
                Age
              </button>
              <button
                type="button"
                onClick={() => setInputType('dob')}
                className={`flex-1 py-2 text-center rounded-md text-[14px] font-medium transition-all ${
                  inputType === 'dob' ? 'bg-white text-[#191b23] shadow-sm' : 'text-[#71717A]'
                }`}
              >
                Date of Birth
              </button>
            </div>

            {inputType === 'age' ? (
              <input
                type="number"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Years e.g. 35"
                className="w-full h-[52px] px-4 rounded-xl bg-white border border-[#E4E4E7] text-[16px] text-[#191b23] focus:border-[#2563EB] focus:outline-none"
              />
            ) : (
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full h-[52px] px-4 rounded-xl bg-white border border-[#E4E4E7] text-[16px] text-[#191b23] focus:border-[#2563EB] focus:outline-none"
              />
            )}
          </div>

          {/* Sex Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#191b23] flex justify-between">
              <span>Sex <span className="text-[#DC2626]">*</span></span>
              <span className="text-[#71717A]">लिंग</span>
            </label>
            <div className="flex gap-2">
              {[
                { id: 'male', label: 'Male' },
                { id: 'female', label: 'Female' },
                { id: 'other', label: 'Other' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSex(s.id as 'male' | 'female' | 'other')}
                  className={`flex-1 h-[52px] rounded-xl border text-[16px] font-medium transition-all ${
                    sex === s.id
                      ? 'bg-[#EFF6FF] text-[#2563EB] border-[#2563EB] ring-1 ring-[#2563EB]'
                      : 'bg-white text-[#191b23] border-[#E4E4E7] hover:bg-[#F9F9FA]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#191b23] flex justify-between">
              <span>Mobile Number <span className="text-[#DC2626]">*</span></span>
              <span className="text-[#71717A]">मोबाइल नंबर</span>
            </label>
            <div className="flex items-center bg-white border border-[#E4E4E7] rounded-xl overflow-hidden focus-within:border-[#2563EB] h-[52px]">
              <div className="px-4 h-full flex items-center bg-[#F4F4F5] text-[#71717A] font-medium text-[16px] border-r border-[#E4E4E7]">
                +91
              </div>
              <input
                type="tel"
                inputMode="numeric"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit number"
                className="flex-1 h-full px-4 text-[16px] text-[#191b23] bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Preferred Language */}
          <div className="p-4 bg-white border border-[#E4E4E7] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-[#2563EB]" />
              <span className="text-[14px] font-medium text-[#191b23]">
                Preferred Language: <span className="text-[#2563EB] uppercase font-bold">{language || 'hi'}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => router.push('/patient/welcome')}
              className="text-[13px] text-[#2563EB] font-semibold hover:underline"
            >
              Change
            </button>
          </div>
        </form>
      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-[#E4E4E7] flex flex-col gap-2 z-50 max-w-[600px] mx-auto">
        <button
          onClick={handleSubmit}
          className="w-full h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-semibold text-[16px] flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight size={20} />
        </button>
        <button
          onClick={() => router.push('/patient/consent')}
          className="py-2 text-center text-[#71717A] text-[14px] hover:text-[#191b23] underline underline-offset-4 cursor-pointer"
        >
          I&apos;ll skip this and ask staff for help
        </button>
      </div>
    </div>
  )
}
