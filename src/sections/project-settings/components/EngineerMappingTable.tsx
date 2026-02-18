import { useState } from 'react'
import type { EngineerGitHubMapping } from '@/../product/sections/project-settings/types'

interface EngineerMappingTableProps {
  engineerMappings: EngineerGitHubMapping[]
  onUpdateMapping?: (engineerId: string, githubUsername: string) => void
}

function EngineerRow({
  mapping,
  onUpdate
}: {
  mapping: EngineerGitHubMapping
  onUpdate?: (engineerId: string, githubUsername: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(mapping.githubUsername || '')

  const handleSave = () => {
    if (username.trim()) {
      onUpdate?.(mapping.engineerId, username.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setUsername(mapping.githubUsername || '')
    setIsEditing(false)
  }

  const levelColors = {
    Junior: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    Mid: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    Senior: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    Staff: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
  }

  return (
    <div className="group grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors bg-white dark:bg-slate-900">
      {/* Engineer Info */}
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
          {mapping.engineerName.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
            {mapping.engineerName}
          </h3>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${levelColors[mapping.engineerLevel]}`}>
            {mapping.engineerLevel}
          </span>
        </div>
      </div>

      {/* GitHub Username */}
      <div className="flex items-center">
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="github-username"
              className="flex-1 px-3 py-1.5 text-sm font-mono rounded-lg border-2 border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') handleCancel()
              }}
            />
          </div>
        ) : mapping.githubUsername ? (
          <div className="flex items-center gap-2">
            <a
              href={`https://github.com/${mapping.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group/link"
            >
              <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              <span className="font-mono text-sm text-slate-900 dark:text-slate-100">
                {mapping.githubUsername}
              </span>
              <svg className="w-3 h-3 text-slate-400 group-hover/link:text-slate-600 dark:group-hover/link:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            {mapping.isAutoMatched && (
              <span className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Auto-matched
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm text-slate-400 dark:text-slate-600 italic">
            Not mapped
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:justify-end">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
        )}
      </div>
    </div>
  )
}

export function EngineerMappingTable({ engineerMappings, onUpdateMapping }: EngineerMappingTableProps) {
  const mappedEngineers = engineerMappings.filter(m => m.githubUsername)
  const unmappedEngineers = engineerMappings.filter(m => !m.githubUsername)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Engineer Mapping
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
          {mappedEngineers.length} mapped • {unmappedEngineers.length} unmapped
        </p>
      </div>

      {/* Mapped Engineers */}
      {mappedEngineers.length > 0 && (
        <div className="space-y-2">
          {mappedEngineers.map(mapping => (
            <EngineerRow
              key={mapping.id}
              mapping={mapping}
              onUpdate={onUpdateMapping}
            />
          ))}
        </div>
      )}

      {/* Unmapped Engineers */}
      {unmappedEngineers.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-2">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">
              Needs Mapping
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>
          {unmappedEngineers.map(mapping => (
            <EngineerRow
              key={mapping.id}
              mapping={mapping}
              onUpdate={onUpdateMapping}
            />
          ))}
        </div>
      )}
    </div>
  )
}
