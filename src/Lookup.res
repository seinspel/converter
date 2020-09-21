open Utils
open Assemble

type entry = Single(string) | Multiple(array<string>) | Variants(Js.Dict.t<string>)

type request
@bs.get external responseText: request => string = "responseText"

type globalDocument
type domElement = {@bs.set "value": string, "checked": bool}
@bs.send external getElementById: (globalDocument, string) => domElement = "getElementById"
@bs.val external document: globalDocument = "document"

/* let dict = ref( */
/* Js.Dict.fromArray([ */
/* ("FIRST", Js.Json.string("simple")), */
/* ("SECOND", Js.Json.stringArray(["a", "bit", "more", "complicated"])), */
/* ("THIRD", */
/* Js.Json.object_( */
/* Js.Dict.fromArray([("some", Js.Json.string("mapping")), ("or", Js.Json.string("so"))]), */
/* ), */
/* ), */
/* ]) */
/* ) */

let dict: ref<Js.Dict.t<Js.Json.t>> = ref(Js.Dict.empty())

/*
Usage:
const oReq = new XMLHttpRequest()
oReq.addEventListener('load', function() {lookup.loadDict(oReq)})
oReq.open('GET', './data/dictionary.json')
oReq.send()
*/
let loadDict = (req: request): unit => {
  open Js.Json
  try {
    let parsed = parseExn(req->responseText)
    switch classifyJson(parsed) {
    | JSONObject(value) => dict := value
    | _ => ()
    }
  } catch {
  | _ => Js.log("Parsing of dictionary failed.")
  }
}

// let convertToString = (t): string => {
// t->Js.Json.decodeString->unwrap("")
// }

// this version does not require valFromOption
let convertToString = (t: Js.Json.t): string =>
  switch safeCastToString(t) {
  | Some(value) => value
  | None => ""
  }

let convertToStringU = (. t): string => convertToString(t)

let lookup = (s: string): option<entry> => {
  open Js.Json
  let result = dict.contents->safeGetD(s->Js.String.toUpperCase)

  switch result {
  | Result(result) =>
    switch classifyJson(result) {
    | JSONObject(value) => Some(Variants(value->mapD(convertToStringU)))
    | JSONArray(value) => Some(Multiple(value->Js.Array2.map(convertToString)))
    | JSONString(value) => Some(Single(value))
    | _ => None
    }
  | _ => None
  }
}

let decodePhonemes = (letters: string): array<string> => {
  open AsciiDecompression
  open Js.Dict
  Js.String2.castToArrayLike(letters)->Js.Array2.fromMap(x => asciiDecompression->unsafeGet(x))
}

