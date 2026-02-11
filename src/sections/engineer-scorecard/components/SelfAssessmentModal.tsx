import { X } from 'lucide-react'
import { SelfAssessmentWizard } from './SelfAssessmentWizard'
import type { SelfAssessmentFormData } from '@/../product/sections/engineer-scorecard/types'

interface SelfAssessmentModalProps {
  isOpen: boolean
  onClose: () => void
  period: string
  existingData?: SelfAssessmentFormData | null
  onSubmit?: (data: SelfAssessmentFormData) => void
}

export function SelfAssessmentModal({
  isOpen,
  onClose,
  period,
  existingData,
  onSubmit,
}: SelfAssessmentModalProps) {
  if (!isOpen) return null

  const handleSubmit = (data: SelfAssessmentFormData) => {
    onSubmit?.(data)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          {/* Modal content */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {existingData?.status === 'submitted' ? 'Edit Self-Assessment' : 'New Self-Assessment'}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Complete your growth assessment for {period}
              </p>
            </div>

            <SelfAssessmentWizard
              data={existingData ?? null}
              period={period}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  )
}
