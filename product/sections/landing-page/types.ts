export interface Pillar {
  id: string
  title: string
  description: string
  icon: string
  metrics: string[]
}

export interface PersonaCard {
  id: string
  role: 'engineer' | 'lead' | 'partner'
  title: string
  description: string
  capabilities: string[]
}

export interface Stat {
  id: string
  value: string
  label: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
}

export interface LandingPageProps {
  heroHeadline: string
  heroSubheadline: string
  heroCtaLabel: string
  problemStatement: string
  pillars: Pillar[]
  transparencyHeadline: string
  transparencyDescription: string
  personas: PersonaCard[]
  stats: Stat[]
  testimonials: Testimonial[]
  footerCtaLabel: string
  onCtaClick?: () => void
  onDemoRequest?: () => void
}
