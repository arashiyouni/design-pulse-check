import data from '@/../product/sections/landing-page/data.json'
import type { PersonaCard } from '@/../product/sections/landing-page/types'
import { LandingPage } from './components/LandingPage'

export default function LandingPagePreview() {
  return (
    <LandingPage
      heroHeadline={data.heroHeadline}
      heroSubheadline={data.heroSubheadline}
      heroCtaLabel={data.heroCtaLabel}
      problemStatement={data.problemStatement}
      pillars={data.pillars}
      transparencyHeadline={data.transparencyHeadline}
      transparencyDescription={data.transparencyDescription}
      personas={data.personas as PersonaCard[]}
      stats={data.stats}
      testimonials={data.testimonials}
      footerCtaLabel={data.footerCtaLabel}
      onCtaClick={() => console.log('CTA clicked')}
      onDemoRequest={() => console.log('Demo requested')}
    />
  )
}
