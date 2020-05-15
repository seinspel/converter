import { assemble } from './assemble.mjs'
import * as constants from './constants.mjs'
import { ASCIIDECOMPRESSION } from './asciidecompression.mjs'

var dict = {}

export function loadDict () {
  dict = JSON.parse(this.responseText)
}

function lookup (word) {
  const result = dict[word.toUpperCase()]
  if (result instanceof Array) {
    return result
  } else if (result instanceof Object) {
    return result
  } else if (result === undefined) {
    return
  }
  return [result]
}

function decodePhonemes (letters) {
  if (!letters) {
    return
  }
  const phons = []
  for (const letter of letters) {
    phons.push(ASCIIDECOMPRESSION[letter])
  }
  return phons
}

export function process () {
  const text = document.getElementById('input').value
  const withMerger = document.getElementById('withMerger').checked
  const withStress = document.getElementById('withStress').checked
  const withMacrons = document.getElementById('withMacrons').checked
  const longToShort = document.getElementById('longToShort').checked
  if (withMacrons) {
    constants.setSpelling(constants.LEXICALSETS_MACRON,
      constants.CONSONANTS_MACRON)
  } else if (withStress) {
    constants.setSpelling(constants.LEXICALSETS_EUROPEAN,
      constants.CONSONANTS_EUROPEAN)
  } else {
    const [lexicalSets, consonants] = loadSpelling()
    constants.setSpelling(lexicalSets, consonants)
  }
  const result = convertText(text, withStress, withMerger, longToShort)
  const output = document.getElementById('output')
  output.value = result
}

/**
 * Load spelling from the text inputs
 */
function loadSpelling () {
  const vowels = {
    KIT: ['', document.getElementById('kit-vowel').value],
    DRESS: ['', document.getElementById('dress-vowel').value],
    TRAP: ['', document.getElementById('trap-vowel').value],
    LOT: ['', document.getElementById('lot-vowel').value],
    STRUT: ['', document.getElementById('strut-vowel').value],
    FOOT: ['', document.getElementById('foot-vowel').value],
    CLOTH: ['', document.getElementById('cloth-vowel').value],
    NURSE: ['', document.getElementById('nurse-vowel').value],
    FLEECE: ['', document.getElementById('fleece-vowel').value],
    FACE: ['', document.getElementById('face-vowel').value],
    PALM: ['', document.getElementById('palm-vowel').value],
    THOUGHT: ['', document.getElementById('thought-vowel').value],
    GOAT: ['', document.getElementById('goat-vowel').value],
    GOOSE: ['', document.getElementById('goose-vowel').value],
    PRICE: ['', document.getElementById('price-vowel').value],
    CHOICE: ['', document.getElementById('choice-vowel').value],
    MOUTH: ['', document.getElementById('mouth-vowel').value],
    CUTE: ['', document.getElementById('cute-vowel').value],
    NEAR: ['', document.getElementById('near-vowel').value],
    SQUARE: ['', document.getElementById('square-vowel').value],
    START: ['', document.getElementById('start-vowel').value],
    NORTH: ['', document.getElementById('north-vowel').value],
    POOR: ['', document.getElementById('poor-vowel').value],
    CURE: ['', document.getElementById('cure-vowel').value],
    FIRE: ['', document.getElementById('fire-vowel').value],
    FLOUR: ['', document.getElementById('flour-vowel').value],
    COIR: ['', document.getElementById('coir-vowel').value],
    IAN: ['', document.getElementById('ian-vowel').value],
    happY: document.getElementById('happy-vowel').value,
    lettER: document.getElementById('letter-vowel').value,
    commA: document.getElementById('comma-vowel').value
  }
  const consonants = {
    B: document.getElementById('b-consonant').value,
    CH: document.getElementById('ch-consonant').value,
    D: document.getElementById('d-consonant').value,
    DH: document.getElementById('dh-consonant').value,
    EL: document.getElementById('el-consonant').value,
    EM: document.getElementById('em-consonant').value,
    EN: document.getElementById('en-consonant').value,
    ER: document.getElementById('er-consonant').value,
    F: document.getElementById('f-consonant').value,
    G: document.getElementById('g-consonant').value,
    HH: document.getElementById('h-consonant').value,
    J: document.getElementById('j-consonant').value,
    K: document.getElementById('k-consonant').value,
    L: document.getElementById('l-consonant').value,
    M: document.getElementById('m-consonant').value,
    N: document.getElementById('n-consonant').value,
    NG: document.getElementById('ng-consonant').value,
    P: document.getElementById('p-consonant').value,
    CRV: document.getElementById('crv-consonant').value,
    VRV: document.getElementById('vrv-consonant').value,
    CS: document.getElementById('s-consonant-un').value,
    VS: document.getElementById('s-consonant-am').value,
    SH: document.getElementById('sh-consonant').value,
    T: document.getElementById('t-consonant').value,
    TH: document.getElementById('th-consonant').value,
    V: document.getElementById('v-consonant').value,
    W: document.getElementById('w-consonant').value,
    WH: document.getElementById('wh-consonant').value,
    Y: document.getElementById('y-consonant').value,
    ZC: document.getElementById('z-consonant-un').value,
    ZV: document.getElementById('z-consonant-am').value,
    ZH: document.getElementById('zh-consonant').value
  }
  return [vowels, consonants]
}

