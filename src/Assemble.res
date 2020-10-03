open Utils

type conversionSettings = {
  withStress: bool,
  withMerger: bool,
  longToShort: bool,
  lexicalSets: Constants.lexicalSetsType,
  consonants: Constants.consonantsType,
}

let vowels = [
  "A",
  "AH",
  "AHY",
  "AR",
  "AW",
  "EE",
  "EH",
  "EIR",
  "EW",
  "EWR",
  "EY",
  "IA",
  "IER",
  "IH",
  "II",
  "IRE",
  "O",
  "OA",
  "OH",
  "OIR",
  "OO",
  "OOR",
  "OR",
  "OW",
  "OWR",
  "OY",
  "U",
  "UH",
  "UR",
  `ə`,
  `əR`,
]
// these consonants cannot be pronounced immediately before an L
// (counterexample: R (curl))
let unambiguousBeforeL = [
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
  "ZH",
]
let unambiguousBeforeM = [
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
  "ZH",
]
let unambiguousBeforeN = [
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
  "ZH",
]
let unambiguousBeforeR = [
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
  "ZH",
]

let longToShortMap: Js.Dict.t<string> = %raw(
  `{
  'AH': 'A',
  'EY': 'EH',
  'EE': 'IH',
  'OH': 'O',
  'OO': 'U',
  'ə': 'A'
}`
)

let shortVowels = ["A", "EH", "IH", "O", "OA", "U", "UH"]

let isVowel = (phon: option<string>): bool =>
  switch phon {
  | None => false
  | Some(phon) =>
    vowels->Js.Array2.includes(phon->Js.String2.slice(~from=0, ~to_=-1)) ||
      (phon === `ə` ||
      phon === `əR` ||
      phon === "II")
  }

let countVowels = (phons: array<string>) => {
  open Js.Array2
  phons->reduce((numVowels, phon) => phon->Some->isVowel ? numVowels + 1 : numVowels, 0)
}

type assembleState = {
  result: string,
  reduplicateNext: bool,
}

/**
 * Try to find out if the given vowel belongs to an open syllable.
 */
let isOpenSyllable = (ahead1: option<string>, ahead2: option<string>): bool =>
  switch ahead1 {
  | None | Some("'") => true
  | ahead1 when isVowel(ahead1) => true
  | _ =>
    switch ahead2 {
    | None | Some("'") => false
    | Some(ahead2)
      when isVowel(Some(ahead2)) &&
      !(["EW", "EWR"]->Js.Array2.includes(ahead2->Js.String2.slice(~from=0, ~to_=-1))) => true
    | _ => false
    }
  }

let maybeFst = (tuple: (string, string), takeFst: bool): option<string> => {
  let (fst, snd) = tuple
  Some(takeFst ? fst : snd)
}

/**
 * Convert a pronunciation symbol into letters for the spelling
 */
