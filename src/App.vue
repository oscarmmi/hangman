<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { createGame, guessLetter, type GameState, WORDS } from './game'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const savedWins = Number(localStorage.getItem('letter-pit-wins') ?? 0)
const wins = ref(Number.isFinite(savedWins) && savedWins >= 0 ? savedWins : 0)
const game = ref<GameState>(createGame())
const guessedLetters = computed(() => new Set(game.value.guessed))
const misses = computed(() => game.value.misses)
const livesRemaining = computed(() => 6 - misses.value)
const message = computed(() => {
  if (game.value.status === 'won') return 'Brilliant! You found the word.'
  if (game.value.status === 'lost') return 'The word was ' + game.value.word + '. Better luck next time.'
  if (misses.value >= 4) return 'Careful now — the pit is getting closer.'
  return 'Pick a letter to reveal the hidden word.'
})

function playLetter(letter: string) {
  if (game.value.status !== 'playing' || guessedLetters.value.has(letter)) return
  game.value = guessLetter(game.value, letter)
  if (game.value.status === 'won') {
    wins.value += 1
    localStorage.setItem('letter-pit-wins', String(wins.value))
  }
}

function newWord() {
  game.value = createGame(game.value.word)
}

function onKeydown(event: KeyboardEvent) {
  if (event.metaKey || event.ctrlKey || event.altKey) return
  const key = event.key.toUpperCase()
  if (/^[A-Z]$/.test(key)) playLetter(key)
  else if (key === 'R') newWord()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <main class="app-shell">
    <header class="topbar">
      <a class="brand" href="#top" aria-label="Letter Pit home">
        <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>
        <span>letter<span class="brand-accent">pit</span><small>THE WORD GUESSING GAME</small></span>
      </a>
      <div class="topbar-right">
        <div class="streak-pill" aria-label="Words solved"><span class="sparkle">✳</span><span><strong>{{ wins }}</strong><small>WORDS SOLVED</small></span></div>
        <button class="icon-button" type="button" aria-label="Start a new word" title="New word (R)" @click="newWord">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5M4.9 9a7.5 7.5 0 0 1 12.3-2L20 12M4 17v-5h5m10.1 3a7.5 7.5 0 0 1-12.3 2L4 12" /></svg>
        </button>
      </div>
    </header>

    <section id="top" class="game-wrap" aria-label="Letter Pit hangman game">
      <div class="intro-row">
        <div>
          <div class="eyebrow"><span class="live-dot"></span> DAILY BRAIN BREAK <span class="eyebrow-divider">/</span> ROUND {{ wins + 1 }}</div>
          <h1>Take a <em>guess.</em></h1>
          <p class="subtitle">Six misses. One hidden word. How far can you get?</p>
        </div>
        <div class="round-stamp"><span>WORD</span><strong>{{ String(game.word.length).padStart(2, '0') }}</strong><span>OF {{ WORDS.length }}</span></div>
      </div>

      <div class="game-card" :class="`state-${game.status}`">
        <section class="art-panel" aria-label="Hangman illustration">
          <div class="panel-topline"><span>THE PIT</span><span class="panel-indicator"><i></i> LIVE</span></div>
          <div class="figure-stage">
            <div class="stage-orbit orbit-one"></div><div class="stage-orbit orbit-two"></div>
            <svg class="hangman" viewBox="0 0 300 292" role="img" :aria-label="`${misses} of 6 misses`">
              <defs><filter id="neon-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
              <path class="scaffold" d="M53 253h188M91 253V45h112v25" />
              <path class="scaffold-detail" d="m91 68 23-23M91 91l46-46" />
              <path class="rope" d="M203 70v22" />
              <g class="figure" filter="url(#neon-glow)">
                <circle class="figure-part" :class="{ lit: misses >= 1 }" cx="203" cy="111" r="19" />
                <path class="figure-part" :class="{ lit: misses >= 2 }" d="M203 130v55" />
                <path class="figure-part" :class="{ lit: misses >= 3 }" d="m203 143-29 27" />
                <path class="figure-part" :class="{ lit: misses >= 4 }" d="m203 143 29 27" />
                <path class="figure-part" :class="{ lit: misses >= 5 }" d="m203 185-27 39" />
                <path class="figure-part" :class="{ lit: misses >= 6 }" d="m203 185 27 39" />
              </g>
              <path class="ground-glow" d="M64 253h173" />
            </svg>
            <div class="stage-coordinate coord-a">04 : 26</div><div class="stage-coordinate coord-b">LP—01</div>
          </div>
          <div class="lives-row">
            <div class="lives-copy"><span>REMAINING LIVES</span><strong>{{ livesRemaining }}<small> / 6</small></strong></div>
            <div class="life-pips" role="img" :aria-label="`${livesRemaining} lives remaining`"><span v-for="life in 6" :key="life" :class="{ spent: life > livesRemaining }"></span></div>
          </div>
        </section>

        <section class="play-panel" aria-label="Guess the word">
          <div class="panel-topline play-topline"><span>UNSCRAMBLE THE MYSTERY</span><span class="word-category"><i></i> EVERYDAY</span></div>
          <div class="word-area" aria-live="polite" aria-label="Hidden word">
            <div class="word-slots">
              <span v-for="(letter, index) in game.word" :key="index" class="letter-slot" :class="{ revealed: guessedLetters.has(letter) || game.status !== 'playing', missed: game.status === 'lost' && !guessedLetters.has(letter) }">
                {{ guessedLetters.has(letter) || game.status !== 'playing' ? letter : '' }}
              </span>
            </div>
            <p class="status-message" :class="`message-${game.status}`"><span class="message-icon">{{ game.status === 'won' ? '✦' : game.status === 'lost' ? '↗' : '↳' }}</span>{{ message }}</p>
          </div>

          <div class="keyboard" aria-label="Choose a letter">
            <div v-for="row in [alphabet.slice(0, 9), alphabet.slice(9, 18), alphabet.slice(18)]" :key="row[0]" class="key-row">
              <button v-for="letter in row" :key="letter" class="letter-key" :class="{ correct: guessedLetters.has(letter) && game.word.includes(letter), incorrect: guessedLetters.has(letter) && !game.word.includes(letter) }" type="button" :disabled="guessedLetters.has(letter) || game.status !== 'playing'" :aria-label="`Guess ${letter}${guessedLetters.has(letter) ? ', already used' : ''}`" @click="playLetter(letter)">{{ letter }}</button>
            </div>
          </div>
          <div class="panel-footer"><span><kbd>A</kbd>—<kbd>Z</kbd> TO GUESS</span><span><kbd>R</kbd> NEW WORD</span></div>
        </section>
      </div>

      <div class="below-card"><p><span class="hint-icon">✳</span> A little focus goes a long way.</p><button class="new-word-link" type="button" @click="newWord">New word <span>↗</span></button></div>
    </section>

    <footer class="site-footer"><span>LETTER PIT <span class="footer-dot">·</span> A TINY GAME OF BIG WORDS</span><span>BUILT FOR THE CURIOUS <span class="footer-cross">✳</span></span></footer>
  </main>
</template>