let loadSpelling = (): (Constants.lexicalSetsType, Constants.consonantsType) => {
  let vowels: Constants.lexicalSetsType = {
    kit: ("", (document->getElementById("kit-vowel"))["value"]),
    dress: ("", (document->getElementById("dress-vowel"))["value"]),
    trap: ("", (document->getElementById("trap-vowel"))["value"]),
    lot: ("", (document->getElementById("lot-vowel"))["value"]),
    strut: ("", (document->getElementById("strut-vowel"))["value"]),
    foot: ("", (document->getElementById("foot-vowel"))["value"]),
    cloth: ("", (document->getElementById("cloth-vowel"))["value"]),
    nurse: ("", (document->getElementById("nurse-vowel"))["value"]),
    fleece: ("", (document->getElementById("fleece-vowel"))["value"]),
    face: ("", (document->getElementById("face-vowel"))["value"]),
    palm: ("", (document->getElementById("palm-vowel"))["value"]),
    thought: ("", (document->getElementById("thought-vowel"))["value"]),
    goat: ("", (document->getElementById("goat-vowel"))["value"]),
    goose: ("", (document->getElementById("goose-vowel"))["value"]),
    price: ("", (document->getElementById("price-vowel"))["value"]),
    choice: ("", (document->getElementById("choice-vowel"))["value"]),
    mouth: ("", (document->getElementById("mouth-vowel"))["value"]),
    cute: ("", (document->getElementById("cute-vowel"))["value"]),
    near: ("", (document->getElementById("near-vowel"))["value"]),
    square: ("", (document->getElementById("square-vowel"))["value"]),
    start: ("", (document->getElementById("start-vowel"))["value"]),
    north: ("", (document->getElementById("north-vowel"))["value"]),
    poor: ("", (document->getElementById("poor-vowel"))["value"]),
    cure: ("", (document->getElementById("cure-vowel"))["value"]),
    fire: ("", (document->getElementById("fire-vowel"))["value"]),
    flour: ("", (document->getElementById("flour-vowel"))["value"]),
    coir: ("", (document->getElementById("coir-vowel"))["value"]),
    ian: ("", (document->getElementById("ian-vowel"))["value"]),
    happy: (document->getElementById("happy-vowel"))["value"],
    letter: (document->getElementById("letter-vowel"))["value"],
    comma: (document->getElementById("comma-vowel"))["value"],
  }
  let consonants: Constants.consonantsType = {
    b: (document->getElementById("b-consonant"))["value"],
    ch: (document->getElementById("ch-consonant"))["value"],
    d: (document->getElementById("d-consonant"))["value"],
    dh: (document->getElementById("dh-consonant"))["value"],
    el: (document->getElementById("el-consonant"))["value"],
    em: (document->getElementById("em-consonant"))["value"],
    en: (document->getElementById("en-consonant"))["value"],
    er: (document->getElementById("er-consonant"))["value"],
    f: (document->getElementById("f-consonant"))["value"],
    g: (document->getElementById("g-consonant"))["value"],
    hh: (document->getElementById("h-consonant"))["value"],
    j: (document->getElementById("j-consonant"))["value"],
    k: (document->getElementById("k-consonant"))["value"],
    l: (document->getElementById("l-consonant"))["value"],
    m: (document->getElementById("m-consonant"))["value"],
    n: (document->getElementById("n-consonant"))["value"],
    ng: (document->getElementById("ng-consonant"))["value"],
    p: (document->getElementById("p-consonant"))["value"],
    crv: (document->getElementById("crv-consonant"))["value"],
    vrv: (document->getElementById("vrv-consonant"))["value"],
    cs: (document->getElementById("s-consonant-un"))["value"],
    vs: (document->getElementById("s-consonant-am"))["value"],
    sh: (document->getElementById("sh-consonant"))["value"],
    t: (document->getElementById("t-consonant"))["value"],
    th: (document->getElementById("th-consonant"))["value"],
    v: (document->getElementById("v-consonant"))["value"],
    w: (document->getElementById("w-consonant"))["value"],
    wh: (document->getElementById("wh-consonant"))["value"],
    y: (document->getElementById("y-consonant"))["value"],
    zc: (document->getElementById("z-consonant-un"))["value"],
    zv: (document->getElementById("z-consonant-am"))["value"],
    zh: (document->getElementById("zh-consonant"))["value"],
  }
  (vowels, consonants)
}

let snd = (tuple: ('a, 'b)): 'b => {
  let (_, second) = tuple
  second
}

/**
 * Write spelling to the text inputs
 */
