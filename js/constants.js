'use strict'

// use like this (define an array with 2 entries for each set):
// const stress = stressed ? 0 : 1
// lexicalSets.DRESS[stress]
const LEXICALSETS = {
  TRAP: ['á', 'a'],
  DRESS: ['é', 'e'],
  KIT: ['í', 'i'],
  STRUT: ['ý', 'y'],
  FOOT: ['ú', 'u'],
  LOT: ['áa', 'aa'],
  FACE: ['éi', 'ei'],
  FLEECE: ['íi', 'ii'],
  GOAT: ['óu', 'ou'],
  GOOSE: ['úu', 'uu'],
  THOUGHT: ['óo', 'oo'],
  PRICE: ['ái', 'ai'],
  MOUTH: ['áu', 'au'],
  CHOICE: ['ói', 'oi'],
  START: ['áar', 'aar'],
  SQUARE: ['éir', 'eir'],
  NEAR: ['íir', 'iir'],
  FORCE: ['óor', 'oor'],
  NURSE: ['úr', 'ur'],
  LURE: ['úur', 'uur'],
  happY: 'i',
  lettER: 'ur',
  commA: 'e'
}

const LEXICALSETS_MACRON = {
  TRAP: ['á', 'a'],
  DRESS: ['é', 'e'],
  KIT: ['í', 'i'],
  STRUT: ['ý', 'y'],
  FOOT: ['ú', 'u'],
  LOT: ['ā', 'ā'],
  FACE: ['ē', 'ē'],
  FLEECE: ['ī', 'ī'],
  GOAT: ['óu', 'ou'],
  GOOSE: ['ū', 'ū'],
  THOUGHT: ['ō', 'ō'],
  PRICE: ['ái', 'ai'],
  MOUTH: ['áu', 'au'],
  CHOICE: ['ói', 'oi'],
  START: ['ār', 'ār'],
  SQUARE: ['ēr', 'ēr'],
  NEAR: ['īr', 'īr'],
  FORCE: ['ōr', 'ōr'],
  NURSE: ['úr', 'ur'],
  LURE: ['ūr', 'ūr'],
  happY: 'i',
  lettER: 'ur',
  commA: 'e'
}

const CONSONANTS = {
  B: 'b',
  CH: 'tc',
  D: 'd',
  DH: 'q',
  F: 'f',
  G: 'g',
  HH: 'h',
  JH: 'dj',
  K: 'k',
  L: 'l',
  M: 'm',
  N: 'n',
  NG: 'ng',
  P: 'p',
  R: 'r',
  S: 's',
  SH: 'c',
  T: 't',
  TH: 'x',
  V: 'v',
  W: 'w',
  Y: 'j',
  Z: 'z',
  ZH: 'jh'
}