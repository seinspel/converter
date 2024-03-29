// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Utils$Converter from "./Utils.mjs";

var pureVowels = [
  "A",
  "AH",
  "AHY",
  "AW",
  "EE",
  "EH",
  "EW",
  "EY",
  "IA",
  "IH",
  "II",
  "O",
  "OA",
  "OH",
  "OO",
  "OW",
  "OY",
  "U",
  "UH",
  "ə"
];

var rVowels = [
  "AR",
  "EIR",
  "EWR",
  "IER",
  "IRE",
  "OIR",
  "OOR",
  "OR",
  "OWR",
  "UR",
  "əR"
];

var partVowels = [
  "EL",
  "EM",
  "EN"
];

function vowels(param) {
  return pureVowels.concat(rVowels, partVowels);
}

var unambiguousBeforeL = [
  "B",
  "CH",
  "D",
  "DH",
  "F",
  "G",
  "J",
  "K",
  "P",
  "S",
  "SH",
  "T",
  "TH",
  "V",
  "Z",
  "ZH"
];

var unambiguousBeforeM = [
  "B",
  "CH",
  "D",
  "DH",
  "F",
  "G",
  "J",
  "K",
  "P",
  "S",
  "SH",
  "T",
  "TH",
  "V",
  "Z",
  "ZH"
];

var unambiguousBeforeN = [
  "B",
  "CH",
  "D",
  "DH",
  "F",
  "G",
  "J",
  "K",
  "P",
  "S",
  "SH",
  "T",
  "TH",
  "V",
  "Z",
  "ZH"
];

var unambiguousBeforeR = [
  "B",
  "CH",
  "D",
  "DH",
  "F",
  "G",
  "J",
  "K",
  "L",
  "M",
  "N",
  "NG",
  "P",
  "S",
  "SH",
  "T",
  "TH",
  "V",
  "Z",
  "ZH"
];

var voicelessCons = [
  "CH",
  "F",
  "K",
  "P",
  "S",
  "SH",
  "T",
  "TH"
];

var longToShortMap = {
  'AH': 'A',
  'EY': 'EH',
  'EE': 'IH',
  'OH': 'O',
  'OO': 'U',
  'ə': 'A'
};

var shortVowels = [
  "A",
  "EH",
  "IH",
  "O",
  "OA",
  "U",
  "UH"
];

function splitOffStress(symbol) {
  var lastChar = symbol.slice(-1);
  var hasStressMarker = [
      "0",
      "1"
    ].includes(lastChar);
  if (hasStressMarker) {
    return [
            symbol.slice(0, -1),
            lastChar === "1"
          ];
  } else {
    return [
            symbol,
            false
          ];
  }
}

function isVowel(phon, endingOpt, param) {
  var ending = endingOpt !== undefined ? endingOpt : false;
  if (phon === undefined) {
    return false;
  }
  var match = splitOffStress(phon);
  var phonNoS = match[0];
  if (ending) {
    return pureVowels.includes(phonNoS);
  } else {
    return vowels(undefined).includes(phonNoS);
  }
}

function countVowels(phons) {
  var r = 0;
  for(var i = 0 ,i_finish = phons.length; i < i_finish; ++i){
    var numVowels = r;
    r = isVowel(phons[i], undefined, undefined) ? numVowels + 1 | 0 : numVowels;
  }
  return r;
}

function isOpenSyllable(ahead1, ahead2) {
  if (ahead1 !== undefined && !(ahead1 === "'" || isVowel(ahead1, undefined, undefined))) {
    if (ahead2 !== undefined && !(ahead2 === "'" || !isVowel(ahead2, undefined, undefined))) {
      return ![
                "EW",
                "EWR"
              ].includes(ahead2.slice(0, -1));
    } else {
      return false;
    }
  } else {
    return true;
  }
}

