Build hangman in THIS folder: C:\xampp\htdocs\hangman

A recruiter-ready browser hangman. Playable, polished, no backend.

## Game
- Call it "Letter Pit". Original art, no licensed branding.
- Secret English word from a built-in list of ~40 common 5–8 letter words (no slurs). Underscores for unrevealed letters.
- Player guesses a letter. Correct letters fill every matching slot. Wrong letter costs one of 6 lives. Repeat guesses are ignored.
- Keyboard A–Z plus on-screen letter buttons. R starts a new word.
- Win if the word is complete before 6 misses. Lose if lives hit 0 (reveal the word). Local wins in localStorage.

## UI
- Dark stage, neon stick figure that lights one segment per miss, large letter slots, used-letter keyboard. Not a default Vite page. No Vue logo.
- 390px phone and 1280px desktop.

## Tests
- Vitest (pure logic): a correct letter reveals all matching slots; a wrong letter decrements lives; repeating a letter does not extra-penalize; completing the word is a win.
- `npm test` and `npm run build` must pass.

## GitHub
- Repo: https://github.com/oscarmmi/hangman
- Pages: https://oscarmmi.github.io/hangman/
- vite base `/hangman/`
- Commit: feat: add hangman
- First commit must `git add -A` so package.json, vite.config.ts, tsconfigs, src/main.ts, index.html, .gitignore, and .github/workflows/pages.yml ship with the game.
- gh repo edit --description "Letter Pit hangman in Vue 3 + TypeScript, playable on GitHub Pages." --add-topic vue --add-topic typescript --add-topic game --add-topic hangman --add-topic puzzle
- Stop. Print the repo URL and Pages URL.
