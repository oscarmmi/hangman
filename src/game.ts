export const WORDS = [
  'APPLE', 'BRAVE', 'CANDLE', 'CIRCLE', 'CLOUD', 'COFFEE', 'DANCER', 'DESERT',
  'DINNER', 'DRAGON', 'DREAM', 'FAMILY', 'FLOWER', 'FOREST', 'FRIEND', 'GARDEN',
  'GUITAR', 'ISLAND', 'JACKET', 'JOURNEY', 'KITTEN', 'LANTERN', 'MARKET', 'MELLOW',
  'MIRROR', 'MONKEY', 'MORNING', 'MUSEUM', 'NATURE', 'ORANGE', 'PENCIL', 'PILLOW',
  'PLANET', 'POCKET', 'POETRY', 'PURPLE', 'RAINBOW', 'ROCKET', 'SILVER', 'SMILE',
  'SPIRIT', 'SUNSET', 'THEATER', 'THUNDER', 'TURTLE', 'VIOLET', 'WALNUT', 'WONDER',
] as const

export type GameStatus = 'playing' | 'won' | 'lost'

export interface GameState {
  word: string
  guessed: string[]
  misses: number
  status: GameStatus
}

export const MAX_MISSES = 6

export function createGame(previousWord?: string, random = Math.random): GameState {
  let word = WORDS[Math.floor(random() * WORDS.length)]
  if (previousWord && WORDS.length > 1 && word === previousWord) {
    word = WORDS[(WORDS.indexOf(word as (typeof WORDS)[number]) + 1) % WORDS.length]
  }
  return { word, guessed: [], misses: 0, status: 'playing' }
}

export function guessLetter(game: GameState, input: string): GameState {
  const letter = input.toUpperCase()
  if (game.status !== 'playing' || !/^[A-Z]$/.test(letter) || game.guessed.includes(letter)) return game

  const guessed = [...game.guessed, letter]
  const misses = game.misses + (game.word.includes(letter) ? 0 : 1)
  const hasWon = [...game.word].every((character) => guessed.includes(character))
  const status: GameStatus = hasWon ? 'won' : misses >= MAX_MISSES ? 'lost' : 'playing'

  return { ...game, guessed, misses, status }
}
