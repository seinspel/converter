import * as lookup from './lookup.mjs'

// set handlers for buttons
document.getElementById('clickbutton').addEventListener('click', lookup.process, false)
document.getElementById('testcases').addEventListener('click', lookup.tests, false)
document.getElementById('english-pronunciations').addEventListener('click', () => { lookup.setPreset('english') }, false)
document.getElementById('european').addEventListener('click', () => { lookup.setPreset('european') }, false)
document.getElementById('asian').addEventListener('click', () => { lookup.setPreset('asian') }, false)

// download dictionary
const oReq = new XMLHttpRequest()
oReq.addEventListener('load', lookup.loadDict)
oReq.open('GET', './data/dictionary.json')
oReq.send()