let writeSpelling = (vowels: Constants.lexicalSetsType, consonants: Constants.consonantsType) => {
  // vowels
  (document->getElementById("kit-vowel"))["value"] = vowels.kit->snd
  (document->getElementById("dress-vowel"))["value"] = vowels.dress->snd
  (document->getElementById("trap-vowel"))["value"] = vowels.trap->snd
  (document->getElementById("lot-vowel"))["value"] = vowels.lot->snd
  (document->getElementById("strut-vowel"))["value"] = vowels.strut->snd
  (document->getElementById("foot-vowel"))["value"] = vowels.foot->snd
  (document->getElementById("cloth-vowel"))["value"] = vowels.cloth->snd
  (document->getElementById("nurse-vowel"))["value"] = vowels.nurse->snd
  (document->getElementById("fleece-vowel"))["value"] = vowels.fleece->snd
  (document->getElementById("face-vowel"))["value"] = vowels.face->snd
  (document->getElementById("palm-vowel"))["value"] = vowels.palm->snd
  (document->getElementById("thought-vowel"))["value"] = vowels.thought->snd
  (document->getElementById("goat-vowel"))["value"] = vowels.goat->snd
  (document->getElementById("goose-vowel"))["value"] = vowels.goose->snd
  (document->getElementById("price-vowel"))["value"] = vowels.price->snd
  (document->getElementById("choice-vowel"))["value"] = vowels.choice->snd
  (document->getElementById("mouth-vowel"))["value"] = vowels.mouth->snd
  (document->getElementById("cute-vowel"))["value"] = vowels.cute->snd
  (document->getElementById("near-vowel"))["value"] = vowels.near->snd
  (document->getElementById("square-vowel"))["value"] = vowels.square->snd
  (document->getElementById("start-vowel"))["value"] = vowels.start->snd
  (document->getElementById("north-vowel"))["value"] = vowels.north->snd
  (document->getElementById("poor-vowel"))["value"] = vowels.poor->snd
  (document->getElementById("cure-vowel"))["value"] = vowels.cure->snd
  (document->getElementById("fire-vowel"))["value"] = vowels.fire->snd
  (document->getElementById("flour-vowel"))["value"] = vowels.flour->snd
  (document->getElementById("coir-vowel"))["value"] = vowels.coir->snd
  (document->getElementById("ian-vowel"))["value"] = vowels.ian->snd
  (document->getElementById("happy-vowel"))["value"] = vowels.happy
  (document->getElementById("letter-vowel"))["value"] = vowels.letter
  (document->getElementById("comma-vowel"))["value"] = vowels.comma
  // consonants
  (document->getElementById("b-consonant"))["value"] = consonants.b
  (document->getElementById("ch-consonant"))["value"] = consonants.ch
  (document->getElementById("d-consonant"))["value"] = consonants.d
  (document->getElementById("dh-consonant"))["value"] = consonants.dh
  (document->getElementById("el-consonant"))["value"] = consonants.el
  (document->getElementById("em-consonant"))["value"] = consonants.em
  (document->getElementById("en-consonant"))["value"] = consonants.en
  (document->getElementById("er-consonant"))["value"] = consonants.er
  (document->getElementById("f-consonant"))["value"] = consonants.f
  (document->getElementById("g-consonant"))["value"] = consonants.g
  (document->getElementById("h-consonant"))["value"] = consonants.hh
  (document->getElementById("j-consonant"))["value"] = consonants.j
  (document->getElementById("k-consonant"))["value"] = consonants.k
  (document->getElementById("l-consonant"))["value"] = consonants.l
  (document->getElementById("m-consonant"))["value"] = consonants.m
  (document->getElementById("n-consonant"))["value"] = consonants.n
  (document->getElementById("ng-consonant"))["value"] = consonants.ng
  (document->getElementById("p-consonant"))["value"] = consonants.p
  (document->getElementById("crv-consonant"))["value"] = consonants.crv
  (document->getElementById("vrv-consonant"))["value"] = consonants.vrv
  (document->getElementById("s-consonant-un"))["value"] = consonants.cs
  (document->getElementById("s-consonant-am"))["value"] = consonants.vs
  (document->getElementById("sh-consonant"))["value"] = consonants.sh
  (document->getElementById("t-consonant"))["value"] = consonants.t
  (document->getElementById("th-consonant"))["value"] = consonants.th
  (document->getElementById("v-consonant"))["value"] = consonants.v
  (document->getElementById("w-consonant"))["value"] = consonants.w
  (document->getElementById("wh-consonant"))["value"] = consonants.wh
  (document->getElementById("y-consonant"))["value"] = consonants.y
  (document->getElementById("z-consonant-un"))["value"] = consonants.zc
  (document->getElementById("z-consonant-am"))["value"] = consonants.zv
  (document->getElementById("zh-consonant"))["value"] = consonants.zh
}

