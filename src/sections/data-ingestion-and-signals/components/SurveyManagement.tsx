import type { SurveyCampaign, SurveyResponse } from '@/../product/sections/data-ingestion-and-signals/types'
import { Send, Eye, FileText, Plus, Star } from 'lucide-react'

const statusBadge: Record<string, { bg: string; text: string; label: string }> = {
  draft: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    label: 'Draft',
  },
  sent: {
    bg: 'bg-amber-100 dark:bg-amber-950',
    text: 'text-amber-700 dark:text-amber-300',
    label: 'Sent',
  },
  completed: {
    bg: 'bg-teal-100 dark:bg-teal-950',
    text: 'text-teal-700 dark:text-teal-300',
    label: 'Completed',
  },
}

interface SurveyManagementProps {
  campaigns: SurveyCampaign[]
  recentResponses: SurveyResponse[]
  onCreateSurvey?: () => void
  onSendSurvey?: (id: string) => void
}

export function SurveyManagement({ campaigns, recentResponses, onCreateSurvey, onSendSurvey }: SurveyManagementProps) {
  const formatDate = (iso: string | null) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const renderStars = (score: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`size-3 ${s <= score ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}
        />
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header with create button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Survey Campaigns</h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {campaigns.length} campaigns · {campaigns.filter((c) => c.status === 'sent').length} active
          </p>
        </div>
        <button
          onClick={onCreateSurvey}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
        >
          <Plus className="size-3" />
          New Campaign
        </button>
      </div>

      {/* Campaign cards */}
      <div className="space-y-3">
        {campaigns.map((campaign) => {
          const badge = statusBadge[campaign.status]
          return (
            <div
              key={campaign.id}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <FileText className="size-4 text-slate-400 dark:text-slate-500" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{campaign.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>{campaign.engineerCount} engineers</span>
                    <span>{campaign.responseCount} responses</span>
                    {campaign.responseRate > 0 && (
                      <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                        {campaign.responseRate}% rate
                      </span>
                    )}
                    {campaign.sentAt && <span>Sent: {formatDate(campaign.sentAt)}</span>}
                    {campaign.completedAt && <span>Completed: {formatDate(campaign.completedAt)}</span>}
                  </div>

                  {/* Progress bar for sent campaigns */}
                  {campaign.status === 'sent' && (
                    <div className="mt-3">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-teal-500 transition-all dark:bg-teal-400"
                          style={{ width: `${campaign.responseRate}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 gap-1.5">
                  {campaign.status === 'draft' && (
                    <button
                      onClick={() => onSendSurvey?.(campaign.id)}
                      className="flex items-center gap-1 rounded-lg bg-teal-50 px-2.5 py-1.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-950/60"
                    >
                      <Send className="size-3" />
                      Send
                    </button>
                  )}
                  {campaign.status !== 'draft' && (
                    <button className="flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
                      <Eye className="size-3" />
                      View
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent responses */}
      {recentResponses.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Recent Responses</h3>
          <div className="space-y-2">
            {recentResponses.map((response) => (
              <div
                key={response.id}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{response.engineerName}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {formatDate(response.submittedAt)}
                  </span>
                </div>
                <div className="mb-2 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">NPS</span>
                    {renderStars(response.nps)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">CSAT</span>
                    {renderStars(response.csat)}
                  </div>
                </div>
                {response.feedback && (
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    &ldquo;{response.feedback}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
