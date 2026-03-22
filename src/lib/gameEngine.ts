import { DifficultyLevel, GameMode, Question } from './types'
import { QUESTIONS_PER_ROUND } from './constants'

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randIntExcluding(min: number, max: number, excluded: number[]): number {
  let val: number
  do {
    val = randInt(min, max)
  } while (excluded.includes(val))
  return val
}

function formatNumber(n: number): string {
  if (n < 0) return `(${n})`
  return String(n)
}

function generateOptions(correct: number, spread: number): number[] {
  const candidates = new Set<number>()
  let attempts = 0

  while (candidates.size < 3 && attempts < 100) {
    attempts++
    const offset = randIntExcluding(-spread, spread, [0])
    const candidate = correct + offset
    if (candidate !== correct) candidates.add(candidate)
  }

  const fallbackOffsets = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6]
  for (const offset of fallbackOffsets) {
    if (candidates.size >= 3) break
    const candidate = correct + offset
    if (candidate !== correct) candidates.add(candidate)
  }

  const options = [correct, ...Array.from(candidates).slice(0, 3)]

  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[options[i], options[j]] = [options[j], options[i]]
  }

  return options
}

// Ranges per difficulty
type Range = { min: number; max: number }

function getBasicAddRange(level: DifficultyLevel): Range {
  if (level === 'beginner') return { min: 1, max: 10 }
  if (level === 'intermediate') return { min: 1, max: 20 }
  return { min: 1, max: 50 }
}

function getBasicSubRange(level: DifficultyLevel): number {
  if (level === 'beginner') return 15
  if (level === 'intermediate') return 30
  return 100
}

function getBasicMulRange(level: DifficultyLevel): { a: Range; b: Range } {
  if (level === 'beginner') return { a: { min: 2, max: 5 }, b: { min: 2, max: 5 } }
  if (level === 'intermediate') return { a: { min: 2, max: 12 }, b: { min: 2, max: 9 } }
  return { a: { min: 2, max: 15 }, b: { min: 2, max: 12 } }
}

function getBasicDivRange(level: DifficultyLevel): { q: Range; d: Range } {
  if (level === 'beginner') return { q: { min: 1, max: 5 }, d: { min: 2, max: 5 } }
  if (level === 'intermediate') return { q: { min: 1, max: 10 }, d: { min: 2, max: 10 } }
  return { q: { min: 1, max: 20 }, d: { min: 2, max: 12 } }
}

function getTabuadaRange(level: DifficultyLevel): number {
  if (level === 'beginner') return 5
  if (level === 'intermediate') return 10
  return 12
}

function getIntRange(level: DifficultyLevel): number {
  if (level === 'beginner') return 5
  if (level === 'intermediate') return 10
  return 20
}

function getSpread(level: DifficultyLevel, base: number): number {
  if (level === 'beginner') return Math.max(3, Math.floor(base * 0.3))
  if (level === 'intermediate') return Math.max(5, Math.floor(base * 0.25))
  return Math.max(8, Math.floor(base * 0.2))
}

function explainIntAdd(a: number, b: number, correct: number): string {
  if (a >= 0 && b >= 0)
    return `Dois positivos: some normalmente. ${a} + ${b} = ${correct}.`
  if (a < 0 && b < 0)
    return `Dois negativos: some os valores e mantenha o sinal. ${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(correct)}, com sinal negativo = ${correct}.`
  const bigger = Math.abs(a) >= Math.abs(b) ? a : b
  const smaller = Math.abs(a) < Math.abs(b) ? a : b
  const sign = bigger < 0 ? 'negativo' : 'positivo'
  return `Sinais diferentes: ${Math.abs(bigger)} − ${Math.abs(smaller)} = ${Math.abs(correct)}, sinal do maior valor (${sign}) = ${correct}.`
}

function explainIntMul(a: number, b: number, correct: number): string {
  const sameSign = (a > 0 && b > 0) || (a < 0 && b < 0)
  if (sameSign)
    return `Sinais iguais → resultado positivo: ${Math.abs(a)} × ${Math.abs(b)} = ${correct}.`
  return `Sinais diferentes → resultado negativo: ${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(correct)}, com sinal negativo = ${correct}.`
}

