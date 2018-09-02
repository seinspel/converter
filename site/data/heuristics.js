'use strict'

/**
 * Iteration over the dictionary entries
 */
function dictionaryImprovement (dict) {
    let pronunciationFixes = function (word, pronun) {
        return maybeInsertApostrophe(word, pronun)
    }
    for (let word in dict) {
        if (dict[word][0] instanceof Array) {  // there were multiple pronunciations
            let newList = maybeDiscardVariants(dict[word])
            for (const i in newList) {
                const pronun = newList[i]
                newList[i] = pronunciationFixes(word, pronun)
            }
            // if the array has length 1, don't store it as an array
            if (newList.length === 1) {
                dict[word] = newList[0]
            } else {
                dict[word] = newList
            }
        } else {  // only one pronunciation
            const pronun = dict[word]
            // if (word === 'LURE') {
            //     dict[word] = ['L', 'UR1']
            // }
            dict[word] = pronunciationFixes(word, pronun)
        }
    }
}


/**
 * If one word has multiple given pronunciations, then try to figure
 * out which one is the best.
 */
function maybeDiscardVariants (pronunList) {
    let currentBests = [pronunList[0]]
    // loop over the pronunciations to compare them with the current bests
    for (let i = 1; i < pronunList.length; i++) {
        let addToBests = false
        const candidate = pronunList[i]
        // for each candidate, loop over the current bests and compare
        for (let j = 0; j < currentBests.length; j++) {
            const currentBest = currentBests[j]
            const diffs = getDifferences(currentBest, candidate)
            // console.log(i)
            // console.log(j)
            // console.log(diffs)
            if (diffs.length > 3) {
                // too many differences; the pronunciations are not comparable
                addToBests = true
                continue
            }
            // preference for weak vowels: IH0 > AH0 > EH0
            // preference for syllabic consonants: prefer them over the alternative
            let scoreForSwitching = 0  // the score for switching out the `currentBest`
            for (const diff of diffs) {
                let [currentSymbol, newSymbol] = diff
                switch (`${currentSymbol} -> ${newSymbol}`) {
                case 'EH0 -> IH0':
                    scoreForSwitching++
                    break
                case 'IH0 -> EH0':
                    scoreForSwitching--
                    break
                case 'AH0 -> IH0':
                    scoreForSwitching++
                    break
                case 'IH0 -> AH0':
                    scoreForSwitching--
                    break
                case 'L -> EL':
                    scoreForSwitching++
                    break
                case 'EL -> L':
                    scoreForSwitching--
                    break
                case 'N -> EN':
                    scoreForSwitching++
                    break
                case 'EN -> N':
                    scoreForSwitching--
                    break
                case 'M -> EM':
                    scoreForSwitching++
                    break
                case 'EM -> M':
                    scoreForSwitching--
                    break
                case 'UH1 -> UW1':
                    scoreForSwitching++
                    break
                case 'UW1 -> UH1':
                    scoreForSwitching--
                    break
                }
                // TODO: prefer other weak vowels over AH0
            }
            if (scoreForSwitching > 0) {
                // this pronunciation is better -> replace the old one
                currentBests[j] = candidate
                addToBests = false  // no need to add it
            } else if (scoreForSwitching === 0) {
                // there equally good -> include both
                addToBests = true
            } else {
                // score was less than current
                addToBests = false
            }
        }
        if (addToBests) {
            currentBests.push(candidate)
        }
    }
    return currentBests
}


function getDifferences (pronun1, pronun2) {
    let diffs = []
    let len = Math.max(pronun1.length, pronun2.length)
    for (let i = 0; i < len; i++) {
        const symbol1 = pronun1[i] ? pronun1[i] : ''
        const symbol2 = pronun2[i] ? pronun2[i] : ''
        if (symbol1 !== symbol2) {
            diffs.push([symbol1, symbol2])
        }
    }
    return diffs
}


function avoidingUnstressedE (word, pronun) {
}


/**
 * Insert an apostrophe into the dictionary entry if the apostrophe is
 * from a contraction.
 */
function maybeInsertApostrophe (word, pronun) {
    if (!word.includes("'")) {
        return pronun  // skip all the tests
    }
    if (word == "I'M") {
        return pronun.slice(0, -1).concat(["'"], pronun.slice(-1))
    }
    switch(word.slice(-2)) {  // 2-character ending
    case "S'":
        // add apostrophe at the end
        pronun.push("'")
        return pronun
    case "'D":  //problem cases: it'd, that'd, what'd
        if (word.slice(-3)[0] === 'T') {
            return pronun.slice(0, -2).concat(["'"], pronun.slice(-2))
        }  // otherwise fall through
    case "'S":
    case "'T":
        // insert apostrophe next to last
        return pronun.slice(0, -1).concat(["'"], pronun.slice(-1))
    }
    switch(word.slice(-3)) {  // 3-character ending
    case "'VE":
        // problem cases: could've, might've, must've, should've, that've, what've, would've
        if (word.slice(-4)[0] === 'T' || word.slice(-4)[0] === 'D') {
            return pronun.slice(0, -2).concat(["'"], pronun.slice(-2))
        }  // otherwise fall through
    case "'RE":
    case "'LL":
        // R and L have a syllabic form, so we don't need
        // to care about the preceding sound.
        // insert apostrophe next to last
        return pronun.slice(0, -1).concat(["'"], pronun.slice(-1))
    }
    return pronun
}
