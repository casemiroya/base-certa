'use client'

import { GameMode } from '@/lib/types'
import { MODE_GROUPS } from '@/lib/constants'

interface HomeScreenProps {
  onSelectMode: (mode: GameMode) => void
}

export default function HomeScreen({ onSelectMode }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-2">Base Certa</h1>
          <p className="text-slate-500 text-base">Pratique matemática de forma leve e rápida</p>
        </div>

        <div className="flex flex-col gap-6">
          {MODE_GROUPS.map((group) => (
            <div key={group.id}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">
                {group.label}
              </h2>
              <div className="flex flex-col gap-2">
                {group.modes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onSelectMode(m.id)}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-blue-400 hover:bg-blue-50 transition-all active:scale-95"
                  >
                    <span className="text-2xl font-bold text-blue-500 w-8 text-center">
                      {m.icon}
                    </span>
                    <span className="text-base font-semibold text-slate-700">{m.label}</span>
                    <span className="ml-auto text-slate-300 text-sm">→</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-10">
          Uma ferramenta Pai MOVIDO
        </p>
      </div>
    </div>
  )
}