function convertSymbol(symbolNoS, behind, ahead1, stress, withMerger, reduplicate, lexicalSets, consonants) {
  var maybeRedub = function (letters) {
    if (reduplicate) {
      return letters[0] + letters;
    } else {
      return letters;
    }
  };
  switch (symbolNoS) {
    case "A" :
        var tuple = lexicalSets.trap;
        return stress ? tuple[0] : tuple[1];
    case "AH" :
        var tuple$1 = lexicalSets.palm;
        return stress ? tuple$1[0] : tuple$1[1];
    case "AHY" :
        var tuple$2 = lexicalSets.price;
        return stress ? tuple$2[0] : tuple$2[1];
    case "AR" :
        var tuple$3 = lexicalSets.start;
        return stress ? tuple$3[0] : tuple$3[1];
    case "AW" :
        if (withMerger) {
          if (ahead1 !== undefined) {
            if (ahead1 === "RR") {
              var tuple$4 = lexicalSets.thought;
              return stress ? tuple$4[0] : tuple$4[1];
            }
            var tuple$5 = lexicalSets.palm;
            return stress ? tuple$5[0] : tuple$5[1];
          }
          var tuple$6 = lexicalSets.palm;
          return stress ? tuple$6[0] : tuple$6[1];
        }
        var tuple$7 = lexicalSets.thought;
        return stress ? tuple$7[0] : tuple$7[1];
    case "B" :
        return maybeRedub(consonants.b);
    case "CH" :
        return maybeRedub(consonants.ch);
    case "D" :
        return maybeRedub(consonants.d);
    case "DH" :
        return maybeRedub(consonants.dh);
    case "EE" :
        var tuple$8 = lexicalSets.fleece;
        return stress ? tuple$8[0] : tuple$8[1];
    case "EH" :
        var tuple$9 = lexicalSets.dress;
        return stress ? tuple$9[0] : tuple$9[1];
    case "EIR" :
        var tuple$10 = lexicalSets.square;
        return stress ? tuple$10[0] : tuple$10[1];
    case "EL" :
        if (ahead1 === undefined && behind !== undefined && unambiguousBeforeL.includes(behind)) {
          return consonants.el;
        }
        return lexicalSets.comma + consonants.l;
    case "EM" :
        if (ahead1 === undefined && behind !== undefined && unambiguousBeforeM.includes(behind)) {
          return consonants.em;
        }
        return lexicalSets.comma + consonants.m;
    case "EN" :
        var exit = 0;
        var behind$1;
        if (ahead1 !== undefined) {
          if (ahead1 === "'" && behind !== undefined) {
            behind$1 = behind;
            exit = 2;
          }
          
        } else if (behind !== undefined) {
          behind$1 = behind;
          exit = 2;
        }
        if (exit === 2 && unambiguousBeforeN.includes(behind$1)) {
          return consonants.en;
        }
        return lexicalSets.comma + consonants.n;
    case "EW" :
        var tuple$11 = lexicalSets.cute;
        return stress ? tuple$11[0] : tuple$11[1];
    case "EWR" :
        var tuple$12 = lexicalSets.cure;
        return stress ? tuple$12[0] : tuple$12[1];
    case "EY" :
        var tuple$13 = lexicalSets.face;
        return stress ? tuple$13[0] : tuple$13[1];
    case "F" :
        return maybeRedub(consonants.f);
    case "G" :
        return maybeRedub(consonants.g);
    case "H" :
        return maybeRedub(consonants.hh);
    case "IA" :
        var tuple$14 = lexicalSets.ian;
        return stress ? tuple$14[0] : tuple$14[1];
    case "IER" :
        var tuple$15 = lexicalSets.near;
        return stress ? tuple$15[0] : tuple$15[1];
    case "IH" :
        var tuple$16 = lexicalSets.kit;
        return stress ? tuple$16[0] : tuple$16[1];
    case "II" :
        return lexicalSets.happy;
    case "IRE" :
        var tuple$17 = lexicalSets.fire;
        return stress ? tuple$17[0] : tuple$17[1];
    case "J" :
        return maybeRedub(consonants.j);
    case "K" :
        return maybeRedub(consonants.k);
    case "L" :
        return maybeRedub(consonants.l);
    case "M" :
        return maybeRedub(consonants.m);
    case "N" :
        return maybeRedub(consonants.n);
    case "NG" :
        if (ahead1 === undefined) {
          return consonants.ng;
        }
        switch (ahead1) {
          case "G" :
          case "K" :
              return consonants.n;
          default:
            return consonants.ng;
        }
    case "O" :
        if (withMerger) {
          if (ahead1 !== undefined) {
            if (ahead1 === "RR") {
              var tuple$18 = lexicalSets.thought;
              return stress ? tuple$18[0] : tuple$18[1];
            }
            var tuple$19 = lexicalSets.palm;
            return stress ? tuple$19[0] : tuple$19[1];
          }
          var tuple$20 = lexicalSets.palm;
          return stress ? tuple$20[0] : tuple$20[1];
        }
        var tuple$21 = lexicalSets.lot;
        return stress ? tuple$21[0] : tuple$21[1];
    case "OA" :
        var tuple$22 = lexicalSets.cloth;
        return stress ? tuple$22[0] : tuple$22[1];
    case "OH" :
        var tuple$23 = lexicalSets.goat;
        return stress ? tuple$23[0] : tuple$23[1];
    case "OHR" :
        var tuple$24 = lexicalSets.force;
        return stress ? tuple$24[0] : tuple$24[1];
    case "OIR" :
        var tuple$25 = lexicalSets.coir;
        return stress ? tuple$25[0] : tuple$25[1];
    case "OO" :
        var tuple$26 = lexicalSets.goose;
        return stress ? tuple$26[0] : tuple$26[1];
    case "OOR" :
        var tuple$27 = lexicalSets.poor;
        return stress ? tuple$27[0] : tuple$27[1];
    case "OR" :
        var tuple$28 = lexicalSets.north;
        return stress ? tuple$28[0] : tuple$28[1];
    case "OW" :
        var tuple$29 = lexicalSets.mouth;
        return stress ? tuple$29[0] : tuple$29[1];
    case "OWR" :
        var tuple$30 = lexicalSets.flour;
        return stress ? tuple$30[0] : tuple$30[1];
    case "OY" :
        var tuple$31 = lexicalSets.choice;
        return stress ? tuple$31[0] : tuple$31[1];
    case "P" :
        return maybeRedub(consonants.p);
    case "RR" :
        if (behind !== undefined && isVowel(behind, true, undefined)) {
          return consonants.vrv;
        } else {
          return consonants.crv;
        }
    case "S" :
        var postVocalic = isVowel(behind, true, undefined);
        if (behind !== undefined && ahead1 === undefined && !voicelessCons.includes(behind)) {
          return consonants.vs;
        }
        if (postVocalic && isVowel(ahead1, undefined, undefined)) {
          return consonants.vs;
        } else {
          return consonants.cs;
        }
    case "SH" :
        return maybeRedub(consonants.sh);
    case "T" :
        return maybeRedub(consonants.t);
    case "TH" :
        return maybeRedub(consonants.th);
    case "U" :
        var tuple$32 = lexicalSets.foot;
        return stress ? tuple$32[0] : tuple$32[1];
    case "UH" :
        var tuple$33 = lexicalSets.strut;
        return stress ? tuple$33[0] : tuple$33[1];
    case "UR" :
        var tuple$34 = lexicalSets.nurse;
        return stress ? tuple$34[0] : tuple$34[1];
    case "V" :
        return maybeRedub(consonants.v);
    case "W" :
        return maybeRedub(consonants.w);
    case "WH" :
        return maybeRedub(consonants.wh);
    case "Y" :
        return maybeRedub(consonants.y);
    case "Z" :
        var postVocalic$1 = isVowel(behind, true, undefined);
        if (!postVocalic$1 && isVowel(ahead1, undefined, undefined) || ahead1 !== undefined && postVocalic$1 && !isVowel(ahead1, undefined, undefined)) {
          return consonants.zv;
        } else {
          return consonants.zc;
        }
    case "ZH" :
        return maybeRedub(consonants.zh);
    default:
      if (symbolNoS === "ə") {
        return lexicalSets.comma;
      } else if (symbolNoS === "əR") {
        if (ahead1 !== undefined || !(behind !== undefined && unambiguousBeforeR.includes(behind))) {
          return lexicalSets.letter;
        } else {
          return consonants.er;
        }
      } else {
        return ;
      }
  }
}

