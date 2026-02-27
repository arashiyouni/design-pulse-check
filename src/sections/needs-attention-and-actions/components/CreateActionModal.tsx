import { useState, useEffect } from 'react'
import type {
  CreateActionModalContext,
  CreateActionFormData,
  CreateActionType,
  ScoreSnapshot,
  LeadCheckInStatus,
} from '@/../product/sections/needs-attention-and-actions/types'
import {
  X,
  Mail,
  ClipboardList,
  Phone,
  Tag,
  ExternalLink,
  GitPullRequest,
  Clock,
  ChevronDown,
  CornerDownRight,
} from 'lucide-react'

// ── Email template generator ─────────────────────────────────────────────────

function getDefaultTemplate(
  type: CreateActionType,
  engineerName: string,
  prInfo?: CreateActionModalContext['prInfo']
): { subject: string; body: string } {
  const firstName = engineerName.split(' ')[0]
  const prRef = prInfo
    ? `PR #${prInfo.prNumber} (${prInfo.prTitle})`
    : 'your current work item'

  switch (type) {
    case 'email-reminder':
      return {
        subject: prInfo
          ? `[Pulse Check] Friendly reminder — PR #${prInfo.prNumber}`
          : '[Pulse Check] Friendly reminder',
        body: `Hey ${firstName}!\n\nFriendly reminder: ${prRef} has been open${prInfo ? ` >${prInfo.hoursOpen}h` : ' a while'}. Need a review or help unblocking anything? Just reply here and let me know what would be useful.\n${prInfo?.prUrl ? `\nPR: ${prInfo.prUrl}\n` : ''}\nThanks!`,
      }
    case 'burnout-survey':
      return {
        subject: '[Pulse Check] Quick check-in — 2 min',
        body: `Hi ${firstName},\n\nI noticed ${prRef} has been in progress for a while. I want to make sure you have everything you need.\n\nWould you mind taking a quick 3-question check-in? It takes under 2 minutes:\n\n[Survey Link]\n\nNo pressure — just here to help!`,
      }
    case 'quick-call':
      return {
        subject: '[Pulse Check] Quick 15-min chat?',
        body: `Hi ${firstName},\n\nI'd love to connect for a quick 15-minute conversation to talk through ${prRef} and any blockers you're running into.\n\nHere's my availability — pick whatever works best:\n\n[Calendly Link]\n\nLooking forward to connecting!`,
      }
    case 'follow-up-ticket':
      return { subject: '', body: '' }
  }
}

// ── Score snapshot display ────────────────────────────────────────────────────

