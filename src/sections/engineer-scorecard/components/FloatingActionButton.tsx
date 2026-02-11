import { Plus, ClipboardCheck } from 'lucide-react'

interface FloatingActionButtonProps {
  onClick: () => void
  hasAssessment: boolean
}

export function FloatingActionButton({ onClick, hasAssessment }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group fixed bottom-6 right-6 z-30 flex items-center gap-3 rounded-full bg-teal-600 px-6 py-4 text-white shadow-lg transition-all hover:bg-teal-700 hover:shadow-xl active:scale-95 dark:bg-teal-500 dark:hover:bg-teal-600"
      aria-label={hasAssessment ? 'Edit Self-Assessment' : 'Add Self-Assessment'}
    >
      {hasAssessment ? (
        <>
          <ClipboardCheck className="size-5" />
          <span className="hidden font-medium sm:inline">Assessment</span>
        </>
      ) : (
        <>
          <Plus className="size-5" />
          <span className="hidden font-medium sm:inline">Add Assessment</span>
        </>
      )}
      
      {/* Pulse animation for new assessment */}
      {!hasAssessment && (
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-teal-400 opacity-75" />
      )}
    </button>
  )
}