let convertSymbol = (
  ~symbolNoS: string,
  ~behind: option<string>,
  ~ahead1: option<string>,
  ~stress: bool,
  ~withMerger: bool,
  ~reduplicate: bool,
  ~lexicalSets: Constants.lexicalSetsType,
  ~consonants: Constants.consonantsType,
): option<string> => {
  open Js.Array2
  let maybeRedub = (letters: string) =>
    if reduplicate {
      Some(letters->Js.String2.get(0) ++ letters)
    } else {
      Some(letters)
    }
  switch symbolNoS {
  // vowels
  | "A" => lexicalSets.trap->maybeFst(stress)
  | "AH" => lexicalSets.palm->maybeFst(stress)
  | "AHY" => lexicalSets.price->maybeFst(stress)
  | "AR" => lexicalSets.start->maybeFst(stress)
  | "AW" =>
    if withMerger {
      switch ahead1 {
      | Some("RR") => lexicalSets.thought->maybeFst(stress)
      | _ => lexicalSets.palm->maybeFst(stress)
      }
    } else {
      lexicalSets.thought->maybeFst(stress)
    }
  | "EE" => lexicalSets.fleece->maybeFst(stress)
  | "EH" => lexicalSets.dress->maybeFst(stress)
  | "EIR" => lexicalSets.square->maybeFst(stress)
  | "EW" => lexicalSets.cute->maybeFst(stress)
  | "EWR" => lexicalSets.cure->maybeFst(stress)
  | "EY" => lexicalSets.face->maybeFst(stress)
  | "IA" => lexicalSets.ian->maybeFst(stress)
  | "IER" => lexicalSets.near->maybeFst(stress)
  | "IH" => lexicalSets.kit->maybeFst(stress)
  | "II" => lexicalSets.happy->Some
  | "IRE" => lexicalSets.fire->maybeFst(stress)
  | "O" =>
    if withMerger {
      switch ahead1 {
      | Some("RR") => lexicalSets.thought->maybeFst(stress)
      | _ => lexicalSets.palm->maybeFst(stress)
      }
    } else {
      lexicalSets.lot->maybeFst(stress)
    }
  | "OA" => lexicalSets.cloth->maybeFst(stress)
  | "OH" => lexicalSets.goat->maybeFst(stress)
  | "OIR" => lexicalSets.coir->maybeFst(stress)
  | "OO" => lexicalSets.goose->maybeFst(stress)
  | "OOR" => lexicalSets.poor->maybeFst(stress)
  | "OR" => lexicalSets.north->maybeFst(stress)
  | "OW" => lexicalSets.mouth->maybeFst(stress)
  | "OWR" => lexicalSets.flour->maybeFst(stress)
  | "OY" => lexicalSets.choice->maybeFst(stress)
  | "U" => lexicalSets.foot->maybeFst(stress)
  | "UH" => lexicalSets.strut->maybeFst(stress)
  | "UR" => lexicalSets.nurse->maybeFst(stress)
  // if (!hasPrimary && !hasSecondary) {
  // if (!ahead1 && unambiguousBeforeR.includes(behind)) {
  // consonants.R
  // }
  // lexicalSets.lettER
  // }
  // syllabic consonants
  | "EL" =>
    switch (ahead1, behind) {
    | (None, Some(behind)) when unambiguousBeforeL->includes(behind) => consonants.el->Some
    | _ => Some(lexicalSets.comma ++ consonants.l)
    }
  | "EM" =>
    switch (ahead1, behind) {
    | (None, Some(behind)) when unambiguousBeforeM->includes(behind) => consonants.em->Some
    | _ => Some(lexicalSets.comma ++ consonants.m)
    }
  | "EN" =>
    switch (ahead1, behind) {
    | (None, Some(behind)) | (Some("'"), Some(behind)) when unambiguousBeforeN->includes(behind) =>
      consonants.en->Some
    | _ => Some(lexicalSets.comma ++ consonants.n)
    }
  // consonants
  | "NG" =>
    switch ahead1 {
    | Some("G") | Some("K") => consonants.n->Some
    | _ => consonants.ng->Some
    }
  | "RR" =>
    switch behind {
    | None => consonants.crv->Some
    | Some(_) when !isVowel(behind) => consonants.crv->Some
    | _ => consonants.vrv->Some
    }
  | "S" =>
    switch (behind, ahead1) {
    | (Some(_), None) => consonants.vs->Some // ss
    | (behind, ahead1) when isVowel(behind) && isVowel(ahead1) => consonants.vs->Some // ss
    | _ => consonants.cs->Some
    }
  | "Z" =>
    switch (behind, ahead1) {
    | (behind, ahead1) when !isVowel(behind) && isVowel(ahead1) => consonants.zv->Some // z
    | (behind, Some(_)) when isVowel(behind) && !isVowel(ahead1) => consonants.zv->Some // ss
    | _ => consonants.zc->Some
    }
  | "B" => consonants.b->maybeRedub
  | "CH" => consonants.ch->maybeRedub
  | "D" => consonants.d->maybeRedub
  | "DH" => consonants.dh->maybeRedub
  | "F" => consonants.f->maybeRedub
  | "G" => consonants.g->maybeRedub
  | "HH" => consonants.hh->maybeRedub
  | "J" => consonants.j->maybeRedub
  | "K" => consonants.k->maybeRedub
  | "L" => consonants.l->maybeRedub
  | "M" => consonants.m->maybeRedub
  | "N" => consonants.n->maybeRedub
  | "P" => consonants.p->maybeRedub
  | "SH" => consonants.sh->maybeRedub
  | "T" => consonants.t->maybeRedub
  | "TH" => consonants.th->maybeRedub
  | "V" => consonants.v->maybeRedub
  | "W" => consonants.w->maybeRedub
  | "WH" => consonants.wh->maybeRedub
  | "Y" => consonants.y->maybeRedub
  | "ZH" => consonants.zh->maybeRedub
  | _ =>
    // we have to compare these manually because rescript doesn't like unicode
    if symbolNoS == `ə` {
      lexicalSets.comma->Some
    } else if symbolNoS == `əR` {
      switch (ahead1, behind) {
      | (None, Some(behind)) when unambiguousBeforeR->includes(behind) => consonants.er->Some
      | _ => lexicalSets.letter->Some
      }
    } else {
      None
    }
  }
}