let setPreset = preset => {
  let (vowels, consonants) = switch preset {
  | "european" => (Constants.lexicalSetsEuropean, Constants.consonantsEuropean)
  | "asian" => (Constants.lexicalsetsAsian, Constants.consonantsAsian)
  | _ => (Constants.lexicalsetsEnglish, Constants.consonantsEnglish)
  }
  writeSpelling(vowels, consonants)
}

let figureOutCapitalization = (original: string, converted: string): string => {
  open Js.String2
  if original == "I" {
    // special case
    converted
  } else if original->toUpperCase == original && original->toUpperCase != "A" {
    // all caps
    converted->toUpperCase
  } else if original->get(0) == "'" {
    converted
  } else if original->get(0)->toUpperCase == original->get(0) {
    // only first letter is upper case
    // (or more precisely: not all letters are upper case but the first one is)
    converted->get(0)->toUpperCase ++ converted->sliceToEnd(~from=1)
  } else {
    converted
  }
}

let addSuffix = (
  lookupResults: option<entry>,
  ~suffix: string,
  ~identifiers: array<string>,
): option<array<string>> => {
  open Js.Array2
  switch lookupResults {
  | None => None
  | Some(Single(pronun)) => Some([pronun ++ suffix])
  // if array, just append
  | Some(Multiple(pronuns)) => pronuns->map(x => x ++ suffix)->Some

  | Some(Variants(pronunVars)) =>
    entries(pronunVars)
    ->filter(((k, _)) => identifiers->includes(k))
    ->map(((_, v)) => v ++ suffix)
    ->Some
  }
}

type words = array<string>

/**
 * Find the base form for derived words that e.g. end in -ing or -ed
 */
let findBaseForm = (chunk: string): option<words> => {
  open Js.String2
  let chunkUpper = chunk->toUpperCase
  let chunkLast1 = chunkUpper->sliceToEnd(~from=-1)
  let chunkLast2 = chunkUpper->sliceToEnd(~from=-2)
  let chunkLast3 = chunkUpper->sliceToEnd(~from=-3)
  // ====================== try different suffixes ========================
  switch (chunkLast3, chunkLast2, chunkLast1) {
  | ("ING", _, _) => {
      let result = switch lookup(chunk->slice(~from=0, ~to_=-3)) {
      | None => lookup(chunk->slice(~from=0, ~to_=-3) ++ "E")
      | x => x
      }
      addSuffix(result, ~suffix="=m" /* IH0 NG */, ~identifiers=["v"] /* verb */)
    }
  | (_, _, "S") => {
      let resultSS = if chunkLast3 == "S'S" {
        addSuffix(
          lookup(chunk->slice(~from=0, ~to_=-3)),
          ~suffix="x'x" /* Z ' Z */,
          ~identifiers=["n"] /* noun */,
        )
      } else {
        None
      }
      switch resultSS {
      | None => {
          let resultPosessive = if chunkLast2 == "'S" {
            addSuffix(
              lookup(chunk->slice(~from=0, ~to_=-2)),
              ~suffix="'x" /* ' Z */,
              ~identifiers=["n"] /* noun */,
            )
          } else {
            None
          }
          switch resultPosessive {
          | None =>
            addSuffix(
              lookup(chunk->slice(~from=0, ~to_=-1)),
              ~suffix="x" /* Z */,
              ~identifiers=["n", "v"] /* noun or verb */,
            )
          | x => x
          }
        }
      | x => x
      }
    }
  | (_, "ED", _) => {
      let result = switch lookup(chunk->slice(~from=0, ~to_=-2)) {
      | None => lookup(chunk->slice(~from=0, ~to_=-1))
      | x => x
      }
      addSuffix(result, ~suffix="c" /* D */, ~identifiers=["v"] /* verb */)
    }
  | (_, "LY", _) => {
      let resultLLY = if chunkLast3 == "LLY" {
        addSuffix(
          lookup(chunk->slice(~from=0, ~to_=-3)),
          ~suffix="}" /* II */,
          ~identifiers=["j"] /* adjective */,
        )
      } else {
        None
      }
      switch resultLLY {
      | None =>
        addSuffix(
          lookup(chunk->slice(~from=0, ~to_=-2)),
          ~suffix="j}" /* L II */,
          ~identifiers=["j"] /* adjective */,
        )
      | x => x
      }
    }
  | _ => None
  }
}

