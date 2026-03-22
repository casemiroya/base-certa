'use client'

import { FeedbackState, Question } from '@/lib/types'
import OptionButton from './OptionButton'
import ProgressBar from './ProgressBar'
import { QUESTIONS_PER_ROUND } from '@/lib/constants'

interface GameScreenProps {
  question: Question
  currentIndex: number
  score: number
  feedback: FeedbackState
  selectedOption: number | null
  onSelect: (value: number) => void
  onNext: () => void
  onHome: () => void
}

export default function GameScreen({
  question,
  currentIndex,
  score,
  feedback,
  selectedOption,
  onSelect,
  onNext,
  onHome,
}: GameScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onHome}
            className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
          >
            ← Início
          </button>
          <span className="text-sm font-semibold text-slate-500">
            Questão {currentIndex + 1} de {QUESTIONS_PER_ROUND}
          </span>
          <span className="text-sm font-bold text-blue-600">{score} pts</span>
        </div>

        {/* Progress */}
        <ProgressBar current={currentIndex + (feedback !== 'idle' ? 1 : 0)} total={QUESTIONS_PER_ROUND} />

        {/* Question */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 text-center">
          <p className="text-3xl font-extrabold text-slate-800 tracking-wide">{question.text}</p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {question.options.map((opt) => (
            <OptionButton
              key={opt}
              value={opt}
              feedback={feedback}
              isSelected={selectedOption === opt}
              isCorrect={opt === question.correct}
              onClick={onSelect}
            />
          ))}
        </div>

        {/* Explanation on wrong answer */}
        {feedback === 'wrong' && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl px-5 py-4">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Entenda o erro</p>
            <p className="text-sm text-amber-900 font-medium">{question.explanation}</p>
          </div>
        )}

        {/* Next button */}
        <button
          onClick={onNext}
          disabled={feedback === 'idle'}
          className={`w-full py-4 rounded-xl text-base font-bold transition-all ${
            feedback === 'idle'
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          }`}
        >
          {currentIndex === QUESTIONS_PER_ROUND - 1 ? 'Ver resultado' : 'Próxima →'}
        </button>
      </div>
    </div>
  )
}
