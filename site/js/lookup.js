'use strict'

var dict = {}

function prepare () {
  // set handler for 'convert' button
  let clickButton = document.getElementById('clickbutton')
  clickButton.addEventListener('click', process, false)
  document.getElementById('testcases').addEventListener('click', tests, false)

  // download dictionary
  let oReq = new XMLHttpRequest()
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
  }
  return [result]
}

function decodePhonemes (letters) {
  if (!letters) {
    return
  }
  let phons = []
  for (const letter of letters) {
    phons.push(ASCIIDECOMPRESSION[letter])
  }
  return phons
}

function process () {
  const text = document.getElementById('input').value
  const withStress = document.getElementById('withStress').checked
  const result = convertText(text, withStress)
  let output = document.getElementById('output')
  output.value = result
}

function figureOutCapitalization (original, converted) {
  if (original.toUpperCase() === original) {
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
function convertText (text, withStress) {
  const chunks = text.split(/([^a-zA-Z'-])/)
  console.log(chunks)
  let result = ''
  for (let chunk of chunks) {
    const lookupResults = lookup(chunk)
    let allConverted = []
    for (const variant of lookupResults) {
      const phons = decodePhonemes(variant)
      if (!phons) {
        if (/[a-zA-Z]/.test(chunk)) {
          // chunk is a real word but it's not in the dictionary
          // try to find a base form of the word
          // TODO: find base form
          allConverted.push(`???${chunk}???`)
        } else {
          // chunk is a special character; probably a comma or so
          allConverted.push(chunk)
        }
        continue
      }
      const converted = assemble(phons, withStress)
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
  let inputField = document.getElementById('input')
  inputField.value = `Foreskin SEEING dying saying behalf suing teriyaki
evacuate boyhood adhere bloodshed midyear knowing away short awestruck withhold
adulthood malevolent criminal fewer lure neurology careless what's think
nighttime`
}
