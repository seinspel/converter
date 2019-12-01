'use strict'

var dict = {}

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
  const result = convertText(text, withStress, withMacrons, withMerger)
  const output = document.getElementById('output')
  output.value = result
}

function figureOutCapitalization (original, converted) {
  if (original === 'I') { // special case
    return converted
  } else if (original.toUpperCase() === original) {
    // all caps
    return converted.toUpperCase()
  } else if (original[0].toUpperCase() === original[0]) {
    // only first letter is upper case
    // (or more precisely: not all letters are upper case but the first one is)
    return converted[0].toUpperCase() + converted.slice(1)
  }
  return converted
}

/**
 * Convert a text in normal English to new English
 */
function convertText (text, withStress, withMacrons, withMerger) {
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
    if (lookupResults === undefined) { // no entry was found
      // see if we can find a base form
      const chunkUpper = chunk.toUpperCase()
      let toAppend = ''
      if (chunkUpper.slice(-3) === 'ING' && (lookupResults = lookup(chunk.slice(0, -3)))) {
        toAppend = 'HW' // = IH0 NG
      // the order of the following checks is very important. the most specific one needs to go first
      } else if (chunkUpper.slice(-3) === "S'S" && (lookupResults = lookup(chunk.slice(0, -3)))) {
        toAppend = 'z\'z' // = Z ' Z
      } else if (chunkUpper.slice(-2) === "'S" && (lookupResults = lookup(chunk.slice(0, -2)))) {
        toAppend = '\'z' // = ' Z
      } else if (chunkUpper.slice(-1) === 'S' && (lookupResults = lookup(chunk.slice(0, -1)))) {
        toAppend = 'z' // = Z
      } else if (chunkUpper.slice(-2) === 'ED' && (lookupResults = lookup(chunk.slice(0, -2)))) {
        toAppend = '7' // = D
      } else { // we didn't find anything -> abort this
        result += `<${chunk}>`
        continue
      }
      for (const i in lookupResults) {
        lookupResults[i] += toAppend
      }
    }
    const allConverted = []
    for (const variant of lookupResults) {
      const phons = decodePhonemes(variant)
      const converted = assemble(phons, withStress, withMacrons, withMerger)
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
nighttime`
}
