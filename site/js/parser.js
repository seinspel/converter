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

function convert(symbol, behind, ahead1, ahead2, num_syllables, with_stress, cutspell) {
    const has_stress = (symbol.substr(2, 1) === '1')
    const symbol_nos = symbol.substr(0, 2)
    const ahead1_nos = ahead1 ? ahead1.substr(0, 2) : ''
    const stressed = (with_stress && has_stress && num_syllables >= 2)
    switch (symbol_nos) {
    case 'AA':
        if (cutspell && ahead1 === 'R' && countVowels([ahead2]) === 0) {
            return stressed ? 'á' : 'a'
        }
        return stressed ? 'áa' : 'aa'
    case 'AE':
        return stressed ? 'á' : 'a'
    case 'AH':
        if (cutspell && !has_stress && num_syllables >= 2) {
            switch (behind + '/' + ahead1) {
            case 'M/NN':
            case 'W/L':
            case 'T/NN':
            case 'X/NN':
            case 'ZH/NN':
            case 'Z/NN':
            case 'S/NN':
                return ''
            }
        }
        return stressed ? 'ý' : 'y'
    case 'AO':
        if (ahead1 === 'R') {
            return stressed ? 'ó' : 'o'
        }
        return stressed ? 'áa' : 'aa'
    case 'AW':
        if (ahead1_nos === 'UH' || ahead1_nos === 'UW') {
            return stressed ? 'áw' : 'aw'
        }
        return stressed ? 'áu' : 'au'
    case 'AY':
        if (ahead1_nos === 'IH' || ahead1_nos === 'IY') {
            return stressed ? 'áj' : 'aj'
        }
        return stressed ? 'ái' : 'ai'
    case 'B':
        return 'b'
    case 'C':
        return 'tx'
    case 'D':
        if (ahead1 === 'Y') {
            return 'dh'
        }
        return 'd'
    case 'Q':
        return 'q'
    case 'EH':
        return stressed ? 'é' : 'e'
    case 'ER':
        if (cutspell && !has_stress && num_syllables >=2 && countVowels([ahead1]) == 0) {
            switch (behind) {
            case 'M':
            case 'NN':
            case 'Q':
            case 'T':
            case 'K':
                return 'r'
            }
        }
        return stressed ? 'ýr' : 'yr'
    case 'EY':
        if (ahead1_nos === 'IH' || ahead1_nos === 'IY') {
            return stressed ? 'éj' : 'ej'
        }
        return stressed ? 'éi' : 'ei'
    case 'F':
        return 'f'
    case 'G':
        return 'g'
    case 'HH':
        return 'h'
    case 'IH':
        return stressed ? 'í' : 'i'
    case 'IY':
        if (ahead1_nos === 'IH' || ahead1_nos === 'IY') {
            return stressed ? 'íj' : 'ij'
        } else if (cutspell && !ahead1 && !has_stress) {
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
        if (ahead1_nos === 'UH' || ahead1_nos === 'UW') {
            return stressed ? 'ów' : 'ow'
        } else if (ahead1_nos === 'R' && countVowels([ahead2]) == 0) {
            // necessary for "foreskin"
            return stressed ? 'ó' : 'o'
        }
        return stressed ? 'óu' : 'ou'
    case 'OY':
        if (ahead1_nos === 'IH' || ahead1_nos === 'IY') {
            return stressed ? 'ój' : 'oj'
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
        return stressed ? 'ú' : 'u'
    case 'UW':
        return stressed ? 'úu' : 'uu'
    case 'V':
        return 'v'
    case 'W':
        return 'w'
    case 'Y':
        return 'j'
    case 'Z':
        return 'z'
    case 'ZH':
        return 'jh'
    default:
        return symbol
    }
}
