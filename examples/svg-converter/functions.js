
//this file contains functions used in index.html

var globalContainer;
//sets the worker src and if it should be used or not
function initPdf( displayDiv ){

	//reads the input from index.html
	globalContainer = displayDiv;


}

//reloads the viewer with fileName from a file in file dirr
function reloadPdf(fileName){
	globalContainer.innerHTML = "";
	fileName = fileName || "testPdf.pdf";
	loadPdf(fileName);
}

//loads the pdf
function loadPdf(fileName){

	var baseUrl = "";
	var url = (baseUrl + fileName);

	//
	// Asynchronous download PDF
	//
	return PDFJS.getDocument(url).then( convertPdfToSvg );
}

//variable to hook download func on later
var downloadSvg;

//converts a pdf to svg. fix: only converting first page
function convertPdfToSvg( pdf ){
	console.log("pages cont", pdf.numPages);
	//fecthes the first page and converts it to svg
	return pdf.getPage(1).then( getPageHelloWorld );



}

function getPageHelloWorld(page){
	//sets the viewport
	var scale = 1.0;
	var viewport = page.getViewport(scale);

	//downloads the pdf as a svg and displays is on document body
	var stringPromise = displaySvg(page, viewport);
	return stringPromise;

};
//appends the svg to globalContainer then returns string ready for download
function displaySvg( page, viewport ){

	//gets the opList
	return page.getOperatorList().then(function (opList) {

			//creates svgGraphics from page
			var svgGfx = new PDFJS.SVGGraphics(page.commonObjs, page.objs);

			//gets the svg and displays it. Then returns the string	
			return svgGfx.getSVG(opList, viewport).then(function (svg) {

					//debug
					globalSvg = svg;


					//shows the svg in the document
					globalContainer.appendChild(svg);

					//we do not want the string to have svg: before everything. We also want to add xmlns standard so we can open it without renderer
					var replacedString = svg.outerHTML.replace(/svg:/g,"");
					var outString = replacedString.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');

					//saves the file with savefile lib
					return outString; 


					});
	});


};