function scoreColor(value: number) {
  if (value >= 70) return 'text-teal-600 dark:text-teal-400'
  if (value >= 50) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function scoreBg(value: number) {
  if (value >= 70) return 'bg-teal-50 border-teal-200 dark:bg-teal-950/30 dark:border-teal-800'
  if (value >= 50) return 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800'
  return 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'
}

const leadBadge: Record<LeadCheckInStatus, string> = {
  Growing: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
  Stable: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  Blocked: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
}

function ScoreCards({ snapshot }: { snapshot: ScoreSnapshot }) {
  const numericScores = [
    { label: 'Growth', value: snapshot.growth },
    { label: 'Delivery', value: snapshot.delivery },
    { label: 'Client', value: snapshot.clientSatisfaction },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {numericScores.map(({ label, value }) => (
        <div
          key={label}
          className={`flex flex-col items-center rounded-lg border px-3 py-1.5 ${scoreBg(value)}`}
        >
          <span
            className={`font-mono text-base font-bold leading-none ${scoreColor(value)}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {value}
          </span>
          <span className="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
            {label}
          </span>
        </div>
      ))}
      <div className="flex flex-col items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900">
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${leadBadge[snapshot.leadCheckIn]}`}
        >
          {snapshot.leadCheckIn}
        </span>
        <span className="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
          Lead
        </span>
      </div>
    </div>
  )
}

// ── Action type selector ─────────────────────────────────────────────────────

const actionTypes: {
  id: CreateActionType
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    id: 'email-reminder',
    label: 'Email Reminder',
    description: 'Friendly nudge with PR link',
    icon: Mail,
  },
  {
    id: 'burnout-survey',
    label: 'Burnout Survey',
    description: '3-question check-in (2 min)',
    icon: ClipboardList,
  },
  {
    id: 'quick-call',
    label: 'Quick Call',
    description: '15-min 1:1 + Calendly link',
    icon: Phone,
  },
  {
    id: 'follow-up-ticket',
    label: 'Follow-up Ticket',
    description: 'Create a Linear sub-ticket',
    icon: Tag,
  },
]

const pillars = ['Delivery', 'Growth', 'Client Satisfaction', 'Team Feedback']

// ── Modal ────────────────────────────────────────────────────────────────────

interface CreateActionModalProps {
  context: CreateActionModalContext | null
  onClose?: () => void
  onSubmit?: (data: CreateActionFormData, context: CreateActionModalContext) => void
}

export function CreateActionModal({ context, onClose, onSubmit }: CreateActionModalProps) {
  const isOpen = context !== null
  const isFollowup = context?.mode === 'followup'

  const defaultType: CreateActionType = isFollowup ? 'email-reminder' : 'email-reminder'
  const defaultDue = () => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    return d.toISOString().split('T')[0]
  }

  const [actionType, setActionType] = useState<CreateActionType>(defaultType)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState(defaultDue())
  const [pillar, setPillar] = useState<string>(context?.suggestedPillar ?? context?.previousActionPillar ?? '')

  // Reset form when context changes
  useEffect(() => {
    if (!context) return
    const template = getDefaultTemplate('email-reminder', context.engineerName, context.prInfo)
    setActionType('email-reminder')
    setEmailSubject(template.subject)
    setEmailBody(template.body)
    setDescription('')
    setDueDate(defaultDue())
    setPillar(context.suggestedPillar ?? context.previousActionPillar ?? '')
  }, [context?.engineerName, context?.mode])

  // Update template when action type changes
  useEffect(() => {
    if (!context) return
    const template = getDefaultTemplate(actionType, context.engineerName, context.prInfo)
    setEmailSubject(template.subject)
    setEmailBody(template.body)
  }, [actionType])

  const handleSubmit = () => {
    if (!context) return
    onSubmit?.(
      {
        actionType,
        emailSubject,
        emailBody,
        description,
        dueDate,
        pillar: pillar || null,
      },
      context
    )
    onClose?.()
  }

  const hasEmail = actionType !== 'follow-up-ticket'
  const submitLabel = hasEmail ? 'Send & Create Action' : 'Create Action'

  if (!isOpen || !context) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            {isFollowup && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                Follow-up
              </span>
            )}
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {isFollowup ? 'Create Follow-up Action' : 'Create Action'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ── Scrollable body ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Context panel ─────────────────────────────────── */}
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60">

            {/* Engineer */}
            <div className="mb-3 flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {context.engineerName.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {context.engineerName}
                </div>
                {context.engineerEmail && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {context.engineerEmail}
                  </div>
                )}
              </div>
              {context.patternName && (
                <span className="ml-auto rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                  {context.patternName}
                </span>
              )}
            </div>

            {/* PR info */}
            {context.prInfo && (
              <div className="mb-3 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                <GitPullRequest className="size-4 shrink-0 text-slate-400 dark:text-slate-500" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                    #{context.prInfo.prNumber} — {context.prInfo.prTitle}
                  </div>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                  <Clock className="size-2.5" />
                  {context.prInfo.hoursOpen}h open
                </span>
                {context.prInfo.prUrl && (
                  <a
                    href={context.prInfo.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-slate-400 transition-colors hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Score snapshot */}
            {context.scoreSnapshot && <ScoreCards snapshot={context.scoreSnapshot} />}

            {/* Previous action context (follow-up mode) */}
            {isFollowup && context.previousActionDescription && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <CornerDownRight className="size-3" />
                  Previous action
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  {context.previousActionDescription}
                </p>
                {context.previousActionNote && (
                  <p className="mt-1.5 text-xs italic text-amber-600 dark:text-amber-400">
                    Resolution: {context.previousActionNote}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── Form ──────────────────────────────────────────── */}
          <div className="space-y-5 px-5 py-5">

            {/* Action type selector */}
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Action type
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {actionTypes.map((type) => {
                  const Icon = type.icon
                  const active = actionType === type.id
                  return (
                    <button
                      key={type.id}
                      onClick={() => setActionType(type.id)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-all ${
                        active
                          ? 'border-teal-500 bg-teal-50 dark:border-teal-500 dark:bg-teal-950/40'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600'
                      }`}
                    >
                      <Icon
                        className={`size-4 ${active ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`}
                      />
                      <div>
                        <div
                          className={`text-[11px] font-semibold leading-tight ${active ? 'text-teal-800 dark:text-teal-200' : 'text-slate-700 dark:text-slate-300'}`}
                        >
                          {type.label}
                        </div>
                        <div className="mt-0.5 text-[10px] leading-tight text-slate-400 dark:text-slate-500">
                          {type.description}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Email section */}
            {hasEmail && (
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex items-center gap-2">
                  <Mail className="size-3.5 text-slate-400 dark:text-slate-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Email
                  </span>
                  {context.engineerEmail && (
                    <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-500">
                      To: {context.engineerEmail}
                    </span>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="mb-1 block text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-600 dark:focus:ring-teal-600"
                    placeholder="Email subject"
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="mb-1 block text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Message
                  </label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={6}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-600 dark:focus:ring-teal-600"
                    placeholder="Email body..."
                  />
                </div>
              </div>
            )}

            {/* Manager notes */}
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Manager notes
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-600 dark:focus:ring-teal-600"
                placeholder="What are you doing and what outcome do you expect?"
              />
            </div>

            {/* Due date + Pillar */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Due date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-teal-600 dark:focus:ring-teal-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Pillar
                </label>
                <div className="relative">
                  <select
                    value={pillar}
                    onChange={(e) => setPillar(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm text-slate-900 focus:border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-teal-600 dark:focus:ring-teal-600"
                  >
                    <option value="">— None</option>
                    {pillars.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-100 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            {hasEmail && <Mail className="size-3.5" />}
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
