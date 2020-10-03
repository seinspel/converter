open Utils

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

@inline
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
