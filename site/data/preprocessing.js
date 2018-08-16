'use strict'

function prepare () {
    // set handler for 'process' button
    let clickButton = document.getElementById('process')
    clickButton.addEventListener('click', process, false)
}


/**
 * Return a promise to read a file as text.
 *
 * @param {File} file A file object
 *
 * @return {Promise} A promise with the contents of the file
 */
function readFile (file) {
    return new Promise(resolve => {
        let reader = new FileReader()
        reader.onload = e => {
            // callback and remove windows-style newlines
            resolve(e.target.result.replace(/\r/g, ''))
        }
        // start reading
        reader.readAsText(file)
    })
}


function process () {
    let dictFile = document.getElementById('cmudict').files[0]
    let dict = parse(dictFile)
    save('dictionary.json', JSON.stringify(dict))
}


/**
 * Parse the dictionary file
 *
 * @param {File} dictFile File object for the dictionary file
 *
 * @return {object} the parsed dictionary as an object
 */
async function parse (dictFile) {
    console.log('processing')
    const rawString = await readFile(dictFile)
    let dict = {}
    const lines = rawString.split(/[\r\n]+/g)
    const allowedApostrophes = [
        '\'ALLO', '\'BOUT', '\'CAUSE', '\'COURSE', '\'CUSE', '\'EM', '\'FRISCO',
        '\'GAIN', '\'KAY', '\'ROUND', '\'TIL', '\'TIS', '\'TWAS'
    ]

    for (const line of lines) {
        if (line.startsWith(';;;') || !line.match(/^[A-Z']/)) {
            console.log(`excluded: "${line}"`)
            continue
        }
        const split = line.split('  ')
        let word = split[0]
        let pronun = split[1]
        if (word.startsWith('\'')) {
            if (!allowedApostrophes.includes(word)) {
                console.log(`excluded: "${line}"`)
                continue
            }
        }
        // TODO: split entries that containt a space into two entries
        const versionMatches = word.match(/^([^(]+)\((.)\)/i)
        if (versionMatches) {
            // console.log(`${versionMatches[1]} and ${versionMatches[2]}`)
            word = `${versionMatches[1]}${versionMatches[2]}`
        }
        dict[word] = minimize(` ${pronun} `)
    }
    return dict
}


function minimize (pronun) {
    let out = pronun
    // needed for disambiguation
    out = out.replace(/ N /g, ' NN ')

    // save on space
    out = out.replace(/ JH /g, ' J ')
    out = out.replace(/ CH /g, ' C ')
    out = out.replace(/ DH /g, ' Q ')
    out = out.replace(/ SH /g, ' X ')

    // remove marker for no stress
    out = out.replace(/0/g, '')
    // TODO: introduce additional phonemes for r-colored vowels:
    // AR, OR, UR, IR
    // TODO: enact cot-caught-merger and merry-marry-Mary-merger
    // TODO: maybe get rid of UH0 completely
    return out.replace(/ /g, '')  // remove all spaces
}


/**
 * Create a file and let the user download it
 *
 * @param {string} filename Name of the file that is downloaded
 * @param {string} data     Content of the file
 */
function save (filename, data) {
    var blob = new Blob([data], {type: 'text/plain'})
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename)
    } else {
        var elem = window.document.createElement('a')
        elem.href = window.URL.createObjectURL(blob)
        elem.download = filename
        document.body.appendChild(elem)
        elem.click()
        document.body.removeChild(elem)
    }
}


/**
 * Convert pronunciation symbols according to spelling rules
 *
 * @param {string} pronun The pronunciation as a string
 *
 * @return {Array} converted pronunciation symbols
 */
function convert (pronun) {
    let out = []
    const symbols = pronun.split(' ')
    const numSyllables = countVowels(symbols)
    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i]
        const symbol_nos = symbol.substr(0, 2)
        const behind = symbols[i-1]
        const ahead1 = symbols[i+1]
        const ahead2 = symbols[i+2]
        const stress = symbol.substr(2, 1)
        // whether or not the next phoneme is intervocalic
        const nextIntervocalic = (countVowels([ahead2]) !== 0)
        switch (symbol_nos) {
        case 'AA':
            if (ahead1 === 'R') {
                out.push('AR' + stress)
                i++  // skip the next symbol
                continue
            }
            break
        case 'AE':
            if (ahead1 === 'R') {
                out.push('ER' + stress)
                i++  // skip the next symbol
                continue
            }
            break
        case 'AH':
            if (stress === '0' && numSyllables >= 2) {
                if (!nextIntervocalic && behind !== 'L') {
                    switch (ahead1) {
                    case 'N':
                        out.push('EN')
                        i++
                        continue
                    case 'L':
                        out.push('EL')
                        i++
                        continue
                    case 'M':
                        out.push('EM')
                        i++
                        continue
                    }
                }
            }
            break
        case 'AO':
            if (ahead1 === 'R') {
                out.push('OR' + stress)
                i++  // skip the next symbol
                continue
            }
            out.push('AA' + stress)
            continue
        case 'EH':
            if (ahead1 === 'R') {
                out.push('ER' + stress)
                i++  // skip the next symbol
                continue
            }
            break
        case 'ER':
            // if (!hasPrimary && numSyllables >=2 && (countVowels([ahead1]) === 0)) {
            //     out.push('R')
            //     continue
            // }
            out.push('YR' + stress)
            continue
        case 'EY':
            if (ahead1 === 'R') {
                out.push('ER' + stress)
                i++  // skip the next symbol
                continue
            }
            break
        case 'IH':
            if (ahead1 === 'R') {
                out.push('IR' + stress)
                i++  // skip the next symbol
                continue
            }
            break
        case 'IY':
            if (ahead1 === 'R') {
                out.push('IR' + stress)
                i++  // skip the next symbol
                continue
            }
            break
        case 'OW':
            if (ahead1 === 'R' && !nextIntervocalic) {
                out.push('OR' + stress)
                i++  // skip the next symbol
                continue
            }
            break
        case 'UH':
            if (ahead1 === 'R') {
                out.push('YR' + stress)
                i++  // skip the next symbol
                continue
            }
            break
        case 'UW':
            if (ahead1 === 'R') {
                out.push('UR' + stress)
                i++  // skip the next symbol
                continue
            }
            break
        default:
            break
        }
        // do nothing
        out.push(symbol)
    }
    return out
}
