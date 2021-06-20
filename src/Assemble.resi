type conversionSettings = {
  withStress: bool,
  withMerger: bool,
  longToShort: bool,
  impliedLong: bool,
  lexicalSets: Constants.lexicalSetsType,
  consonants: Constants.consonantsType,
}
let assemble: (array<string>, conversionSettings) => string
