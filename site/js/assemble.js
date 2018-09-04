'use strict'

const vowels = ['AA', 'AE', 'AH', 'AR', 'AW', 'AY', 'EH', 'EL', 'EM', 'EN', 'ER', 'EY', 'IH',
  'II', 'IR', 'IY', 'OR', 'OW', 'OY', 'UH', 'UR', 'UW', 'YR']
// these consonants cannot be pronounced immediately before an L (counterexample: R (curl))
const unambiguousBeforeL = ['B', 'CH', 'D', 'DH', 'F', 'G', 'JH', 'K', 'M',
  'N', 'P', 'S', 'SH', 'T', 'TH', 'V', 'Z', 'ZH']
const unambiguousBeforeM = ['B', 'CH', 'D', 'DH', 'F', 'G', 'JH', 'K', 'P',
  'S', 'SH', 'T', 'TH', 'V', 'Z', 'ZH']
const unambiguousBeforeN = ['B', 'CH', 'D', 'DH', 'F', 'G', 'JH', 'K', 'P',
  'S', 'SH', 'T', 'TH', 'V', 'Z', 'ZH']
const unambiguousBeforeR = ['B', 'CH', 'D', 'DH', 'F', 'G', 'JH', 'K', 'L', 'M',
  'N', 'NG', 'P', 'S', 'SH', 'T', 'TH', 'V', 'Z', 'ZH']

/**
 * Assemble the spelling from the pronunciation
 */
function assemble (phons, withStress) {
  let result = ''
  const numSyllables = countVowels(phons)
  for (let i = 0; i < phons.length; i++) {
    result += convertSymbol(phons[i], phons[i - 1], phons[i + 1], phons[i + 2], numSyllables,
      withStress)
  }
  return result
}

function countVowels (phons) {
  let numVowels = 0
  for (let phon of phons) {
    if (phon && vowels.indexOf(phon.substr(0, 2)) !== -1) {
      numVowels++
    }
  }
  return numVowels
}

/**
 * Convert a pronunciation symbol into letters for the spelling
 */
function convertSymbol (symbol, behind, ahead1, ahead2, numSyllables, withStress) {
  const hasPrimary = (symbol.substr(2, 1) === '1')
  const hasSecondary = (symbol.slice(-1) === '2')
  const symbolNoS = symbol.substr(0, 2)
  const ahead1NoS = ahead1 ? ahead1.substr(0, 2) : ''
  const stress = (withStress && hasPrimary && numSyllables >= 2) ? 0 : 1
  const lexicalSets = LEXICALSETS
  const consonants = CONSONANTS
  switch (symbolNoS) {
    // vowels
    case 'AA':
      if (ahead1NoS === 'AA' || ahead1NoS === 'AE') {
        return lexicalSets.LOT[stress] + '\''
      }
      return lexicalSets.LOT[stress]
    case 'AE':
      if (ahead1NoS === 'AA' || ahead1NoS === 'AE') {
        return lexicalSets.TRAP[stress] + '\''
      }
      return lexicalSets.TRAP[stress]
    case 'AH':
      if (!hasPrimary && !hasSecondary) {
        return lexicalSets.commA
      }
      return lexicalSets.STRUT[stress]
    case 'AR':
      return lexicalSets.START[stress]
    case 'AW':
      if (ahead1NoS === 'UH' || ahead1NoS === 'UW' ||
            ahead1NoS === 'YR' || ahead1NoS === 'UR') {
        return lexicalSets.MOUTH[stress] + '\''
      }
      return lexicalSets.MOUTH[stress]
    case 'AY':
      if (ahead1NoS === 'IH' || ahead1NoS === 'IY') {
        return lexicalSets.PRICE[stress] + '\''
      }
      return lexicalSets.PRICE[stress]
    case 'EH':
      return lexicalSets.DRESS[stress]
    case 'ER':
      return lexicalSets.SQUARE[stress]
    case 'EY':
      if (ahead1NoS === 'IH' || ahead1NoS === 'IY') {
        return lexicalSets.FACE[stress] + '\''
      }
      return lexicalSets.FACE[stress]
    case 'IH':
      if (ahead1NoS === 'IH' || ahead1NoS === 'IY') {
        return lexicalSets.KIT[stress] + '\''
      }
      return lexicalSets.KIT[stress]
    case 'II':
      return lexicalSets.happY
    case 'IR':
      return lexicalSets.NEAR[stress]
    case 'IY':
      if (ahead1NoS === 'IH' || ahead1NoS === 'IY') {
        return lexicalSets.FLEECE[stress] + '\''
      }
      return lexicalSets.FLEECE[stress]
    case 'OR':
      return lexicalSets.FORCE[stress]
    case 'OW':
      if (ahead1NoS === 'UH' || ahead1NoS === 'UW' ||
            ahead1NoS === 'YR' || ahead1NoS === 'UR') {
        return lexicalSets.GOAT[stress] + '\''
      }
      return lexicalSets.GOAT[stress]
    case 'OY':
      if (ahead1NoS === 'IH' || ahead1NoS === 'IY') {
        return lexicalSets.CHOICE[stress] + '\''
      }
      return lexicalSets.CHOICE[stress]
    case 'UH':
      if (ahead1NoS === 'UH' || ahead1NoS === 'UW' ||
            ahead1NoS === 'YR' || ahead1NoS === 'UR') {
        return lexicalSets.FOOT[stress] + '\''
      }
      return lexicalSets.FOOT[stress]
    case 'UR':
      return lexicalSets.LURE[stress]
    case 'UW':
      if (ahead1NoS === 'UH' || ahead1NoS === 'UW' ||
            ahead1NoS === 'YR' || ahead1NoS === 'UR') {
        return lexicalSets.GOOSE[stress] + '\''
      }
      return lexicalSets.GOOSE[stress]
    case 'YR':
      if (!hasPrimary && !hasSecondary) {
        if (!ahead1 && unambiguousBeforeR.includes(behind)) {
          return consonants.R
        }
        return lexicalSets.lettER
      }
      return lexicalSets.NURSE[stress]
    // syllabic consonants
    case 'EL':
      if (!ahead1 && unambiguousBeforeL.includes(behind)) {
        return consonants.L
      }
      return lexicalSets.commA + consonants.L
    case 'EM':
      if (!ahead1 && unambiguousBeforeM.includes(behind)) {
        return consonants.M
      }
      return lexicalSets.commA + consonants.M
    case 'EN':
      if (unambiguousBeforeN.includes(behind) && (!ahead1 || ahead1 === '\'')) {
        return consonants.N
      }
      return lexicalSets.commA + consonants.N
    // consonants
    case 'NG':
      if (ahead1 === 'G' || ahead1 === 'K') {
        return consonants.N
      }
      return consonants[symbolNoS]
    case 'TH':
      if (ahead1 === 'HH') {
        return consonants.TH + '\''
      }
      return consonants.TH
    case 'B':
    case 'CH':
    case 'D':
    case 'DH':
    case 'F':
    case 'G':
    case 'HH':
    case 'JH':
    case 'K':
    case 'L':
    case 'M':
    case 'N':
    case 'P':
    case 'R':
    case 'S':
    case 'SH':
    case 'T':
    case 'V':
    case 'W':
    case 'Y':
    case 'Z':
    case 'ZH':
      return consonants[symbolNoS]
    default:
      return symbol
  }
}
