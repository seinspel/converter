'use strict'

var dict = {}

function prepare() {
    // set handler for 'convert' button
    let clickButton = document.getElementById('clickbutton')
    clickButton.addEventListener('click', process, false)
    document.getElementById('testcases').addEventListener('click', tests, false)

    // download dictionary
    let oReq = new XMLHttpRequest()
    oReq.addEventListener('load', loadDict)
    oReq.open('GET', '/data/dictionary.json')
    oReq.send()
}

function loadDict() {
    dict = JSON.parse(this.responseText)
}

function lookup(word) {
    const result = dict[word.toUpperCase()]
    if (result instanceof Array) {
        return result
    }
    return [result]
}

function decodePhonemes(letters) {
    if (!letters) {
        return
    }
    let phons = []
    for (const letter of letters) {
        phons.push(ASCIIDECOMPRESSION[letter])
    }
    return phons
}

function process() {
    const text = document.getElementById('input').value
    const with_stress = document.getElementById('withStress').checked
    const result = convertText(text, with_stress)
    let output = document.getElementById('output')
    output.value = result
}

function tests () {
    let inputField = document.getElementById('input')
    inputField.value = `foreskin seeing dying saying behalf suing teriyaki
evacuate boyhood adhere bloodshed midyear knowing away short awestruck withhold
adulthood malevolent criminal fewer lure neurology careless what's think`
}

function convertText(text, with_stress) {
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
                    converted.push(`???${chunk}???`)
                } else {
                    converted.push(chunk)
                }
                continue
            }
            converted.push(parse(phons, with_stress))
        }
        if (converted.length === 1) {
            result += converted[0]
        } else {
            result += `(${converted.join('/')})`
        }
    }
    return result
}
