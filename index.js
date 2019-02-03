'use strict';
const puppeteer = require('puppeteer');
const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const tesseract= require('node-tesseract-ocr');
const tesseractConfig= {
	lang: 'eng',
	oem: 1, 
	psm:3
}
const fs = require('fs');
const sys = require('sys');
const exec = require('child_process').exec;

async function scrapeData(_businessName, res) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	var businessName = _businessName
	
	await page.goto('https://recorder.maricopa.gov/recdocdata/');
	
	//select from dropdown
	await page.select('#ctl00_ContentPlaceHolder1_ddlDocCodes', 'HL')
	await page.waitForNavigation();
	//fill out form
	
	/*
	//last name ctl00_ContentPlaceHolder1_txtLname2
	await page.focus('#ctl00_ContentPlaceHolder1_txtLname2');
	await page.type('#ctl00_ContentPlaceHolder1_txtLname2', 'smith', { delay: 150 });
	
	//first name  ctl00_ContentPlaceHolder1_txtFname2
	await page.focus('#ctl00_ContentPlaceHolder1_txtFname2');
	await page.type('#ctl00_ContentPlaceHolder1_txtFname2', 'smith', { delay: 150 });
	*/
	//business name
	await page.focus('#ctl00_ContentPlaceHolder1_txtName2');
	await page.type('#ctl00_ContentPlaceHolder1_txtName2', businessName, { delay: 150 });
	

	await page.screenshot({ path: 'beforeseraching.png' });
  
	//send request
	//await page.focus('#ctl00_ContentPlaceHolder1_btnSearchPanel1');
	//await page.keyboard.press('Enter');
	await page.click('#ctl00_ContentPlaceHolder1_btnSearchPanel1');
	await page.waitForNavigation();
	
	
	
	
	//await page.$eval('#ctl00_ContentPlaceHolder1_btnSearchPanel1', form => form.submit());
	//await page.waitFor(2000);

	var imageString = './images/CurrentWebPageSearch_'
	imageString += businessName + '.png'
	await page.screenshot({ path: imageString });
	res.redirect(imageString)

//business name in form is ctl00_ContentPlaceHolder1_txtName2
//Document code in form is ctl00_ContentPlaceHolder1_ddlDocCodes default id is HL
//Date code in from is ctl00_ContentPlaceHolder1_datepicker and ctl00_ContentPlaceHolder1_datepickerEnd



//id for search button is ctl00_ContentPlaceHolder1_btnSearchPanel1
  await browser.close();
}


app.use(bodyParser.urlencoded({extended: true}))
const port = 3000
app.use(express.static('./'));
app.get('/', (req, res) => res.sendFile(__dirname + '/clientPage.html'))


function performOCR(imageToCheck){
		tesseract.recognize(imageToCheck, tesseractConfig)
  		.then(text => {
    			fs.writeFile("./ocr.txt", text, function(err){})
  		}).catch(err => { console.log('error:', err) })	
}
app.listen(port, () => {
		//write code to extract images with pdfimages then use convert from imagemagick
		//$ pdfimages -list fileName.pdf
		//$ pdfimages fileName.pdf fileName   # save in .ppm format
		//$ convert fileName-000.ppm fileName-000.png
		
		//feed convert pdf image into this function to write the file
		performOCR('wow.png')
		
		
	
	console.log('Example app listening on porasdft ${port}!')
	}
)

app.post('/search', (req, res) => {
	console.log("post received");
	//converter.convert("./test.pdf")
	scrapeData(req.body.business, res)
});


//scrapeData();
