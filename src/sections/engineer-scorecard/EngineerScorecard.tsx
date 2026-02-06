import data from '@/../product/sections/engineer-scorecard/data.json'
import { EngineerScorecard } from './components/EngineerScorecard'

export default function EngineerScorecardPreview() {
  return (
    <EngineerScorecard
      engineer={data.engineer as Parameters<typeof EngineerScorecard>[0]['engineer']}
      pulseScore={data.pulseScore as Parameters<typeof EngineerScorecard>[0]['pulseScore']}
      periodComparison={data.periodComparison as Parameters<typeof EngineerScorecard>[0]['periodComparison']}
      timeline={data.timeline as Parameters<typeof EngineerScorecard>[0]['timeline']}
      onPeriodChange={(period) => console.log('Period change:', period)}
      onExpandPillar={(pillarId) => console.log('Expand pillar:', pillarId)}
      onTimelineEventClick={(eventId) => console.log('Timeline event:', eventId)}
    />
  )
}
