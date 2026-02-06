import data from '@/../product/sections/needs-attention-and-actions/data.json'
import { NeedsAttention } from './components/NeedsAttention'

export default function NeedsAttentionPreview() {
  return (
    <NeedsAttention
      alerts={data.alerts as Parameters<typeof NeedsAttention>[0]['alerts']}
      actionItems={data.actionItems as Parameters<typeof NeedsAttention>[0]['actionItems']}
      timeline={data.timeline as Parameters<typeof NeedsAttention>[0]['timeline']}
      onViewAlertDetail={(id) => console.log('View alert detail:', id)}
      onAcknowledgeAlert={(id) => console.log('Acknowledge alert:', id)}
      onCreateAction={(id) => console.log('Create action from alert:', id)}
      onUpdateActionStatus={(id, status) => console.log('Update action status:', id, status)}
      onCompleteAction={(id, note) => console.log('Complete action:', id, note)}
      onFilterByStatus={(status) => console.log('Filter by status:', status)}
      onFilterByEngineer={(id) => console.log('Filter by engineer:', id)}
    />
  )
}
