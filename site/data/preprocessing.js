'use strict'

function prepare () {
    // set handler for 'process' button
    let clickButton = document.getElementById('process')
    clickButton.addEventListener('click', load, false)
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


function load () {
    let dictFile = document.getElementById('cmudict').files[0]
    process(dictFile)
}


async function process (dictFile) {
    console.log('processing')
    let rawString = await readFile(dictFile)
    let output = ['{']
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
        const versionMatches = word.match(/^([^(]+)\((.)\)/i)
        if (versionMatches) {
            // console.log(`${versionMatches[1]} and ${versionMatches[2]}`)
            word = `${versionMatches[1]}${versionMatches[2]}`
        }
        pronun = minimize(` ${pronun} `)
        output.push(`"${word}":"${pronun}",`)
    }
    // remove the trailing comma from the last element
    output[output.length - 1] = output.slice(-1)[0].slice(0, -1)
    output.push('}')
    save('dictionary.json', output.join('\n'))
}


function minimize (pronun) {
    let out = pronun
    out = out.replace(/ N /g, ' NN ')
    out = out.replace(/ JH /g, ' J ')
    out = out.replace(/ CH /g, ' C ')
    out = out.replace(/ DH /g, ' Q ')
    out = out.replace(/ SH /g, ' X ')
    out = out.replace(/0/g, '')
    return out.replace(/ /g, '')  // remove all spaces
}


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