let processPhoneme = (
  ~symbol: string,
  ~behind: option<string>,
  ~ahead1: option<string>,
  ~ahead2: option<string>,
  ~state: assembleState,
  ~settings: conversionSettings,
  ~withStress: bool,
) => {
  open Js.String2
  let reduplicate = state.reduplicateNext
  let reduplicateNext = ref(false) // reset

  let hasPrimary = symbol->sliceToEnd(~from=-1) == "1"
  let hasStressMarker = ["0", "1", "2"]->Js.Array2.includes(symbol->sliceToEnd(~from=-1))
  let symbolNoS = hasStressMarker ? symbol->slice(~from=0, ~to_=-1) : symbol
  let stress = withStress && hasPrimary

  let (symbolNoS, toAppend) = if settings.longToShort && isOpenSyllable(ahead1, ahead2) {
    switch longToShortMap->safeGetD(symbolNoS) {
    | Result(newSymbol) => (newSymbol, isVowel(ahead1) ? "'" : "")
    | _ => {
        if shortVowels->Js.Array2.includes(symbolNoS) {
          reduplicateNext := true
        }
        (symbolNoS, "")
      }
    }
  } else {
    (symbolNoS, "")
  }

  let newLetters = convertSymbol(
    ~symbolNoS,
    ~behind,
    ~ahead1,
    ~stress,
    ~withMerger=settings.withMerger,
    ~reduplicate,
    ~lexicalSets=settings.lexicalSets,
    ~consonants=settings.consonants,
  )
  let newLetters = unwrapS(newLetters, symbol)

  // avoid ambiguities by inserting apostrophes when two times the same vowel
  // appears across phoneme boundaries or when the combinations
  // c+h or s+h appear
  let lastOld = state.result->sliceToEnd(~from=-1)->safeGetS(0)
  let firstNew = newLetters->safeGetS(0)
  let separator = switch (lastOld, firstNew) {
  | (Some(lastOld), Some(firstNew)) =>
    if (
      (`aeiouyáéíóúýāēīōū`->includes(lastOld) && lastOld == firstNew) ||
        ((lastOld == "c" || lastOld == "s") && firstNew == "h")
    ) {
      "'"
    } else if lastOld == "d" && firstNew == "j" {
      "h"
    } else {
      ""
    }
  | _ => ""
  }

  let result = state.result ++ separator ++ newLetters ++ toAppend

  {result: result, reduplicateNext: reduplicateNext.contents}
}

/**
 * Assemble the spelling from the pronunciation
 */
let assemble = (phons: array<string>, settings: conversionSettings): string => {
  open Js.Array2
  open Js.String2
  let initialState = {result: "", reduplicateNext: false}
  let numSyllables = countVowels(phons)
  let withStress = settings.withStress && numSyllables >= 2
  let phons = if settings.longToShort {
    phons->reduce((newPhons, symbol) => {
      if symbol->Js.String2.slice(~from=0, ~to_=-1) == "IA" {
        // replace the IA symbol with IH + ə,
        // so that the right representation of ə can be chosen
        newPhons->push("IH" ++ symbol->sliceToEnd(~from=-1))->ignore
        newPhons->push(`ə`)->ignore
      } else {
        newPhons->push(symbol)->ignore
      }
      newPhons
    }, [])
  } else {
    phons
  }

  let finalState = phons->reducei((state, symbol, i) => {
    let ahead1: option<string> = phons->safeGet(i + 1)
    let ahead2: option<string> = phons->safeGet(i + 2)
    let behind1: option<string> = phons->safeGet(i - 1)
    // if the previous symbol is the apostrophe, then use the one before that
    let behind = switch behind1 {
    | Some("'") => phons->safeGet(i - 2)
    | x => x
    }
    processPhoneme(~symbol, ~behind, ~ahead1, ~ahead2, ~state, ~settings, ~withStress)
  }, initialState)
  finalState.result
}