function processPhoneme(symbol, behind, ahead1, ahead2, state, settings, withStress) {
  var reduplicate = state.reduplicateNext;
  var reduplicateNext = false;
  var match = splitOffStress(symbol);
  var stress = withStress && match[1] && !state.isFirstSyllable;
  var isFirstSyllable = state.isFirstSyllable ? !isVowel(symbol, undefined, undefined) : false;
  var symbolNoS = match[0];
  var toAppend = "";
  if (settings.longToShort && isOpenSyllable(ahead1, ahead2) || settings.impliedLong && ahead1 === undefined) {
    var shortVersion = Utils$Converter.safeGetD(longToShortMap, symbolNoS);
    if (shortVersion) {
      symbolNoS = shortVersion._0;
      if (isVowel(ahead1, undefined, undefined)) {
        toAppend = settings.lexicalSets.seperator;
      }
      
    } else if (shortVowels.includes(symbolNoS)) {
      reduplicateNext = true;
    }
    
  }
  var newLetters = convertSymbol(symbolNoS, behind, ahead1, stress, settings.withMerger, reduplicate, settings.lexicalSets, settings.consonants);
  var newLetters$1 = Utils$Converter.unwrapS(newLetters, symbol);
  var lastOld = Utils$Converter.safeGetS(state.result.slice(-1), 0);
  var firstNew = Utils$Converter.safeGetS(newLetters$1, 0);
  var separator = lastOld !== undefined && firstNew !== undefined ? (
      lastOld === firstNew || (lastOld === "c" || lastOld === "s") && firstNew === "h" ? settings.lexicalSets.seperator : (
          lastOld === "d" && firstNew === "j" ? "h" : ""
        )
    ) : "";
  var result = state.result + separator + newLetters$1 + toAppend;
  return {
          result: result,
          reduplicateNext: reduplicateNext,
          isFirstSyllable: isFirstSyllable
        };
}

