import data from '@/../product/sections/portfolio-view/data.json'
import { PortfolioView } from './components/PortfolioView'

export default function PortfolioViewPreview() {
  return (
    <PortfolioView
      summaryStats={data.summaryStats}
      roster={data.roster as Parameters<typeof PortfolioView>[0]['roster']}
      pillarWeights={data.pillarWeights}
      trendGroups={data.trendGroups as Parameters<typeof PortfolioView>[0]['trendGroups']}
      filterOptions={data.filterOptions as Parameters<typeof PortfolioView>[0]['filterOptions']}
      currentPeriod={data.currentPeriod}
      previousPeriod={data.previousPeriod}
      onEngineerClick={(id) => console.log('Engineer clicked:', id)}
      onFilterChange={(filters) => console.log('Filter change:', filters)}
      onSearchChange={(query) => console.log('Search:', query)}
      onWeightChange={(pillarId, weight) => console.log('Weight change:', pillarId, weight)}
      onPeriodToggle={(period) => console.log('Period toggle:', period)}
      onSortChange={(column, direction) => console.log('Sort:', column, direction)}
    />
  )
}
