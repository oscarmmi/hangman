import { describe, expect, it } from 'vitest'
import { guessLetter, type GameState } from './game'

const startingGame = (word = 'LETTER'): GameState => ({ word, guessed: [], misses: 0, status: 'playing' })

describe('guessLetter', () => {
  it('reveals all matching positions with one correct guess', () => {
    const result = guessLetter(startingGame(), 't')
    expect(result.guessed).toEqual(['T'])
    expect([...result.word].map((letter) => result.guessed.includes(letter) ? letter : '_')).toEqual(['_', '_', 'T', 'T', '_', '_'])
    expect(result.misses).toBe(0)
  })

  it('decrements lives by adding one miss for a wrong letter', () => {
    expect(guessLetter(startingGame(), 'A').misses).toBe(1)
  })

  it('does not penalize a repeated guess', () => {
    const once = guessLetter(startingGame(), 'A')
    const twice = guessLetter(once, 'a')
    expect(twice).toBe(once)
    expect(twice.misses).toBe(1)
    expect(twice.guessed).toEqual(['A'])
  })

  it('wins when the final unrevealed letter is guessed', () => {
    const nearlyWon: GameState = { word: 'CAT', guessed: ['C', 'A'], misses: 2, status: 'playing' }
    const result = guessLetter(nearlyWon, 'T')
    expect(result.status).toBe('won')
    expect(result.misses).toBe(2)
  })

  it('loses after six misses', () => {
    const nearlyLost: GameState = { word: 'PUZZLE', guessed: ['A', 'B', 'C', 'D', 'E'], misses: 5, status: 'playing' }
    expect(guessLetter(nearlyLost, 'F').status).toBe('lost')
  })
})
