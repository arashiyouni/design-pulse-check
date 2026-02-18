import { useState } from 'react'
import type { Organization } from '@/../product/sections/project-settings/types'
import { X, Building2, Zap, Users, ChevronRight, ChevronLeft, Check, Plus, Search } from 'lucide-react'

interface CreateProjectWizardProps {
  organizations: Organization[]
  isOpen: boolean
  onClose: () => void
  onCreate?: (project: {
    name: string
    organizationId: string | null
    type: 'client' | 'internal'
    description?: string
    engineerIds?: string[]
    leadEngineerId?: string
  }) => void
}

type WizardStep = 1 | 2 | 3

const stepLabels: Record<WizardStep, { title: string; subtitle: string }> = {
  1: { title: 'Project Details', subtitle: 'Name and organization' },
  2: { title: 'Team', subtitle: 'Assign engineers' },
  3: { title: 'Integrations', subtitle: 'Connect tools' },
}

export function CreateProjectWizard({ organizations, isOpen, onClose, onCreate }: CreateProjectWizardProps) {
  const [step, setStep] = useState<WizardStep>(1)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [projectType, setProjectType] = useState<'client' | 'internal'>('client')
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
  const [orgSearch, setOrgSearch] = useState('')

  if (!isOpen) return null

  const selectedOrg = organizations.find((o) => o.id === selectedOrgId)
  const filteredOrgs = organizations.filter((o) =>
    o.name.toLowerCase().includes(orgSearch.toLowerCase())
  )

  const canProceed = name.trim().length > 0 && (projectType === 'internal' || selectedOrgId !== null)

  const handleCreate = () => {
    onCreate?.({
      name: name.trim(),
      organizationId: projectType === 'internal' ? null : selectedOrgId,
      type: projectType,
      description: description.trim() || undefined,
    })
    // Reset state
    setStep(1)
    setName('')
    setDescription('')
    setProjectType('client')
    setSelectedOrgId(null)
    setOrgSearch('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              New Project
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Step {step} of 3 &middot; {stepLabels[step].subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex gap-1.5 px-6 pt-4">
          {([1, 2, 3] as WizardStep[]).map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step
                  ? 'bg-teal-500 dark:bg-teal-400'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {step === 1 && (
            <div className="space-y-5">
              {/* Project name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Acme Marketplace Rebuild"
                  autoFocus
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-500 dark:focus:ring-teal-500/20"
                />
              </div>

              {/* Project type toggle */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setProjectType('client')}
                    className={`flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${
                      projectType === 'client'
                        ? 'border-teal-500 bg-teal-50/50 shadow-sm dark:border-teal-400 dark:bg-teal-950/20'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className={`flex size-10 items-center justify-center rounded-lg ${
                      projectType === 'client'
                        ? 'bg-teal-100 dark:bg-teal-900/50'
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      <Building2 className={`size-5 ${
                        projectType === 'client'
                          ? 'text-teal-600 dark:text-teal-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`} />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${
                        projectType === 'client'
                          ? 'text-teal-700 dark:text-teal-300'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        Client
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        External engagement
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setProjectType('internal')
                      setSelectedOrgId(null)
                    }}
                    className={`flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${
                      projectType === 'internal'
                        ? 'border-amber-500 bg-amber-50/50 shadow-sm dark:border-amber-400 dark:bg-amber-950/20'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className={`flex size-10 items-center justify-center rounded-lg ${
                      projectType === 'internal'
                        ? 'bg-amber-100 dark:bg-amber-900/50'
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      <Zap className={`size-5 ${
                        projectType === 'internal'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`} />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${
                        projectType === 'internal'
                          ? 'text-amber-700 dark:text-amber-300'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        Internal
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Ravn initiative
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Organization selector (only for client) */}
              {projectType === 'client' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Client Organization <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={selectedOrg ? selectedOrg.name : orgSearch}
                      onChange={(e) => {
                        setOrgSearch(e.target.value)
                        setSelectedOrgId(null)
                      }}
                      placeholder="Search organizations..."
                      className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-500 dark:focus:ring-teal-500/20"
                    />
                  </div>
                  {!selectedOrg && (orgSearch || !selectedOrgId) && (
                    <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                      {filteredOrgs.length === 0 ? (
                        <div className="px-3 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                          No organizations found
                        </div>
                      ) : (
                        filteredOrgs.map((org) => (
                          <button
                            key={org.id}
                            onClick={() => {
                              setSelectedOrgId(org.id)
                              setOrgSearch('')
                            }}
                            className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
                          >
                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                              <Building2 className="size-4 text-slate-500 dark:text-slate-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900 dark:text-white">
                                {org.name}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {org.industry} &middot; {org.projectCount} project{org.projectCount !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Description (optional) */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description <span className="text-xs text-slate-400 dark:text-slate-500">Optional</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the project scope..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-500 dark:focus:ring-teal-500/20"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-200/80 dark:bg-slate-700">
                  <Users className="size-6 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">
                  Assign Team Members
                </h3>
                <p className="mx-auto max-w-xs text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Select engineers to assign to this project and designate a project lead. You can always add or change team members later in project settings.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600">
                    <Plus className="size-3.5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div className="flex size-8 items-center justify-center rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600">
                    <Plus className="size-3.5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div className="flex size-8 items-center justify-center rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600">
                    <Plus className="size-3.5 text-slate-400 dark:text-slate-500" />
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                Team assignment will be available after the project is created.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              {/* GitHub */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-slate-900 dark:bg-white">
                    <svg className="size-5 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">GitHub</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Repository tracking & PR metrics</div>
                  </div>
                </div>
                <button className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                  Connect
                </button>
              </div>

              {/* Jira */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600">
                    <svg className="size-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.571 11.513H0a5.218 5.218 0 005.232 5.215h2.13v2.057A5.215 5.215 0 0012.575 24V12.518a1.005 1.005 0 00-1.005-1.005z" />
                      <path d="M5.024 5.958H16.59a5.218 5.218 0 00-5.232-5.215H9.228V-1.314A5.215 5.215 0 004.019 4.958v.995a1.005 1.005 0 001.005 1.005z" opacity=".65" />
                      <path d="M16.59 5.958a5.218 5.218 0 00-5.232 5.215v2.057a5.215 5.215 0 005.215 5.257V6.963a1.005 1.005 0 00-1.005-1.005H16.59z" opacity=".35" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">Jira</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Ticket tracking & sprint metrics</div>
                  </div>
                </div>
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  Coming soon
                </span>
              </div>

              {/* Linear */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-violet-600">
                    <svg className="size-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.088 15.32a11.998 11.998 0 006.592 6.592L2.088 15.32zM1.003 12.96a12.02 12.02 0 001.517 5.243l6.72 6.72A12.02 12.02 0 0014.48 26.44L1.003 12.96zM3.47 6.23A12 12 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0a12 12 0 00-8.53 3.53l14.06 14.06A7.5 7.5 0 1012 4.5a7.48 7.48 0 00-5.34 2.22L3.47 6.23z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">Linear</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Issue tracking & cycle metrics</div>
                  </div>
                </div>
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  Coming soon
                </span>
              </div>

              <p className="pt-1 text-center text-xs text-slate-400 dark:text-slate-500">
                You can connect integrations anytime from project settings.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep((step - 1) as WizardStep)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="size-4" />
                Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {step < 3 && step > 1 && (
              <button
                onClick={() => setStep((step + 1) as WizardStep)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              >
                Skip
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 1 && canProceed) {
                    setStep(2)
                  } else if (step > 1) {
                    setStep((step + 1) as WizardStep)
                  }
                }}
                disabled={step === 1 && !canProceed}
                className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-teal-500 dark:hover:bg-teal-600"
              >
                Next
                <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                onClick={handleCreate}
                className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
              >
                <Check className="size-4" />
                Create Project
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
