export enum CharState {
  Correct = 0,
  OutOfPlace,
  Wrong,
  NotUsed,
}

const emojiColors = {
  [CharState.Correct]: "🟩",
  [CharState.OutOfPlace]: "🟨",
  [CharState.Wrong]: "⬜",
}

export function splitWord(word: string) {
  const alphas = word.split("")
  const out = []

  alphas.forEach((a) => {
    // ถ้าตัวอักษรเป็นตัวตรงกลาง ให้ถือเป็นตัวใหม่
    if (a.match(/[ก-ฮa-zA-Z]/) || a.match(/[ใเแโไาำะๆฯฤา]/)) {
      out.push(a)
    } else {
      // ถ้าเป็นสระบนล่าง หรือวรรณยุกต์ ให้ต่อท้ายตัวเดิม
      out[out.length - 1] += a
    }
  })

  return out
}

export function normalizeWord(word: string) {
  return word.replace(/[^ก-ฮใเแโไาำะๆฯฤาa-zA-Z]/g, "")
}

export function validateWord(word: string, solution: string) {
  const wordSplitted = splitWord(word)
  const wordNormalizedSplitted = splitWord(normalizeWord(word))
  const solutionSplitted = splitWord(solution)
  const solutionNormalizedSplitted = splitWord(normalizeWord(solution))

  const output = solutionSplitted.map((sChar, idx) => {
    const sNormalized = solutionNormalizedSplitted[idx]
    const char = wordSplitted[idx]
    const cNormalized = wordNormalizedSplitted[idx]

    // If matching character or normalized char, and in correct position
    if (char === sChar || cNormalized === sNormalized) {
      solutionSplitted[idx] = null
      solutionNormalizedSplitted[idx] = null

      return { correct: CharState.Correct, char: sChar }
    } else if (
      // If the solution has normalized char in other position, but only once
      solutionSplitted.includes(char) ||
      solutionNormalizedSplitted.includes(cNormalized)
    ) {
      // Remove one matching char from solution, so that it cannot be matched again
      const idx1 = solutionSplitted.indexOf(char)
      const idx2 = solutionNormalizedSplitted.indexOf(cNormalized)
      let correctChar

      if (idx1 !== -1) {
        correctChar = solutionSplitted[idx1]
        solutionSplitted[idx1] = null
        solutionNormalizedSplitted[idx1] = null
      } else if (idx2 !== -1) {
        correctChar = solutionSplitted[idx2]

        solutionSplitted[idx2] = null
        solutionNormalizedSplitted[idx2] = null
      }

      return { correct: CharState.OutOfPlace, char: correctChar }
    } else {
      return { correct: CharState.Wrong, char }
    }
  })

  output.forEach((sol1) => {
    if (sol1.correct == CharState.Correct) {
      // Find OutOfPlace characters and make it wrong
      output.forEach((sol2, idx) => {
        if (
          (sol1.char == sol2.char || normalizeWord(sol1.char) == normalizeWord(sol2.char)) &&
          sol2.correct == CharState.OutOfPlace
        ) {
          output[idx] = { correct: CharState.Wrong, char: sol2.char }
        }
      })
    }
  })

  return output
}

export function layout(
  alphabetRows: string[],
  validations: Array<{ correct: CharState; char: string }> = []
): Array<Record<string, CharState>> {
  const layoutRows = []

  alphabetRows.forEach((alphabets) => {
    const layout: Record<string, CharState> = {}

    alphabets.split("").forEach((a, idx) => {
      layout[a] = CharState.NotUsed
    })

    validations.forEach(({ correct, char }) => {
      char.split("").forEach((c) => {
        if (correct < layout[c]) {
          // Correct < OutOfPlace < Wrong < Unused
          layout[c] = correct
        }
      })
    })

    layoutRows.push(layout)
  })

  return layoutRows
}

export function getShareResults(attempts: Array<Array<Partial<{ correct: CharState }>>>) {
  return attempts.map((attempt) => {
    return attempt
      .map(({ correct }) => {
        return emojiColors[correct]
      })
      .join("")
  })
}