export function setPreset (preset) {
  let vowels, consonants
  if (preset === 'european') {
    vowels = constants.LEXICALSETS_EUROPEAN
    consonants = constants.CONSONANTS_EUROPEAN
  } else if (preset === 'asian') {
    vowels = constants.LEXICALSETS_ASIAN
    consonants = constants.CONSONANTS_ASIAN
  } else if (preset === 'english') {
    vowels = constants.LEXICALSETS_ENGLISH
    consonants = constants.CONSONANTS_ENGLISH
  }
  writeSpelling(vowels, consonants)
}

/**
 * Write spelling to the text inputs
 */
function writeSpelling (vowels, consonants) {
  // vowels
  document.getElementById('kit-vowel').value = vowels.KIT[1]
  document.getElementById('dress-vowel').value = vowels.DRESS[1]
  document.getElementById('trap-vowel').value = vowels.TRAP[1]
  document.getElementById('lot-vowel').value = vowels.LOT[1]
  document.getElementById('strut-vowel').value = vowels.STRUT[1]
  document.getElementById('foot-vowel').value = vowels.FOOT[1]
  document.getElementById('cloth-vowel').value = vowels.CLOTH[1]
  document.getElementById('nurse-vowel').value = vowels.NURSE[1]
  document.getElementById('fleece-vowel').value = vowels.FLEECE[1]
  document.getElementById('face-vowel').value = vowels.FACE[1]
  document.getElementById('palm-vowel').value = vowels.PALM[1]
  document.getElementById('thought-vowel').value = vowels.THOUGHT[1]
  document.getElementById('goat-vowel').value = vowels.GOAT[1]
  document.getElementById('goose-vowel').value = vowels.GOOSE[1]
  document.getElementById('price-vowel').value = vowels.PRICE[1]
  document.getElementById('choice-vowel').value = vowels.CHOICE[1]
  document.getElementById('mouth-vowel').value = vowels.MOUTH[1]
  document.getElementById('cute-vowel').value = vowels.CUTE[1]
  document.getElementById('near-vowel').value = vowels.NEAR[1]
  document.getElementById('square-vowel').value = vowels.SQUARE[1]
  document.getElementById('start-vowel').value = vowels.START[1]
  document.getElementById('north-vowel').value = vowels.NORTH[1]
  document.getElementById('poor-vowel').value = vowels.POOR[1]
  document.getElementById('cure-vowel').value = vowels.CURE[1]
  document.getElementById('fire-vowel').value = vowels.FIRE[1]
  document.getElementById('flour-vowel').value = vowels.FLOUR[1]
  document.getElementById('coir-vowel').value = vowels.COIR[1]
  document.getElementById('ian-vowel').value = vowels.IAN[1]
  document.getElementById('happy-vowel').value = vowels.happY
  document.getElementById('letter-vowel').value = vowels.lettER
  document.getElementById('comma-vowel').value = vowels.commA
  // consonants
  document.getElementById('b-consonant').value = consonants.B
  document.getElementById('ch-consonant').value = consonants.CH
  document.getElementById('d-consonant').value = consonants.D
  document.getElementById('dh-consonant').value = consonants.DH
  document.getElementById('el-consonant').value = consonants.EL
  document.getElementById('em-consonant').value = consonants.EM
  document.getElementById('en-consonant').value = consonants.EN
  document.getElementById('er-consonant').value = consonants.ER
  document.getElementById('f-consonant').value = consonants.F
  document.getElementById('g-consonant').value = consonants.G
  document.getElementById('h-consonant').value = consonants.HH
  document.getElementById('j-consonant').value = consonants.J
  document.getElementById('k-consonant').value = consonants.K
  document.getElementById('l-consonant').value = consonants.L
  document.getElementById('m-consonant').value = consonants.M
  document.getElementById('n-consonant').value = consonants.N
  document.getElementById('ng-consonant').value = consonants.NG
  document.getElementById('p-consonant').value = consonants.P
  document.getElementById('crv-consonant').value = consonants.CRV
  document.getElementById('vrv-consonant').value = consonants.VRV
  document.getElementById('s-consonant-un').value = consonants.CS
  document.getElementById('s-consonant-am').value = consonants.VS
  document.getElementById('sh-consonant').value = consonants.SH
  document.getElementById('t-consonant').value = consonants.T
  document.getElementById('th-consonant').value = consonants.TH
  document.getElementById('v-consonant').value = consonants.V
  document.getElementById('w-consonant').value = consonants.W
  document.getElementById('wh-consonant').value = consonants.WH
  document.getElementById('y-consonant').value = consonants.Y
  document.getElementById('z-consonant-un').value = consonants.ZC
  document.getElementById('z-consonant-am').value = consonants.ZV
  document.getElementById('zh-consonant').value = consonants.ZH
}

