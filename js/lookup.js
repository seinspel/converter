'use strict'

var dict = {}
var LEXICALSETS = {}
var CONSONANTS = {}

function prepare () {
  // set handler for 'convert' button
  const clickButton = document.getElementById('clickbutton')
  clickButton.addEventListener('click', process, false)
  document.getElementById('testcases').addEventListener('click', tests, false)

  // download dictionary
  const oReq = new XMLHttpRequest()
  oReq.addEventListener('load', loadDict)
  oReq.open('GET', './data/dictionary.json')
  oReq.send()
}

function loadDict () {
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

function process () {
  const text = document.getElementById('input').value
  const withMerger = document.getElementById('withMerger').checked
  const withStress = document.getElementById('withStress').checked
  const withMacrons = document.getElementById('withMacrons').checked
  if (withMacrons) {
    LEXICALSETS = LEXICALSETS_MACRON
    CONSONANTS = CONSONANTS_MACRON
  } else if (withStress) {
    LEXICALSETS = LEXICALSETS_NORMAL
    CONSONANTS = CONSONANTS_NORMAL
  } else {
    LEXICALSETS = loadSpelling()
    CONSONANTS = CONSONANTS_NORMAL
  }
  const result = convertText(text, withStress, withMerger)
  const output = document.getElementById('output')
  output.value = result
}

/**
 * Load spelling from the text inputs
 */
function loadSpelling () {
  return {
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
    happY: document.getElementById('happy-vowel').value,
    lettER: document.getElementById('letter-vowel').value,
    commA: document.getElementById('comma-vowel').value
  }
}

function figureOutCapitalization (original, converted) {
  if (original === 'I') { // special case
    return converted
  } else if (original.toUpperCase() === original && original.toUpperCase() !== "A") {
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
function convertText (text, withStress, withMerger) {
  const chunks = text.split(/([^a-zA-Z'-])/)
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
      const converted = assemble(phons, withStress, withMerger)
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

function tests () {
  const inputField = document.getElementById('input')
  inputField.value = `Foreskin SEEING dying saying behalf suing teriyaki
evacuate boyhood adhere bloodshed midyear knowing away short awestruck withhold
adulthood malevolent criminal fewer lure neurology careless what's think
nighttime Mary merry marry mirror nearer hurry furry horror lore`
}
