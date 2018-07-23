'use strict'

const vowels = ['AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH',
    'UW']

function parse(phons, with_stress, cutspell) {
    let result = ''
    const num_syllables = countVowels(phons)
    for (let i = 0; i < phons.length; i++) {
        result += convert(phons[i], phons[i - 1], phons[i + 1], phons[i + 2], num_syllables,
            with_stress, cutspell)
    }
    return result
}

function countVowels(phons) {
    let num_vowels = 0
    for (let phon of phons) {
        if (phon && vowels.indexOf(phon.substr(0, 2)) !== -1) {
            num_vowels++
        }
    }
    return num_vowels
}

function convert (symbol, behind, ahead1, ahead2, num_syllables, with_stress,
    cutspell) {
    const hasPrimary = (symbol.substr(2, 1) === '1')
    const hasSecondary = (symbol.slice(-1) === '2')
    const symbol_nos = symbol.substr(0, 2)
    const ahead1_nos = ahead1 ? ahead1.substr(0, 2) : ''
    const stressed = (with_stress && hasPrimary && num_syllables >= 2)
    // whether or not the next phoneme is intervocalic
    const nextIntervocalic = (countVowels([ahead2]) !== 0)
    const schwa = 'e'
    switch (symbol_nos) {
    case 'AA':
        if (ahead1 === 'R') {
            return stressed ? 'áa' : 'aa'
        }
        return stressed ? 'áa' : 'aa'
    case 'AE':
        return stressed ? 'á' : 'a'
    case 'AH':
        if (!hasPrimary && !hasSecondary && num_syllables >= 2) {
            if (cutspell && !nextIntervocalic && behind !== 'L') {
                switch (ahead1) {
                case 'NN':
                case 'L':
                case 'M':
                case 'NG':
                    return ''
                }
            }
            return schwa
        }
        return stressed ? 'ó' : 'o'
    case 'AO':
        if (ahead1 === 'R') {
            return stressed ? 'óo' : 'oo'
        }
        return stressed ? 'áa' : 'aa'
    case 'AW':
        if (ahead1_nos === 'UH' || ahead1_nos === 'UW') {
            return stressed ? 'áu\'' : 'au\''
        }
        return stressed ? 'áu' : 'au'
    case 'AY':
        if (ahead1_nos === 'IH' || ahead1_nos === 'IY') {
            return stressed ? 'ái\'' : 'ai\''
        }
        return stressed ? 'ái' : 'ai'
    case 'B':
        return 'b'
    case 'C':
        return 'tx'
    case 'D':
        return 'd'
    case 'Q':
        return 'q'
    case 'EH':
        if (ahead1 === 'R') {
            return stressed ? 'éi' : 'ei'
        }
        return stressed ? 'é' : 'e'
    case 'ER':
        if (cutspell && !hasPrimary && num_syllables >=2 && (countVowels([ahead1]) === 0)) {
            return 'r'
        }
        return stressed ? 'úr' : 'ur'
    case 'EY':
        if (ahead1_nos === 'IH' || ahead1_nos === 'IY') {
            return stressed ? 'éi\'' : 'ei\''
        } else if (ahead1 === 'R') {
            return stressed ? 'éi' : 'ei'
        }
        return stressed ? 'éi' : 'ei'
        // return stressed ? 'ée' : 'ee'
    case 'F':
        return 'f'
    case 'G':
        return 'g'
    case 'HH':
        return 'h'
    case 'IH':
        if (ahead1 === 'R') {
            return stressed ? 'íi' : 'ii'
        }
        return stressed ? 'í' : 'i'
    case 'IY':
        if (ahead1 === 'R' && !nextIntervocalic) {
            return stressed ? 'íi' : 'ii'
        } else if (ahead1_nos === 'IH' || ahead1_nos === 'IY') {
            return stressed ? 'íi\'' : 'ii\''
        } else if (cutspell && !ahead1 && !hasPrimary) {
            return 'i'
        }
        return stressed ? 'íi' : 'ii'
    case 'J':
        return 'dj'
    case 'K':
        return 'k'
    case 'L':
        return 'l'
    case 'M':
        return 'm'
    case 'NN':
        return 'n'
    case 'NG':
        return 'ng'
    case 'OW':
        if (ahead1_nos === 'R' && !nextIntervocalic) {
            // necessary for "foreskin"
            return stressed ? 'óo' : 'oo'
        } else if (ahead1_nos === 'UH' || ahead1_nos === 'UW') {
            return stressed ? 'óu\'' : 'ou\''
        }
        return stressed ? 'óu' : 'ou'
        // return stressed ? 'óo' : 'oo'
    case 'OY':
        if (ahead1_nos === 'IH' || ahead1_nos === 'IY') {
            return stressed ? 'ói\'' : 'oi\''
        }
        return stressed ? 'ói' : 'oi'
    case 'P':
        return 'p'
    case 'R':
        return 'r'
    case 'S':
        return 's'
    case 'X':
        return 'x'
    case 'T':
        return 't'
    case 'TH':
        return 'c'
    case 'UH':
        if (ahead1 === 'R' && !nextIntervocalic) {
            return stressed ? 'úu' : 'uu'
        }
        if (ahead1 !== 'R' && !hasPrimary && !hasSecondary) {
            return schwa
        }
        return stressed ? 'ú' : 'u'
    case 'UW':
        if (ahead1 === 'R') {
            return stressed ? 'úu' : 'uu'
        } else if (ahead1_nos === 'ER') {
            return stressed ? 'úu\'' : 'uu\''
        }
        return stressed ? 'úu' : 'uu'
    case 'V':
        return 'v'
    case 'W':
        return 'w'
    case 'Y':
        return 'y'
    case 'Z':
        return 'z'
    case 'ZH':
        return 'j'
    default:
        return symbol
    }
}
