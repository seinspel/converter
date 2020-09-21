import * as lookup from './Lookup.bs.js'
import * as controller from './Controller.bs.js'

// set handlers for buttons
document.getElementById('clickbutton').addEventListener('click', lookup.processText, false)
document.getElementById('testcases').addEventListener('click', lookup.tests, false)
document.getElementById('english-pronunciations').addEventListener('click', () => { controller.setPreset('english') }, false)
document.getElementById('european').addEventListener('click', () => {controller.setPreset('european') }, false)
document.getElementById('asian').addEventListener('click', () => { controller.setPreset('asian') }, false)

// download dictionary
const oReq = new XMLHttpRequest()
oReq.addEventListener('load', () => { lookup.loadDict(oReq) })
oReq.open('GET', './data/dictionary.json')
oReq.send()
