'use client'

import { useState, useCallback, useRef } from 'react'
import { DifficultyLevel, FeedbackState, GameMode, Question } from '@/lib/types'
import { generateSession } from '@/lib/gameEngine'
import { saveResult } from '@/lib/storage'
import { QUESTIONS_PER_ROUND } from '@/lib/constants'

export function useGameSession() {
  const [mode, setMode] = useState<GameMode | null>(null)
  const [level, setLevel] = useState<DifficultyLevel | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<FeedbackState>('idle')
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const scoreRef = useRef(0)
  const modeRef = useRef<GameMode | null>(null)
  const levelRef = useRef<DifficultyLevel | null>(null)

  const startGame = useCallback((selectedMode: GameMode, selectedLevel: DifficultyLevel) => {
    const newQuestions = generateSession(selectedMode, selectedLevel)
    scoreRef.current = 0
    modeRef.current = selectedMode
    levelRef.current = selectedLevel
    setMode(selectedMode)
    setLevel(selectedLevel)
    setQuestions(newQuestions)
    setCurrentIndex(0)
    setSelectedOption(null)
    setFeedback('idle')
    setScore(0)
    setFinished(false)
  }, [])

  const selectOption = useCallback(
    (value: number) => {
      if (feedback !== 'idle' || questions.length === 0) return
      const correct = questions[currentIndex].correct
      const isCorrect = value === correct
      setSelectedOption(value)
      setFeedback(isCorrect ? 'correct' : 'wrong')
      if (isCorrect) {
        scoreRef.current += 1
        setScore(scoreRef.current)
      }
    },
    [feedback, questions, currentIndex]
  )

  const nextQuestion = useCallback(() => {
    if (feedback === 'idle') return
    if (currentIndex === QUESTIONS_PER_ROUND - 1) {
      saveResult(modeRef.current!, levelRef.current!, scoreRef.current)
      setFinished(true)
    } else {
      setCurrentIndex((i) => i + 1)
      setSelectedOption(null)
      setFeedback('idle')
    }
  }, [feedback, currentIndex])

  const resetGame = useCallback(() => {
    scoreRef.current = 0
    modeRef.current = null
    levelRef.current = null
    setMode(null)
    setLevel(null)
    setQuestions([])
    setCurrentIndex(0)
    setSelectedOption(null)
    setFeedback('idle')
    setScore(0)
    setFinished(false)
  }, [])

  return {
    mode,
    level,
    questions,
    currentIndex,
    selectedOption,
    feedback,
    score,
    finished,
    currentQuestion: questions[currentIndex] ?? null,
    startGame,
    selectOption,
    nextQuestion,
    resetGame,
  }
}
