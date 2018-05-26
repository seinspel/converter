const example_text = '. AO1 L | HH Y UW1 M AH0 N | B IY1 IH0 NG Z | AA1 R | B AO1 R N | \
F R IY1 | AH0 N D | IY1 K W AH0 L | IH0 N | D IH1 G N AH0 T IY0 | AH0 N D | \
R AY1 T S . DH EY1 | AA1 R | EH0 N D AW1 D | W IH1 DH | R IY1 Z AH0 N | \
AH0 N D | K AA1 N SH AH0 N S | AH0 N D | SH UH1 D | AE1 K T | T AH0 W AO1 R D Z | \
W AH1 N | AH0 N AH1 DH ER0 | IH0 N | AH0 | S P IH1 R AH0 T | AH1 V | \
B R AH1 DH ER0 HH UH2 D .'

const vowels = ['AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY',
    'OW', 'OY', 'UH', 'UW']

function parse(text, with_stress, cutspell) {
    let sp = text.split(' ')
    let result = ''
    for (let i = 0; i < sp.length - 2; i++) {
        result += convert(sp[i + 1], sp[i], sp[i + 2], with_stress, cutspell)
    }
    return result
}

function convert(symbol, behind, ahead1, ahead2, with_stress, cutspell) {
    let stress = symbol.substr(2, 1)
    let symbol_nos = symbol.substr(0, 2)
    let ahead1_nos = ahead1.substr(0, 2)
    function pickStress(ws, wos) {
        if (with_stress && stress === '1') {
            return ws
        } else {
            return wos
        }
    }
    switch (symbol_nos) {
    case 'AA':
        return pickStress('áa', 'aa')
    case 'AE':
        return pickStress('á', 'a')
    case 'AH':
        if (cutspell && stress === '0') {
            switch (behind + '/' + ahead1) {
            case 'M/N':
            case 'W/L':
            case 'T/N':
                return ''
            }
        }
        return pickStress('ý', 'y')
    case 'AO':
        if (ahead1 === 'R') {
            return pickStress('ó', 'o')
        }
        return pickStress('áa', 'aa')
    case 'AW':
        if (ahead1_nos === 'UH' || ahead1_nos === 'UW') {
            return pickStress('áw', 'aw')
        }
        return pickStress('áu', 'au')
    case 'AY':
        if (ahead1_nos === 'IH' || ahead1_nos === 'IY') {
            return pickStress('áj', 'aj')
        }
        return pickStress('ái', 'ai')
    case 'B':
        return 'b'
    case 'CH':
        return 'tx'
    case 'D':
        if (ahead1 === 'Y') {
            return 'dh'
        }
        return 'd'
    case 'DH':
        return 'q'
    case 'EH':
        return pickStress('é', 'e')
    case 'ER':
        if (cutspell && stress === '0') {
            switch (behind + '/' + ahead1) {
            case 'M/|':
            case 'N/|':
                return 'r'
            }
        }
        return pickStress('ýr', 'yr')
    case 'EY':
        if (ahead1_nos === 'IH' || ahead1_nos === 'IY') {
            return pickStress('éj', 'ej')
        }
        return pickStress('éi', 'ei')
    case 'F':
        return 'f'
    case 'G':
        return 'g'
    case 'HH':
        return 'h'
    case 'IH':
        return pickStress('í', 'i')
    case 'IY':
        if (ahead1_nos === 'IH' || ahead1_nos === 'IY') {
            return pickStress('íj', 'ij')
        }
        return pickStress('íi', 'ii')
    case 'JH':
        return 'dj'
    case 'K':
        return 'k'
    case 'L':
        return 'l'
    case 'M':
        return 'm'
    case 'N':
        return 'n'
    case 'NG':
        return 'ng'
    case 'OW':
        if (ahead1_nos === 'UH' || ahead1_nos === 'UW') {
            return pickStress('ów', 'ow')
        }
        return pickStress('óu', 'ou')
    case 'OY':
        if (ahead1_nos === 'IH' || ahead1_nos === 'IY') {
            return pickStress('ój', 'oj')
        }
        return pickStress('ói', 'oi')
    case 'P':
        return 'p'
    case 'R':
        return 'r'
    case 'S':
        return 's'
    case 'SH':
        return 'x'
    case 'T':
        return 't'
    case 'TH':
        return 'c'
    case 'UH':
        return pickStress('ú', 'u')
    case 'UW':
        return pickStress('úu', 'uu')
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
    case '|':
        return ' '
    default:
        return symbol + ' '
    }
}
