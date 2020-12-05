import * as lookup from './lib/es6/src/Lookup.mjs'
import * as controller from './lib/es6/src/Controller.mjs'

// set handlers for buttons
document.getElementById('clickbutton').addEventListener('click', lookup.processText, false)
document.getElementById('testcases').addEventListener('click', lookup.tests, false)
document.getElementById('english-pronunciations').addEventListener('click', () => { controller.setPreset('english') }, false)
document.getElementById('european').addEventListener('click', () => {controller.setPreset('european') }, false)
document.getElementById('asian').addEventListener('click', () => { controller.setPreset('asian') }, false)
document.getElementById('greek').addEventListener('click', () => { controller.setPreset('greek') }, false)
document.getElementById('russian').addEventListener('click', () => { controller.setPreset('russian') }, false)

// download dictionary
const oReq = new XMLHttpRequest()
oReq.addEventListener('load', () => { lookup.loadDict(oReq) })
oReq.open('GET', './data/dictionary.json')
oReq.send()
