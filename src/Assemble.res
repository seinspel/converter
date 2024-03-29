open Utils

type conversionSettings = {
  withStress: bool,
  withMerger: bool,
  longToShort: bool,
  impliedLong: bool,
  lexicalSets: Constants.lexicalSetsType,
  consonants: Constants.consonantsType,
}

let pureVowels = [
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
  `ə`,
]

let rVowels = ["AR", "EIR", "EWR", "IER", "IRE", "OIR", "OOR", "OR", "OWR", "UR", `əR`]
let partVowels = ["EL", "EM", "EN"]

let vowels = () => pureVowels->Js.Array2.concatMany([rVowels, partVowels])
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

let voicelessCons = ["CH", "F", "K", "P", "S", "SH", "T", "TH"]

let longToShortMap: Js.Dict.t<string> = %raw(`{
  'AH': 'A',
  'EY': 'EH',
  'EE': 'IH',
  'OH': 'O',
  'OO': 'U',
  'ə': 'A'
}`)

let shortVowels = ["A", "EH", "IH", "O", "OA", "U", "UH"]

/**
 * for-loops are unfortunately much faster than forEach or reduce in JS
 *
 * The function passed in should ideally be @inline
 */
@inline
let reduceLoop = (a, f, x) => {
  let r = ref(x)
  for i in 0 to Js.Array2.length(a) - 1 {
    r := f(r.contents, Js.Array2.unsafe_get(a, i), i)
  }
  r.contents
}

let splitOffStress = (symbol: string): (string, bool) => {
  open Js.String2
  let lastChar = symbol->sliceToEnd(~from=-1)
  let hasStressMarker = ["0", "1"]->Js.Array2.includes(lastChar)
  if hasStressMarker {
    (symbol->slice(~from=0, ~to_=-1), lastChar == "1")
  } else {
    (symbol, false)
  }
}

let isVowel = (phon: option<string>, ~ending: bool=false, ()): bool =>
  switch phon {
  | None => false
  | Some(phon) => {
      open Js.Array2
      let (phonNoS, _) = splitOffStress(phon)
      ending ? pureVowels->includes(phonNoS) : vowels()->includes(phonNoS)
    }
  }

let countVowels = (phons: array<string>) =>
  phons->reduceLoop(
    @inline (numVowels, phon, _) => phon->Some->isVowel() ? numVowels + 1 : numVowels,
    0,
  )

/**
 * Try to find out if the given vowel belongs to an open syllable.
 */
let isOpenSyllable = (ahead1: option<string>, ahead2: option<string>): bool =>
  switch ahead1 {
  | None | Some("'") => true
  | ahead1 if ahead1->isVowel() => true
  | _ =>
    switch ahead2 {
    | None | Some("'") => false
    | Some(ahead2)
      if isVowel(Some(ahead2), ()) &&
      !(["EW", "EWR"]->Js.Array2.includes(ahead2->Js.String2.slice(~from=0, ~to_=-1))) => true
    | _ => false
    }
  }

