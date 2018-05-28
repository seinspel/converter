'use strict'

var dict = {}

function prepare() {
    // set handler for 'convert' button
    let clickButton = document.getElementById('clickbutton')
    clickButton.addEventListener('click', process, false)

    // download dictionary
    let oReq = new XMLHttpRequest()
    oReq.addEventListener('load', loadDict)
    oReq.open('GET', '/data/cmudict.json')
    oReq.send()
}

function loadDict() {
    dict = JSON.parse(this.responseText)
}

function lookup(word) {
    const letters = dict[word.toUpperCase()]
    let versions = [letters]
    const alt1 = dict[(word + '_1').toUpperCase()]
    if (alt1) {
        versions.push(alt1)
        const alt2 = dict[(word + '_2').toUpperCase()]
        if (alt2) {
            versions.push(alt2)
            const alt3 = dict[(word + '_3').toUpperCase()]
            if (alt3) {
                versions.push(alt3)
            }
        }
    }
    return versions
}

function decodePhonemes(letters) {
    if (!letters) {
        return
    }
    let phons = []
    for (let i = 0; i < letters.length; i++) {
        switch (letters[i]) {
        case 'B':
        case 'C':
        case 'D':
        case 'Q':
        case 'F':
        case 'G':
        case 'J':
        case 'K':
        case 'L':
        case 'M':
        case 'P':
        case 'R':
        case 'S':
        case 'X':
        case 'V':
        case 'W':
        case 'Y':
            phons.push(letters[i])
            break
        case 'A':
        case 'E':
        case 'I':
        case 'O':
        case 'U':
            if (letters[i + 2] === '1') {
                phons.push(letters.slice(i, i + 3))
                i += 2
            } else {
                phons.push(letters.slice(i, i + 2))
                i++
            }
            break
        case 'H':
        case 'N':
            phons.push(letters.slice(i, i + 2))
            i++
            break
        case 'T':
        case 'Z':
            if (letters[i + 1] === 'H' && (letters[i + 2] !=== 'H' || letters[i + 3] === 'H')) {
                phons.push(letters.slice(i, i + 2))
                i++
            } else {
                phons.push(letters[i])
            }
            break
        default:
            console.log('parsing error on this symbol: ' + letters[i])
        }
    }
    return phons
}

function process() {
    const text = document.getElementById('input').value
    const with_stress = document.getElementById('withStress').checked
    const cutspell = document.getElementById('cutspell').checked
    const result = convertText(text, with_stress, cutspell)
    let output = document.getElementById('output')
    output.value = result
}

function convertText(text, with_stress, cutspell) {
    const chunks = text.split(/([^a-zA-Z'-])/)
    console.log(chunks)
    let result = ''
    for (let chunk of chunks) {
        const lookup_results = lookup(chunk)
        let converted = []
        for (let letters of lookup_results) {
            const phons = decodePhonemes(letters)
            if (!phons) {
                if (/[a-zA-Z]/.test(chunk)) {
                    // chunk is a real word but it's not in the dictionary
                    converted.push('???' + chunk + '???')
                } else {
                    converted.push(chunk)
                }
                continue
            }
            converted.push(parse(phons, with_stress, cutspell))
        }
        if (converted.length === 1) {
            result += converted[0]
        } else {
            result += '('
            for (let version of converted) {
                result += version + '/'
            }
            result += ')'
        }
    }
    return result
}
