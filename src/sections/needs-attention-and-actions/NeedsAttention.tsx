import data from '@/../product/sections/needs-attention-and-actions/data.json'
import { NeedsAttention } from './components/NeedsAttention'
import type { NeedsAttentionProps } from '@/../product/sections/needs-attention-and-actions/types'

export default function NeedsAttentionPreview() {
  const typedData = data as unknown as {
    alerts: NeedsAttentionProps['alerts']
    actionItems: NeedsAttentionProps['actionItems']
    timeline: NeedsAttentionProps['timeline']
    effectivenessData: NeedsAttentionProps['effectivenessData']
  }

  return (
    <NeedsAttention
      alerts={typedData.alerts}
      actionItems={typedData.actionItems}
      timeline={typedData.timeline}
      effectivenessData={typedData.effectivenessData}
      onViewAlertDetail={(id) => console.log('View alert detail:', id)}
      onAcknowledgeAlert={(id) => console.log('Acknowledge alert:', id)}
      onCreateAction={(id) => console.log('Create action from alert:', id)}
      onUpdateActionStatus={(id, status) => console.log('Update action status:', id, status)}
      onCompleteAction={(id, note) => console.log('Complete action:', id, note)}
      onFilterByStatus={(status) => console.log('Filter by status:', status)}
      onFilterByEngineer={(id) => console.log('Filter by engineer:', id)}
      onViewEffectiveness={(id) => console.log('View effectiveness:', id)}
      onCreateFollowUpAction={(id) => console.log('Create follow-up action:', id)}
      onSubmitAction={(data, ctx) => console.log('Submit action:', data, ctx)}
    />
  )
}
