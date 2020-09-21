type conversionSettings = {
  withStress: bool,
  withMerger: bool,
  longToShort: bool,
}
let assemble: (array<string>, conversionSettings) => string