function figureOutCapitalization (original, converted) {
  if (original === 'I') { // special case
    return converted
  } else if (original.toUpperCase() === original && original.toUpperCase() !== 'A') {
    // all caps
    return converted.toUpperCase()
  } else if (original[0] === "'") {
    return converted
  } else if (original[0].toUpperCase() === original[0]) {
    // only first letter is upper case
    // (or more precisely: not all letters are upper case but the first one is)
    return converted[0].toUpperCase() + converted.slice(1)
  }
  return converted
}

/**
 * Find the base form for derived words that e.g. end in -ing or -ed
 */
function findBaseForm (chunk) {
  const chunkUpper = chunk.toUpperCase()
  let toAppend = ''
  let suitableIdentifiers = []
  let lookupResults = []
  // ====================== try different suffixes ========================
  if (chunkUpper.slice(-3) === 'ING') {
    lookupResults = lookup(chunk.slice(0, -3))
    if (lookupResults === undefined) {
      lookupResults = lookup(chunk.slice(0, -3) + 'E')
      if (lookupResults === undefined) {
        return
      }
    }
    toAppend = '=m' // = IH0 NG
    suitableIdentifiers = ['v'] // verb
  // the order of the following checks is very important.
  // the most specific one needs to go first
  } else if (chunkUpper.slice(-3) === "S'S" &&
      (lookupResults = lookup(chunk.slice(0, -3)))) {
    toAppend = 'x\'x' // = Z ' Z
    suitableIdentifiers = ['n'] // noun
  } else if (chunkUpper.slice(-2) === "'S" &&
      (lookupResults = lookup(chunk.slice(0, -2)))) {
    toAppend = '\'x' // = ' Z
    suitableIdentifiers = ['n'] // noun
  } else if (chunkUpper.slice(-1) === 'S' &&
      (lookupResults = lookup(chunk.slice(0, -1)))) {
    toAppend = 'x' // = Z
    suitableIdentifiers = ['n', 'v'] // noun or verb
  } else if (chunkUpper.slice(-2) === 'ED') {
    lookupResults = lookup(chunk.slice(0, -2))
    if (lookupResults === undefined) {
      lookupResults = lookup(chunk.slice(0, -1))
      if (lookupResults === undefined) {
        return
      }
    }
    toAppend = 'c' // = D
    suitableIdentifiers = ['v'] // verb
  } else if (chunkUpper.slice(-3) === 'LLY' &&
      (lookupResults = lookup(chunk.slice(0, -2)))) {
    toAppend = '}' // = II
    suitableIdentifiers = ['j'] // adjective
  } else if (chunkUpper.slice(-2) === 'LY' &&
      (lookupResults = lookup(chunk.slice(0, -2)))) {
    toAppend = 'j}' // = L II
    suitableIdentifiers = ['j'] // adjective
  } else { // we didn't find anything -> abort this
    // result += `<${chunk}>`
    return
  }

  // filter out unsuitable versions and append the suffix
  const result = []
  for (const i in lookupResults) {
    if (lookupResults instanceof Array || // if array, just append
        suitableIdentifiers.indexOf(i) !== -1) { // else check identifier
      result.push(lookupResults[i] + toAppend)
    }
  }
  return result
}

/**
 * Convert a text in normal English to new English
 */
function convertText (text, withStress, withMerger, longToShort) {
  const chunks = text.replace(/’/gi, "'").split(/([^a-zA-Z'])/)
  console.log(chunks)
  let result = ''
  for (const chunk of chunks) {
    if (!/[a-zA-Z]/.test(chunk)) {
      // chunk is a special character, like a space or a comma
      result += chunk
      continue
    }
    let lookupResults = lookup(chunk)
    if (lookupResults === undefined) {
      // ======================== no entry was found ==========================
      // see if we can find a base form
      lookupResults = findBaseForm(chunk)
      if (lookupResults === undefined) {
        // we didn't find anything -> abort this
        result += `<${chunk}>`
        continue
      }
    } else if (lookupResults instanceof Object) {
      // convert object to list
      const tempList = []
      for (const i in lookupResults) {
        tempList.push(lookupResults[i])
      }
      lookupResults = tempList
    }

    // ================== convert pronunciation to spelling ===================
    const allConverted = []
    for (const variant of lookupResults) {
      const phons = decodePhonemes(variant)
      const converted = assemble(phons, withStress, withMerger, longToShort)
      allConverted.push(figureOutCapitalization(chunk, converted))
    }
    if (allConverted.length === 1) {
      result += allConverted[0]
    } else {
      result += `(${allConverted.join('/')})`
    }
  }
  return result
}

export function tests () {
  const inputField = document.getElementById('input')
  inputField.value = `Foreskin SEEING dying saying behalf suing teriyaki
evacuate boyhood adhere bloodshed midyear knowing away short awestruck withhold
adulthood malevolent criminal fewer lure neurology careless what's think
nighttime Mary merry marry mirror nearer hurry furry horror lore`
}