let convertToSpelling = (
  chunk: string,
  lookupResults: words,
  settings: conversionSettings,
): string => {
  // ================== convert pronunciation to spelling ===================
  open Js.Array2
  let allConverted = lookupResults->map(variant => {
    let phons = decodePhonemes(variant)
    let converted = assemble(phons, settings)
    figureOutCapitalization(chunk, converted)
  })
  if allConverted->length == 1 {
    allConverted->unsafe_get(0)
  } else {
    `(${allConverted->joinWith("/")})`
  }
}

/**
 * Convert a text in normal English to new English
 */
let convertText = (text: string, settings: conversionSettings): string => {
  open Js.String2
  open Js.Array2
  let chunks = text->replaceByRe(%re("/’/gi"), "'")->splitByRe(%re("/([^a-zA-Z'])/"))
  Js.log(chunks)
  chunks->reduce((result, maybeChunk) =>
    switch maybeChunk {
    | None => result
    | Some(chunk) when !Js.Re.test_(%re("/[a-zA-Z]/"), chunk) =>
      // chunk is a special character, like a space or a comma
      result ++ chunk
    | Some(chunk) =>
      switch lookup(chunk) {
      | None =>
        switch findBaseForm(chunk) {
        // no entry was found see, if we can find a base form
        | None => `${result}<${chunk}>` // we didn't find anything -> abort this
        | Some(lookupResults) => result ++ convertToSpelling(chunk, lookupResults, settings)
        }
      | Some(lookupResults) => {
          let words = switch lookupResults {
          | Single(word) => [word]
          | Multiple(words) => words
          | Variants(variants) => variants->values
          }
          result ++ convertToSpelling(chunk, words, settings)
        }
      }
    }
  , "")
}

let processText = () => {
  let text = (document->getElementById("input"))["value"]
  let withMerger = (document->getElementById("withMerger"))["checked"]
  let withStress = (document->getElementById("withStress"))["checked"]
  let withMacrons = (document->getElementById("withMacrons"))["checked"]
  let longToShort = (document->getElementById("longToShort"))["checked"]
  if withMacrons {
    Constants.setSpelling(Constants.lexicalsetsMacron, Constants.consonantsMacron)
  } else if withStress {
    Constants.setSpelling(Constants.lexicalSetsEuropean, Constants.consonantsEuropean)
  } else {
    let (lexicalSets, consonants) = loadSpelling()
    Constants.setSpelling(lexicalSets, consonants)
  }
  let result = convertText(
    text,
    {withStress: withStress, withMerger: withMerger, longToShort: longToShort},
  )
  let output = document->getElementById("output")
  output["value"] = result
}

let tests = () => {
  let inputField = document->getElementById("input")
  inputField["value"] = `Foreskin SEEING dying saying behalf suing teriyaki
evacuate boyhood adhere bloodshed midyear knowing away short awestruck withhold
adulthood malevolent criminal fewer lure neurology careless what's think
nighttime Mary merry marry mirror nearer hurry furry horror lore`
}

Constants.setSpelling(Constants.lexicalSetsEuropean, Constants.consonantsEuropean)
Js.log(
  convertText("First second reading.", {withStress: false, withMerger: false, longToShort: true}),
)
