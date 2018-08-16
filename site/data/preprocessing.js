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
