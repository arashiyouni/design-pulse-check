import { useState } from 'react'
import type { SurveyCampaign, SurveyResponse } from '@/../product/sections/data-ingestion-and-signals/types'
import { Send, Eye, FileText, Plus, Star, ChevronUp } from 'lucide-react'
import { SurveyCampaignModal } from './SurveyCampaignModal'

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
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [viewingCampaignId, setViewingCampaignId] = useState<string | null>(null)

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

  const handleCreateCampaign = (data: {
    name: string
    period: string
    template: string
    questions: unknown[]
  }) => {
    console.log('Creating campaign with data:', data)
    onCreateSurvey?.()
    setShowCampaignModal(false)
  }

  // Get responses associated with a campaign (by matching period)
  const getCampaignResponses = (campaign: SurveyCampaign) => {
    return recentResponses.filter((r) => {
      if (!campaign.sentAt) return false
      const campaignDate = new Date(campaign.sentAt)
      const responseDate = new Date(r.submittedAt)
      // Match responses within the campaign's active period
      return responseDate >= campaignDate && (
        !campaign.completedAt || responseDate <= new Date(campaign.completedAt)
      )
    })
  }

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
          onClick={() => setShowCampaignModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
        >
          <Plus className="size-3" />
          New Campaign
        </button>
      </div>

      {/* Survey Campaign Modal */}
      <SurveyCampaignModal
        isOpen={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        onCreate={handleCreateCampaign}
      />

      {/* Campaign cards */}
      <div className="space-y-3">
        {campaigns.map((campaign) => {
          const badge = statusBadge[campaign.status]
          const isViewing = viewingCampaignId === campaign.id
          const campaignResponses = isViewing ? getCampaignResponses(campaign) : []

          return (
            <div
              key={campaign.id}
              className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="p-4">
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
                      <button
                        onClick={() => setViewingCampaignId(isViewing ? null : campaign.id)}
                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                          isViewing
                            ? 'bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-950/60'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isViewing ? <ChevronUp className="size-3" /> : <Eye className="size-3" />}
                        {isViewing ? 'Hide' : 'View'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded detail panel */}
              {isViewing && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                  {/* Stats row */}
                  <div className="mb-4 flex flex-wrap gap-3">
                    <div className="rounded-lg bg-white px-3 py-2 dark:bg-slate-800">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Engineers</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{campaign.engineerCount}</p>
                    </div>
                    <div className="rounded-lg bg-white px-3 py-2 dark:bg-slate-800">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Responses</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{campaign.responseCount}</p>
                    </div>
                    <div className="rounded-lg bg-white px-3 py-2 dark:bg-slate-800">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Rate</p>
                      <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{campaign.responseRate}%</p>
                    </div>
                  </div>

                  {/* Recent responses for this campaign */}
                  {campaignResponses.length > 0 ? (
                    <div>
                      <h4 className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-300">Recent Responses</h4>
                      <div className="space-y-2">
                        {campaignResponses.map((response) => (
                          <div
                            key={response.id}
                            className="rounded-lg bg-white p-3 dark:bg-slate-800"
                          >
                            <div className="mb-1.5 flex items-center justify-between">
                              <span className="text-xs font-medium text-slate-900 dark:text-white">{response.engineerName}</span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">{formatDate(response.submittedAt)}</span>
                            </div>
                            <div className="mb-1.5 flex items-center gap-4">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">NPS</span>
                                {renderStars(response.nps)}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">CSAT</span>
                                {renderStars(response.csat)}
                              </div>
                            </div>
                            {response.feedback && (
                              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                &ldquo;{response.feedback}&rdquo;
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500">No responses to display for this campaign.</p>
                  )}
                </div>
              )}
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