function generateQuestion(mode: GameMode, level: DifficultyLevel): Question {
  switch (mode) {
    case 'basic-add': {
      const r = getBasicAddRange(level)
      const a = randInt(r.min, r.max)
      const b = randInt(r.min, r.max)
      const correct = a + b
      return {
        text: `${a} + ${b} = ?`,
        correct,
        options: generateOptions(correct, getSpread(level, correct)),
        explanation: `Some ${a} com ${b}: ${a} + ${b} = ${correct}.`,
      }
    }
    case 'basic-sub': {
      const max = getBasicSubRange(level)
      const a = randInt(2, max)
      const b = randInt(1, a - 1)
      const correct = a - b
      return {
        text: `${a} − ${b} = ?`,
        correct,
        options: generateOptions(correct, getSpread(level, correct)),
        explanation: `Retire ${b} de ${a}: ${a} − ${b} = ${correct}.`,
      }
    }
    case 'basic-mul': {
      const r = getBasicMulRange(level)
      const a = randInt(r.a.min, r.a.max)
      const b = randInt(r.b.min, r.b.max)
      const correct = a * b
      return {
        text: `${a} × ${b} = ?`,
        correct,
        options: generateOptions(correct, getSpread(level, correct)),
        explanation: `${a} grupos de ${b}: ${a} × ${b} = ${correct}. Lembre: ${b} × ${a} também vale ${correct}.`,
      }
    }
    case 'basic-div': {
      const r = getBasicDivRange(level)
      const quociente = randInt(r.q.min, r.q.max)
      const divisor = randInt(r.d.min, r.d.max)
      const dividendo = quociente * divisor
      return {
        text: `${dividendo} ÷ ${divisor} = ?`,
        correct: quociente,
        options: generateOptions(quociente, getSpread(level, quociente)),
        explanation: `${divisor} × ${quociente} = ${dividendo}, então ${dividendo} ÷ ${divisor} = ${quociente}.`,
      }
    }
    case 'tabuada': {
      const max = getTabuadaRange(level)
      const a = randInt(1, max)
      const b = randInt(1, max)
      const correct = a * b
      return {
        text: `${a} × ${b} = ?`,
        correct,
        options: generateOptions(correct, getSpread(level, correct)),
        explanation: `Tabuada do ${a}: ${a} × ${b} = ${correct}. Grave este resultado!`,
      }
    }
    case 'int-add': {
      const r = getIntRange(level)
      const a = randInt(-r, r)
      const b = randInt(-r, r)
      const correct = a + b
      return {
        text: `${formatNumber(a)} + ${formatNumber(b)} = ?`,
        correct,
        options: generateOptions(correct, getSpread(level, Math.abs(correct) + 3)),
        explanation: explainIntAdd(a, b, correct),
      }
    }
    case 'int-sub': {
      const r = getIntRange(level)
      const a = randInt(-r, r)
      const b = randInt(-r, r)
      const correct = a - b
      const negB = -b
      return {
        text: `${formatNumber(a)} − ${formatNumber(b)} = ?`,
        correct,
        options: generateOptions(correct, getSpread(level, Math.abs(correct) + 3)),
        explanation: `Subtrair ${formatNumber(b)} é somar ${formatNumber(negB)}: ${formatNumber(a)} + ${formatNumber(negB)} = ${correct}.`,
      }
    }
    case 'int-mul': {
      const r = getIntRange(level)
      const a = randIntExcluding(-r, r, [0])
      const b = randIntExcluding(-r, r, [0])
      const correct = a * b
      return {
        text: `${formatNumber(a)} × ${formatNumber(b)} = ?`,
        correct,
        options: generateOptions(correct, getSpread(level, Math.abs(correct) + 5)),
        explanation: explainIntMul(a, b, correct),
      }
    }
    case 'int-div': {
      const r = getIntRange(level)
      const quociente = randIntExcluding(-r, r, [0])
      const divisor = randIntExcluding(-r, r, [0])
      const dividendo = quociente * divisor
      const sameSign = (quociente > 0 && divisor > 0) || (quociente < 0 && divisor < 0)
      const signRule = sameSign ? 'Sinais iguais → resultado positivo.' : 'Sinais diferentes → resultado negativo.'
      return {
        text: `${formatNumber(dividendo)} ÷ ${formatNumber(divisor)} = ?`,
        correct: quociente,
        options: generateOptions(quociente, getSpread(level, Math.abs(quociente) + 3)),
        explanation: `${signRule} ${formatNumber(divisor)} × ${quociente} = ${dividendo}, então o resultado é ${quociente}.`,
      }
    }
  }
}

export function generateSession(mode: GameMode, level: DifficultyLevel): Question[] {
  const questions: Question[] = []
  const seen = new Set<string>()

  let attempts = 0
  while (questions.length < QUESTIONS_PER_ROUND && attempts < 300) {
    attempts++
    const q = generateQuestion(mode, level)
    if (!seen.has(q.text)) {
      seen.add(q.text)
      questions.push(q)
    }
  }

  return questions
}