@inline
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
  | "OHR" => lexicalSets.force->maybeFst(stress)
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
    | (None, Some(behind)) if unambiguousBeforeL->includes(behind) => consonants.el->Some
    | _ => Some(lexicalSets.comma ++ consonants.l)
    }
  | "EM" =>
    switch (ahead1, behind) {
    | (None, Some(behind)) if unambiguousBeforeM->includes(behind) => consonants.em->Some
    | _ => Some(lexicalSets.comma ++ consonants.m)
    }
  | "EN" =>
    switch (ahead1, behind) {
    | (None, Some(behind)) | (Some("'"), Some(behind)) if unambiguousBeforeN->includes(behind) =>
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
    | Some(_) if !isVowel(behind, ~ending=true, ()) => consonants.crv->Some
    | _ => consonants.vrv->Some
    }
  | "S" => {
      let postVocalic = isVowel(behind, ~ending=true, ())
      switch (behind, ahead1) {
      | (Some(soundBehind), None) if !(voicelessCons->includes(soundBehind)) => consonants.vs->Some // end of the word -> ss
      | (_, ahead1) if postVocalic && ahead1->isVowel() => consonants.vs->Some // ss
      | _ => consonants.cs->Some // s
      }
    }

  | "Z" => {
      let postVocalic = isVowel(behind, ~ending=true, ())
      switch (behind, ahead1) {
      | (_, ahead1) if !postVocalic && ahead1->isVowel() => consonants.zv->Some // z
      | (_, Some(_)) if postVocalic && !(ahead1->isVowel()) => consonants.zv->Some // z
      | _ => consonants.zc->Some // s
      }
    }

  | "B" => consonants.b->maybeRedub
  | "CH" => consonants.ch->maybeRedub
  | "D" => consonants.d->maybeRedub
  | "DH" => consonants.dh->maybeRedub
  | "F" => consonants.f->maybeRedub
  | "G" => consonants.g->maybeRedub
  | "H" => consonants.hh->maybeRedub
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
      | (None, Some(behind)) if unambiguousBeforeR->includes(behind) => consonants.er->Some
      | _ => lexicalSets.letter->Some
      }
    } else {
      None
    }
  }
}

type assembleState = {result: string, reduplicateNext: bool, isFirstSyllable: bool}

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
  let reduplicateNext = ref(false)

  let (symbolNoS_, hasPrimary) = splitOffStress(symbol)
  let stress = withStress && hasPrimary && !state.isFirstSyllable
  let isFirstSyllable = state.isFirstSyllable ? !(symbol->Some->isVowel()) : false

  let symbolNoS = ref(symbolNoS_)
  let toAppend = ref("")

  if (
    (settings.longToShort && isOpenSyllable(ahead1, ahead2)) ||
      (settings.impliedLong && ahead1 == None)
  ) {
    switch longToShortMap->safeGetD(symbolNoS.contents) {
    | Result(shortVersion) => {
        symbolNoS := shortVersion
        if isVowel(ahead1, ()) {
          toAppend := settings.lexicalSets.seperator
        }
      }

    | _ =>
      if shortVowels->Js.Array2.includes(symbolNoS.contents) {
        reduplicateNext := true
      }
    }
  }

  let newLetters = convertSymbol(
    ~symbolNoS=symbolNoS.contents,
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
      /* (`aeiouyáéíóúýāēīōū`->includes(lastOld) && lastOld == firstNew) || */
      lastOld == firstNew || ((lastOld == "c" || lastOld == "s") && firstNew == "h")
    ) {
      settings.lexicalSets.seperator
    } else if lastOld == "d" && firstNew == "j" {
      "h"
    } else {
      ""
    }
  | _ => ""
  }

  let result = state.result ++ separator ++ newLetters ++ toAppend.contents

  {result, reduplicateNext: reduplicateNext.contents, isFirstSyllable}
}

@inline
let longToShort = (newPhons, symbol, _) => {
  open Js.Array2
  open Js.String2
  if symbol->Js.String2.slice(~from=0, ~to_=-1) == "IA" {
    // replace the IA symbol with IH + ə,
    // so that the right representation of ə can be chosen
    newPhons->push("IH" ++ symbol->sliceToEnd(~from=-1))->ignore
    newPhons->push("ə")->ignore
  } else {
    newPhons->push(symbol)->ignore
  }
  newPhons
}

/**
 * Assemble the spelling of a word from the pronunciation.
 */
let assemble = (phons: array<string>, settings: conversionSettings): string => {
  let initialState = {result: "", reduplicateNext: false, isFirstSyllable: true}
  let numSyllables = countVowels(phons)
  let withStress = settings.withStress && numSyllables >= 2
  let phons = if settings.longToShort {
    phons->reduceLoop(longToShort, [])
  } else {
    phons
  }

  let finalState = phons->reduceLoop(@inline (state, symbol, i) => {
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
