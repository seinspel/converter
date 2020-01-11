import * as lookup from './lookup.mjs'

// set handler for 'convert' button
const clickButton = document.getElementById('clickbutton')
clickButton.addEventListener('click', lookup.process, false)
document.getElementById('testcases').addEventListener('click', lookup.tests, false)

// download dictionary
const oReq = new XMLHttpRequest()
oReq.addEventListener('load', lookup.loadDict)
oReq.open('GET', './data/dictionary.json')
oReq.send()