function assemble(phons, settings) {
  var numSyllables = countVowels(phons);
  var withStress = settings.withStress && numSyllables >= 2;
  var phons$1;
  if (settings.longToShort) {
    var r = [];
    for(var i = 0 ,i_finish = phons.length; i < i_finish; ++i){
      var symbol = phons[i];
      var newPhons = r;
      if (symbol.slice(0, -1) === "IA") {
        newPhons.push("IH" + symbol.slice(-1));
        newPhons.push("ə");
      } else {
        newPhons.push(symbol);
      }
      r = newPhons;
    }
    phons$1 = r;
  } else {
    phons$1 = phons;
  }
  var r$1 = {
    result: "",
    reduplicateNext: false,
    isFirstSyllable: true
  };
  for(var i$1 = 0 ,i_finish$1 = phons$1.length; i$1 < i_finish$1; ++i$1){
    var symbol$1 = phons$1[i$1];
    var state = r$1;
    var ahead1 = Utils$Converter.safeGet(phons$1, i$1 + 1 | 0);
    var ahead2 = Utils$Converter.safeGet(phons$1, i$1 + 2 | 0);
    var behind1 = Utils$Converter.safeGet(phons$1, i$1 - 1 | 0);
    var behind = behind1 === "'" ? Utils$Converter.safeGet(phons$1, i$1 - 2 | 0) : behind1;
    r$1 = processPhoneme(symbol$1, behind, ahead1, ahead2, state, settings, withStress);
  }
  return r$1.result;
}

export {
  assemble ,
}
/* No side effect */
