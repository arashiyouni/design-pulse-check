import type { LandingPageProps } from '@/../product/sections/landing-page/types'
import { Activity, ArrowRight, Quote } from 'lucide-react'
import { PillarCard } from './PillarCard'
import { PersonaSection } from './PersonaSection'

export function LandingPage({
  heroHeadline,
  heroSubheadline,
  heroCtaLabel,
  problemStatement,
  pillars,
  transparencyHeadline,
  transparencyDescription,
  personas,
  stats,
  testimonials,
  footerCtaLabel,
  onCtaClick,
  onDemoRequest,
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] dark:bg-slate-950">
      {/* ── Sticky Nav ────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-teal-500">
              <Activity className="size-4.5 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
              Pulse Check
            </span>
          </div>
          <button
            onClick={() => onDemoRequest?.()}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-teal-700 hover:shadow-md hover:shadow-teal-500/20 active:scale-[0.98] dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            {heroCtaLabel}
          </button>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-14">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-teal-50/50 via-white to-white dark:from-teal-950/20 dark:via-slate-950 dark:to-slate-950" />
        <div className="absolute top-20 left-1/2 -z-10 -translate-x-1/2 size-[600px] rounded-full bg-teal-100/30 blur-3xl dark:bg-teal-900/10" />

        <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-32 lg:py-40">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300">
            <Activity className="size-3.5" />
            Engineering Health Platform
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
            {heroHeadline}
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl dark:text-slate-400">
            {heroSubheadline}
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => onCtaClick?.()}
              className="group flex items-center gap-2 rounded-xl bg-teal-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-500/30 active:scale-[0.98] dark:bg-teal-500 dark:shadow-teal-500/15 dark:hover:bg-teal-400"
            >
              {heroCtaLabel}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => onDemoRequest?.()}
              className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
            >
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* ── The Problem ───────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50/50 dark:border-slate-800/50 dark:bg-slate-900/30">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 sm:py-20">
          <span className="mb-4 inline-block font-mono text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            The Problem
          </span>
          <p className="text-xl leading-relaxed text-slate-700 sm:text-2xl dark:text-slate-300">
            {problemStatement}
          </p>
        </div>
      </section>

      {/* ── 4 Pillars ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block font-mono text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            The Signal Model
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Four pillars. One score.
          </h2>
          <p className="mx-auto max-w-xl text-base text-slate-600 dark:text-slate-400">
            Every engineer gets a Composite Pulse Score built from four independent signal sources — quantitative and qualitative, automated and human.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {pillars.map((pillar, index) => (
            <PillarCard key={pillar.id} pillar={pillar} index={index} />
          ))}
        </div>
      </section>

      {/* ── Transparency ──────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-600 to-teal-800 dark:from-teal-800 dark:to-teal-950" />
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute top-0 right-0 size-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 size-80 rounded-full bg-teal-300/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 sm:py-28">
          {/* Icon */}
          <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Activity className="size-7 text-white" />
          </div>

          <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {transparencyHeadline}
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-teal-100/90">
            {transparencyDescription}
          </p>

          {/* Visual accent line */}
          <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-teal-300/50 to-transparent" />
        </div>
      </section>

      {/* ── Personas ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block font-mono text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Built For Everyone
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            One platform, three perspectives
          </h2>
          <p className="mx-auto max-w-xl text-base text-slate-600 dark:text-slate-400">
            Engineers, leads, and partners each get a tailored experience — but everyone sees the same data.
          </p>
        </div>

        <PersonaSection personas={personas} />
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50/50 dark:border-slate-800/50 dark:bg-slate-900/30">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="mb-2 font-mono text-3xl font-bold text-teal-600 sm:text-4xl dark:text-teal-400">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="relative rounded-2xl border border-slate-200/60 bg-white p-7 sm:p-8 dark:border-slate-800/60 dark:bg-slate-900"
              >
                <Quote className="mb-4 size-8 text-teal-200 dark:text-teal-900" />
                <blockquote className="mb-5 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 font-mono text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {testimonial.author.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {testimonial.author}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Footer CTA ────────────────────────────────────────── */}
      <section className="border-t border-slate-100 dark:border-slate-800/50">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Ready to see your team&apos;s pulse?
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-base text-slate-600 dark:text-slate-400">
            Replace gut feel with real signals. Give your engineers transparency and your leaders clarity.
          </p>
          <button
            onClick={() => onCtaClick?.()}
            className="group inline-flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-500/30 active:scale-[0.98] dark:bg-teal-500 dark:shadow-teal-500/15 dark:hover:bg-teal-400"
          >
            {footerCtaLabel}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-slate-50/50 dark:border-slate-800/50 dark:bg-slate-900/30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex size-5 items-center justify-center rounded bg-teal-500">
              <Activity className="size-3 text-white" />
            </div>
            Pulse Check
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} Ravn. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
