import { LEXICALSETS, CONSONANTS } from './constants.mjs'

const vowels = ['A', 'AH', 'AHY', 'AR', 'AW', 'EE', 'EH', 'EIR', 'EW', 'EWR', 'EY',
                'IA', 'IER', 'IH', 'II', 'IRE', 'O', 'OA', 'OH', 'OIR', 'OO', 'OOR',
                'OR', 'OW', 'OWR', 'OY', 'U', 'UH', 'UR', 'ə', 'əR']
// these consonants cannot be pronounced immediately before an L
// (counterexample: R (curl))
const unambiguousBeforeL = ['B', 'CH', 'D', 'DH', 'F', 'G', 'J', 'K', 'P', 'S',
  'SH', 'T', 'TH', 'V', 'Z', 'ZH']
const unambiguousBeforeM = ['B', 'CH', 'D', 'DH', 'F', 'G', 'J', 'K', 'P', 'S',
  'SH', 'T', 'TH', 'V', 'Z', 'ZH']
const unambiguousBeforeN = ['B', 'CH', 'D', 'DH', 'F', 'G', 'J', 'K', 'P', 'S',
  'SH', 'T', 'TH', 'V', 'Z', 'ZH']
const unambiguousBeforeR = ['B', 'CH', 'D', 'DH', 'F', 'G', 'J', 'K', 'L', 'M',
  'N', 'NG', 'P', 'S', 'SH', 'T', 'TH', 'V', 'Z', 'ZH']

/**
 * Assemble the spelling from the pronunciation
 */
export function assemble (phons, withStress, withMerger) {
  let result = ''
  const numSyllables = countVowels(phons)
  for (let i = 0; i < phons.length; i++) {
    // if the previous symbol is the apostrophe, then use the one before that
    const behind = phons[i - 1] === '\'' ? phons[i - 2] : phons[i - 1]
    const newLetters = convertSymbol(phons[i], behind, phons[i + 1],
      numSyllables, withStress, withMerger)

    // avoid ambiguities by inserting apostrophes when two times the same vowel
    // appears accross phoneme boundaries or when the combinations
    // c+h or s+h appear
    const lastOld = result.slice(-1)[0]
    const firstNew = newLetters[0]
    if (('aeiouyáéíóúýāēīōū'.includes(lastOld) && lastOld === firstNew) ||
          ((lastOld === 'c' || lastOld === 's') && firstNew === 'h')) {
      result += '\''
    } else if (lastOld === 'd' && firstNew === 'j') {
      result += 'h'
    }

    result += newLetters
  }
  return result
}

function countVowels (phons) {
  let numVowels = 0
  for (const phon of phons) {
    if (phon && vowels.includes(phon.slice(0, -1))) {
      numVowels++
    } else if (phon && (phon === 'ə' || phon === 'əR' || phon === 'II')) {
      numVowels++
    }
  }
  return numVowels
}

/**
 * Convert a pronunciation symbol into letters for the spelling
 */
