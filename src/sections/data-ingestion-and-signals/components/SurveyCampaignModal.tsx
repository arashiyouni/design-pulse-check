import { useState } from 'react'
import { X, Plus, Trash2, Edit2, Check, FileText, Star, MessageSquare, Calendar } from 'lucide-react'

export type SurveyTemplate = 'custom' | 'nps' | 'csat' | 'feedback'
export type QuestionType = 'rating' | 'text' | 'multiple-choice'

export interface SurveyQuestion {
  id: string
  text: string
  type: QuestionType
  required: boolean
  options?: string[] // for multiple-choice
}

interface SurveyCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: {
    name: string
    period: string
    template: SurveyTemplate
    questions: SurveyQuestion[]
  }) => void
}

// Pre-defined template questions
const templateQuestions: Record<SurveyTemplate, SurveyQuestion[]> = {
  nps: [
    {
      id: 'nps-1',
      text: 'On a scale of 0-10, how likely are you to recommend working with this engineer to a colleague?',
      type: 'rating',
      required: true,
    },
    {
      id: 'nps-2',
      text: 'What is the primary reason for your score?',
      type: 'text',
      required: false,
    },
  ],
  csat: [
    {
      id: 'csat-1',
      text: 'How satisfied are you with the overall quality of work delivered?',
      type: 'rating',
      required: true,
    },
    {
      id: 'csat-2',
      text: 'How satisfied are you with communication and responsiveness?',
      type: 'rating',
      required: true,
    },
    {
      id: 'csat-3',
      text: 'Additional comments or suggestions?',
      type: 'text',
      required: false,
    },
  ],
  feedback: [
    {
      id: 'feedback-1',
      text: 'How is everything going so far with the team? We would like to hear if there is anything that we could do better.',
      type: 'text',
      required: true,
    },
    {
      id: 'feedback-2',
      text: 'When in need of urgent support, are you satisfied with the Ravn team response time and the way we escalate?',
      type: 'rating',
      required: true,
    },
    {
      id: 'feedback-3',
      text: 'Is there any additional area that we could support you on?',
      type: 'text',
      required: false,
    },
    {
      id: 'feedback-4',
      text: 'To keep the momentum, would you be open to a recurring monthly check-in? We can use it to clear roadblocks in one go so the rest of the month is total focus time for your team.',
      type: 'multiple-choice',
      required: true,
      options: ['Yes, monthly check-ins work well', 'No, current cadence is fine', 'Let\'s discuss alternative timing'],
    },
  ],
  custom: [],
}

