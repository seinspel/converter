import * as lookup from '../lib/es6/src/Lookup.mjs'
import * as constants from "../lib/es6/src//Constants.mjs";

var dict_json = {
  "FIRST": "eXpr",
  "PROGRESS": {"v": "noBfo/p", "n": "no;fo0p"}
};

lookup.loadDict({responseText: JSON.stringify(dict_json)});

var settings = {
  withStress: true,
  withMerger: false,
  longToShort: true,
  lexicalSets: constants.lexicalSetsEuropean,
  consonants: constants.consonantsEuropean
};

console.log(lookup.convertText("First progress.", settings));
