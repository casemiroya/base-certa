import { FeedbackState } from '@/lib/types'

interface OptionButtonProps {
  value: number
  feedback: FeedbackState
  isSelected: boolean
  isCorrect: boolean
  onClick: (value: number) => void
}

export default function OptionButton({
  value,
  feedback,
  isSelected,
  isCorrect,
  onClick,
}: OptionButtonProps) {
  const isDisabled = feedback !== 'idle'

  let className =
    'w-full py-4 px-6 rounded-xl text-lg font-semibold border-2 transition-all duration-200 text-left '

  if (feedback === 'idle') {
    className += 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer active:scale-95'
  } else if (isSelected && feedback === 'correct') {
    className += 'bg-green-500 border-green-500 text-white'
  } else if (isSelected && feedback === 'wrong') {
    className += 'bg-red-500 border-red-500 text-white'
  } else if (!isSelected && isCorrect && feedback === 'wrong') {
    className += 'bg-green-500 border-green-500 text-white'
  } else {
    className += 'bg-white border-slate-200 opacity-40 cursor-not-allowed'
  }

  return (
    <button
      className={className}
      onClick={() => !isDisabled && onClick(value)}
      disabled={isDisabled && !isSelected && !isCorrect}
    >
      <span className="flex items-center justify-between">
        <span>{value}</span>
        {feedback !== 'idle' && isSelected && feedback === 'correct' && (
          <span className="text-white font-bold">✓</span>
        )}
        {feedback !== 'idle' && isSelected && feedback === 'wrong' && (
          <span className="text-white font-bold">✗</span>
        )}
        {feedback === 'wrong' && !isSelected && isCorrect && (
          <span className="text-white font-bold">✓</span>
        )}
      </span>
    </button>
  )
}
