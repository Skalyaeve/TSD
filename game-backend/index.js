const jsdom = require('jsdom')
const { JSDOM } = jsdom;


(async function () {
	global.dom = await JSDOM.fromFile('index.html', {
		// To run the scripts in the html file
		runScripts: "dangerously",
		// Also load supported external resources
		resources: "usable",
		// So requestAnimatinFrame events fire
		pretendToBeVisual: true
	})
})()