export function SurveyCampaignModal({ isOpen, onClose, onCreate }: SurveyCampaignModalProps) {
  const [campaignName, setCampaignName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate>('custom')
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
  const [newQuestionText, setNewQuestionText] = useState('')
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>('text')
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [expandedTemplate, setExpandedTemplate] = useState<SurveyTemplate | null>(null)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set())
  const [previewQuestions, setPreviewQuestions] = useState<SurveyQuestion[]>([])
  const [editingPreviewQuestionId, setEditingPreviewQuestionId] = useState<string | null>(null)
  const [showPreviewQuestionForm, setShowPreviewQuestionForm] = useState(false)

  // Initialize with current date
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0] // YYYY-MM-DD format

  if (!isOpen) return null

  const handleTemplateSelect = (template: SurveyTemplate) => {
    setSelectedTemplate(template)
    setShowQuestionForm(false)

    // If clicking the same template, collapse it
    if (expandedTemplate === template) {
      setExpandedTemplate(null)
      setSelectedQuestionIds(new Set())
      setPreviewQuestions([])
      setShowPreviewQuestionForm(false)
    } else {
      // Expand the template and load questions for editing
      setExpandedTemplate(template)
      const templateQs = [...templateQuestions[template]]
      setPreviewQuestions(templateQs)
      const allQuestionIds = new Set(templateQs.map(q => q.id))
      setSelectedQuestionIds(allQuestionIds)
      setShowPreviewQuestionForm(false)
    }
  }

  const handleToggleQuestion = (questionId: string) => {
    const newSelected = new Set(selectedQuestionIds)
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId)
    } else {
      newSelected.add(questionId)
    }
    setSelectedQuestionIds(newSelected)
  }

  const handleAddSelectedQuestions = () => {
    if (expandedTemplate && selectedQuestionIds.size > 0) {
      const questionsToAdd = previewQuestions.filter(q =>
        selectedQuestionIds.has(q.id)
      )
      setQuestions(questionsToAdd)
      setExpandedTemplate(null)
      setSelectedQuestionIds(new Set())
      setPreviewQuestions([])
    }
  }

  // Preview question CRUD operations
  const handleUpdatePreviewQuestion = (id: string, updates: Partial<SurveyQuestion>) => {
    setPreviewQuestions(previewQuestions.map(q =>
      q.id === id ? { ...q, ...updates } : q
    ))
    setEditingPreviewQuestionId(null)
  }

  const handleDeletePreviewQuestion = (id: string) => {
    setPreviewQuestions(previewQuestions.filter(q => q.id !== id))
    // Remove from selected if it was selected
    const newSelected = new Set(selectedQuestionIds)
    newSelected.delete(id)
    setSelectedQuestionIds(newSelected)
  }

  const handleAddPreviewQuestion = () => {
    if (!newQuestionText.trim()) return

    const newQuestion: SurveyQuestion = {
      id: `preview-${Date.now()}`,
      text: newQuestionText,
      type: newQuestionType,
      required: true,
    }

    setPreviewQuestions([...previewQuestions, newQuestion])
    // Auto-select the new question
    const newSelected = new Set(selectedQuestionIds)
    newSelected.add(newQuestion.id)
    setSelectedQuestionIds(newSelected)

    setNewQuestionText('')
    setNewQuestionType('text')
    setShowPreviewQuestionForm(false)
  }

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return

    const newQuestion: SurveyQuestion = {
      id: `q-${Date.now()}`,
      text: newQuestionText,
      type: newQuestionType,
      required: true,
    }

    setQuestions([...questions, newQuestion])
    setNewQuestionText('')
    setNewQuestionType('text')
    setShowQuestionForm(false)
  }

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const handleUpdateQuestion = (id: string, text: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)))
    setEditingQuestionId(null)
  }

  const handleCreate = () => {
    if (!campaignName.trim() || !startDate.trim() || !endDate.trim() || questions.length === 0) return

    // Format period as "MMM DD - MMM DD, YYYY" (e.g., "Feb 01 - Feb 15, 2026")
    const start = new Date(startDate)
    const end = new Date(endDate)
    const period = `${start.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`

    onCreate({
      name: campaignName,
      period,
      template: selectedTemplate,
      questions,
    })

    // Reset form
    setCampaignName('')
    setStartDate('')
    setEndDate('')
    setSelectedTemplate('custom')
    setQuestions([])
    setShowQuestionForm(false)
  }

  const templates: { id: SurveyTemplate; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'nps', label: 'NPS Survey', description: 'Net Promoter Score (customizable)', icon: Star },
    { id: 'csat', label: 'CSAT Survey', description: 'Customer Satisfaction (customizable)', icon: Check },
    { id: 'feedback', label: 'Feedback Survey', description: 'General feedback (customizable)', icon: MessageSquare },
    { id: 'custom', label: 'Start from Scratch', description: 'Build your own questions', icon: FileText },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Survey Campaign</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Choose a template as a starting point, then customize as needed
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Campaign Details */}
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Campaign Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Campaign Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g., Feb 2026 — Week 3 Pulse"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Period Date Range */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Calendar className="size-3.5" />
                    Campaign Period <span className="text-red-500">*</span>
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={todayStr}
                        max={endDate || undefined}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || todayStr}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                      />
                    </div>
                  </div>
                  {startDate && endDate && (
                    <p className="mt-2 text-xs text-teal-600 dark:text-teal-400">
                      Period: {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} - {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Select Template</h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Click a template to preview and select questions
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {templates.map((template) => {
                  const Icon = template.icon
                  const isSelected = selectedTemplate === template.id
                  const isExpanded = expandedTemplate === template.id
                  const previewQuestions = templateQuestions[template.id]

                  return (
                    <div key={template.id} className="space-y-2">
                      <button
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`w-full rounded-xl border p-4 text-left transition-all ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50 dark:border-teal-500 dark:bg-teal-950/30'
                            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div
                              className={`rounded-lg p-2 ${
                                isSelected
                                  ? 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400'
                                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                              }`}
                            >
                              <Icon className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4
                                className={`text-sm font-semibold ${
                                  isSelected
                                    ? 'text-teal-900 dark:text-teal-100'
                                    : 'text-slate-900 dark:text-white'
                                }`}
                              >
                                {template.label}
                              </h4>
                              <p
                                className={`mt-0.5 text-xs ${
                                  isSelected
                                    ? 'text-teal-700 dark:text-teal-300'
                                    : 'text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                {template.description}
                              </p>
                              {previewQuestions.length > 0 && (
                                <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                                  {previewQuestions.length} question{previewQuestions.length !== 1 ? 's' : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Expanded questions preview with CRUD */}
                      {isExpanded && (
                        <div className="space-y-3 rounded-lg border border-teal-200 bg-teal-50/30 p-3 dark:border-teal-800 dark:bg-teal-950/20">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-teal-900 dark:text-teal-100">
                              Customize & Select ({selectedQuestionIds.size}/{previewQuestions.length})
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setShowPreviewQuestionForm(!showPreviewQuestionForm)}
                                className="flex items-center gap-1 text-[10px] font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                              >
                                <Plus className="size-3" />
                                Add
                              </button>
                              {previewQuestions.length > 0 && (
                                <button
                                  onClick={() => {
                                    const allIds = new Set(previewQuestions.map(q => q.id))
                                    setSelectedQuestionIds(
                                      selectedQuestionIds.size === previewQuestions.length ? new Set() : allIds
                                    )
                                  }}
                                  className="text-[10px] font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                                >
                                  {selectedQuestionIds.size === previewQuestions.length ? 'Deselect All' : 'Select All'}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Add Question Form in Preview */}
                          {showPreviewQuestionForm && (
                            <div className="space-y-2 rounded-lg border border-teal-300 bg-white p-3 dark:border-teal-700 dark:bg-slate-900">
                              <textarea
                                value={newQuestionText}
                                onChange={(e) => setNewQuestionText(e.target.value)}
                                placeholder="Enter question text..."
                                rows={2}
                                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                              />
                              <div className="flex gap-2">
                                <select
                                  value={newQuestionType}
                                  onChange={(e) => setNewQuestionType(e.target.value as QuestionType)}
                                  className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                >
                                  <option value="text">Text</option>
                                  <option value="rating">Rating</option>
                                  <option value="multiple-choice">Multiple Choice</option>
                                </select>
                                <button
                                  onClick={handleAddPreviewQuestion}
                                  disabled={!newQuestionText.trim()}
                                  className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 disabled:opacity-50 dark:bg-teal-500"
                                >
                                  Add
                                </button>
                                <button
                                  onClick={() => {
                                    setShowPreviewQuestionForm(false)
                                    setNewQuestionText('')
                                  }}
                                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Preview Questions List */}
                          {previewQuestions.length > 0 ? (
                            <div className="space-y-2">
                              {previewQuestions.map((q, idx) => (
                                <div
                                  key={q.id}
                                  className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedQuestionIds.has(q.id)}
                                    onChange={() => handleToggleQuestion(q.id)}
                                    className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-800"
                                  />
                                  <div className="min-w-0 flex-1">
                                    {editingPreviewQuestionId === q.id ? (
                                      <div className="space-y-2">
                                        <textarea
                                          defaultValue={q.text}
                                          onBlur={(e) => handleUpdatePreviewQuestion(q.id, { text: e.target.value })}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                              e.preventDefault()
                                              handleUpdatePreviewQuestion(q.id, { text: e.currentTarget.value })
                                            }
                                          }}
                                          rows={2}
                                          className="w-full rounded border border-teal-300 bg-white px-2 py-1 text-xs text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-teal-700 dark:bg-slate-800 dark:text-white"
                                          autoFocus
                                        />
                                        <select
                                          value={q.type}
                                          onChange={(e) => handleUpdatePreviewQuestion(q.id, { type: e.target.value as QuestionType })}
                                          className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        >
                                          <option value="text">Text Response</option>
                                          <option value="rating">Rating (1-5)</option>
                                          <option value="multiple-choice">Multiple Choice</option>
                                        </select>
                                      </div>
                                    ) : (
                                      <>
                                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                          {idx + 1}. {q.text}
                                        </p>
                                        <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                                          Type: {q.type} {q.required && '· Required'}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                  <div className="flex shrink-0 gap-1">
                                    <button
                                      onClick={() => setEditingPreviewQuestionId(editingPreviewQuestionId === q.id ? null : q.id)}
                                      className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                                      title="Edit question"
                                    >
                                      {editingPreviewQuestionId === q.id ? <Check className="size-3" /> : <Edit2 className="size-3" />}
                                    </button>
                                    <button
                                      onClick={() => handleDeletePreviewQuestion(q.id)}
                                      className="rounded p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                                      title="Delete question"
                                    >
                                      <Trash2 className="size-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                              No questions yet. Click "Add" to create one.
                            </p>
                          )}

                          {/* Add Selected Button */}
                          <button
                            onClick={handleAddSelectedQuestions}
                            disabled={selectedQuestionIds.size === 0}
                            className="w-full rounded-lg bg-teal-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-500 dark:hover:bg-teal-400"
                          >
                            Add {selectedQuestionIds.size} Selected Question{selectedQuestionIds.size !== 1 ? 's' : ''}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Questions List */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Survey Questions</h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {questions.length} question{questions.length !== 1 ? 's' : ''} · Fully customizable
                  </p>
                </div>
                <button
                  onClick={() => setShowQuestionForm(!showQuestionForm)}
                  className="flex items-center gap-1.5 rounded-lg bg-teal-100 px-3 py-1.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:hover:bg-teal-950/60"
                >
                  <Plus className="size-3" />
                  Add Question
                </button>
              </div>

              {/* Add Question Form */}
              {showQuestionForm && (
                <div className="mb-4 space-y-3 rounded-xl border border-teal-200 bg-teal-50/50 p-4 dark:border-teal-800 dark:bg-teal-950/20">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                      Question Text
                    </label>
                    <textarea
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder="Enter your question here..."
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                      Question Type
                    </label>
                    <select
                      value={newQuestionType}
                      onChange={(e) => setNewQuestionType(e.target.value as QuestionType)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="text">Text Response</option>
                      <option value="rating">Rating (1-5)</option>
                      <option value="multiple-choice">Multiple Choice</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddQuestion}
                      disabled={!newQuestionText.trim()}
                      className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-500 dark:hover:bg-teal-400"
                    >
                      Add Question
                    </button>
                    <button
                      onClick={() => {
                        setShowQuestionForm(false)
                        setNewQuestionText('')
                      }}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Questions Display */}
              {questions.length > 0 ? (
                <div className="space-y-2">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        {editingQuestionId === question.id ? (
                          <input
                            type="text"
                            defaultValue={question.text}
                            onBlur={(e) => handleUpdateQuestion(question.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdateQuestion(question.id, e.currentTarget.value)
                              }
                            }}
                            className="w-full rounded border border-teal-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-teal-700 dark:bg-slate-800 dark:text-white"
                            autoFocus
                          />
                        ) : (
                          <>
                            <p className="text-sm text-slate-900 dark:text-white">{question.text}</p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              Type: {question.type} {question.required && '· Required'}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          onClick={() => setEditingQuestionId(question.id)}
                          className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                          title="Edit question"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="rounded p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                          title="Delete question"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
                  <FileText className="mx-auto size-8 text-slate-400 dark:text-slate-500" />
                  <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">No questions yet</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Select a template above to load questions, or click "Add Question" to start from scratch
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!campaignName.trim() || !startDate.trim() || !endDate.trim() || questions.length === 0}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  )
}