function convertSymbol (symbol, behind, ahead1, numSyllables, withStress,
                        withMerger) {
  const hasPrimary = (symbol.slice(-1) === '1')
  // const hasSecondary = (symbol.slice(-1) === '2')
  const hasStressMarker = ['0', '1', '2'].includes(symbol.slice(-1))
  const symbolNoS = hasStressMarker ? symbol.slice(0, -1) : symbol
  // const ahead1NoS = ahead1 ? ahead1.substr(0, 2) : ''
  const stress = (withStress && hasPrimary && numSyllables >= 2) ? 0 : 1
  const lexicalSets = LEXICALSETS
  const consonants = CONSONANTS
  switch (symbolNoS) {
    // vowels
    case 'A':
      return lexicalSets.TRAP[stress]
    case 'AH':
      return lexicalSets.PALM[stress]
    case 'AHY':
      return lexicalSets.PRICE[stress]
    case 'AR':
      return lexicalSets.START[stress]
    case 'AW':
      if (withMerger) {
        if (ahead1 == 'RR') {
          return lexicalSets.THOUGHT[stress]
        } else {
          return lexicalSets.PALM[stress]
        }
      } else {
        return lexicalSets.THOUGHT[stress]
      }
    case 'EE':
      return lexicalSets.FLEECE[stress]
    case 'EH':
      return lexicalSets.DRESS[stress]
    case 'EIR':
      return lexicalSets.SQUARE[stress]
    case 'EW':
      return lexicalSets.CUTE[stress]
    case 'EWR':
      return lexicalSets.CURE[stress]
    case 'EY':
      return lexicalSets.FACE[stress]
    case 'ə':
      return lexicalSets.commA
    case 'əR':
      if (!ahead1 && unambiguousBeforeR.includes(behind)) {
        return consonants.ER
      }
      return lexicalSets.lettER
    case 'IA':
      return lexicalSets.IAN[stress]
    case 'IER':
      return lexicalSets.NEAR[stress]
    case 'IH':
      return lexicalSets.KIT[stress]
    case 'II':
      return lexicalSets.happY
    case 'IRE':
      return lexicalSets.FIRE[stress]
    case 'O':
      if (withMerger) {
        if (ahead1 == 'RR') {
          return lexicalSets.THOUGHT[stress]
        } else {
          return lexicalSets.PALM[stress]
        }
      } else {
        return lexicalSets.LOT[stress]
      }
    case 'OA':
      return lexicalSets.CLOTH[stress]
    case 'OH':
      return lexicalSets.GOAT[stress]
    case 'OIR':
      return lexicalSets.COIR[stress]
    case 'OO':
      return lexicalSets.GOOSE[stress]
    case 'OOR':
      return lexicalSets.POOR[stress]
    case 'OR':
      return lexicalSets.NORTH[stress]
    case 'OW':
      return lexicalSets.MOUTH[stress]
    case 'OWR':
      return lexicalSets.FLOUR[stress]
    case 'OY':
      return lexicalSets.CHOICE[stress]
    case 'U':
      return lexicalSets.FOOT[stress]
    case 'UH':
      return lexicalSets.STRUT[stress]
    case 'UR':
      // if (!hasPrimary && !hasSecondary) {
      //   if (!ahead1 && unambiguousBeforeR.includes(behind)) {
      //     return consonants.R
      //   }
      //   return lexicalSets.lettER
      // }
      return lexicalSets.NURSE[stress]
    // syllabic consonants
    case 'EL':
      if (!ahead1 && unambiguousBeforeL.includes(behind)) {
        return consonants.EL
      }
      return lexicalSets.commA + consonants.L
    case 'EM':
      if (!ahead1 && unambiguousBeforeM.includes(behind)) {
        return consonants.EM
      }
      return lexicalSets.commA + consonants.M
    case 'EN':
      if (unambiguousBeforeN.includes(behind) && (!ahead1 || ahead1 === '\'')) {
        return consonants.EN
      }
      return lexicalSets.commA + consonants.N
    // consonants
    case 'NG':
      if (ahead1 === 'G' || ahead1 === 'K') {
        return consonants.N
      }
      return consonants.NG
    case 'RR':
      if (behind === undefined || countVowels([behind]) === 0) {
        return consonants.CRV
      } else {
        return consonants.VRV
      }
    case 'S':
      if (behind === undefined || countVowels([behind]) === 0) {
        return consonants.CS
      } else {
        return consonants.VS
      }
    case 'Z':
      if (behind === undefined || countVowels([behind]) === 0) {
        return consonants.CZ
      } else {
        return consonants.VZ
      }
    case 'B':
    case 'CH':
    case 'D':
    case 'DH':
    case 'F':
    case 'G':
    case 'HH':
    case 'J':
    case 'K':
    case 'L':
    case 'M':
    case 'N':
    case 'P':
    case 'SH':
    case 'T':
    case 'TH':
    case 'V':
    case 'W':
    case 'WH':
    case 'Y':
    case 'ZH':
      return consonants[symbolNoS]
    default:
      return symbol
  }
}
