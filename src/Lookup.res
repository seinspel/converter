open Utils
open Assemble

type entry = Single(string) | Multiple(array<string>) | Variants(Js.Dict.t<string>)

type request
@get external responseText: request => string = "responseText"

let dict: ref<Js.Dict.t<Js.Json.t>> = ref(Js.Dict.empty())

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
          lookup(chunk->slice(~from=0, ~to_=-2)),
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

/**
 * Convert a single word.
 */
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
  //Js.log(chunks)
  chunks->reduce((result, maybeChunk) =>
    switch maybeChunk {
    | None => result
    | Some(chunk) if !Js.Re.test_(%re("/[a-zA-Z]/"), chunk) =>
      // chunk is a special character, like a space or a comma
      result ++ chunk
    | Some(chunk) =>
      switch lookup(chunk) {
      | None =>
        switch findBaseForm(chunk) {
        // no entry was found see, if we can find a base form
        | None => result ++ chunk // we didn't find anything -> abort this
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
  // let withMerger = (document->getElementById("withMerger"))["checked"]
  let withMerger = false
  let withStress = (document->getElementById("withStress"))["checked"]
  let withMacrons = (document->getElementById("withMacrons"))["checked"]
  let longToShort = (document->getElementById("longToShort"))["checked"]
  let impliedLong = (document->getElementById("impliedLong"))["checked"]
  let (lexicalSets, consonants) = if withMacrons {
    (Constants.lexicalsetsMacron, Constants.consonantsMacron)
  } else if withStress {
    (Constants.lexicalsetsGreek, Constants.consonantsGreek)
    /* (Constants.lexicalSetsEuropean, Constants.consonantsEuropean) */
  } else {
    let (lexicalSets, consonants) = Controller.loadSpelling()
    (lexicalSets, consonants)
  }
  let result = convertText(
    text,
    {
      withStress,
      withMerger,
      longToShort,
      impliedLong,
      lexicalSets,
      consonants,
    },
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
