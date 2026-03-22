'use client'

import { useState } from 'react'
import { DifficultyLevel, GameMode } from '@/lib/types'
import { useGameSession } from '@/hooks/useGameSession'
import HomeScreen from '@/components/HomeScreen'
import DifficultyScreen from '@/components/DifficultyScreen'
import GameScreen from '@/components/GameScreen'
import ResultScreen from '@/components/ResultScreen'

type Screen = 'home' | 'difficulty' | 'game' | 'result'

export default function Page() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null)

  const {
    mode,
    level,
    currentIndex,
    score,
    feedback,
    selectedOption,
    finished,
    currentQuestion,
    startGame,
    selectOption,
    nextQuestion,
    resetGame,
  } = useGameSession()

  function handleSelectMode(m: GameMode) {
    setSelectedMode(m)
    setScreen('difficulty')
  }

  function handleSelectLevel(l: DifficultyLevel) {
    startGame(selectedMode!, l)
    setScreen('game')
  }

  function handleHome() {
    resetGame()
    setSelectedMode(null)
    setScreen('home')
  }

  function handlePlayAgain() {
    if (mode && level) {
      startGame(mode, level)
      setScreen('game')
    }
  }

  // Transition to result when game finishes
  if (screen === 'game' && finished) {
    return (
      <ResultScreen
        mode={mode!}
        level={level!}
        score={score}
        onPlayAgain={handlePlayAgain}
        onHome={handleHome}
      />
    )
  }

  if (screen === 'home') {
    return <HomeScreen onSelectMode={handleSelectMode} />
  }

  if (screen === 'difficulty' && selectedMode) {
    return (
      <DifficultyScreen
        mode={selectedMode}
        onSelectLevel={handleSelectLevel}
        onBack={() => setScreen('home')}
      />
    )
  }

  if (screen === 'game' && currentQuestion) {
    return (
      <GameScreen
        question={currentQuestion}
        currentIndex={currentIndex}
        score={score}
        feedback={feedback}
        selectedOption={selectedOption}
        onSelect={selectOption}
        onNext={nextQuestion}
        onHome={handleHome}
      />
    )
  }

  return null
}
