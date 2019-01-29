'use strict';

const puppeteer = require('puppeteer');


async function scrapeData() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	var businessName = "Banner Health System"
	
	await page.goto('https://recorder.maricopa.gov/recdocdata/');

	//fill out form
	await page.focus('#ctl00_ContentPlaceHolder1_txtName2');
	await page.type('#ctl00_ContentPlaceHolder1_txtName2', 'Fancy', { delay: 150 });
  
	//send request
	//await page.focus('#ctl00_ContentPlaceHolder1_btnSearchPanel1');
	//await page.keyboard.press('Enter');
	await page.click('#ctl00_ContentPlaceHolder1_btnSearchPanel1');
	await page.waitForNavigation();
	
	
	
	//await page.$eval('#ctl00_ContentPlaceHolder1_btnSearchPanel1', form => form.submit());
	//await page.waitFor(2000);

	
	await page.screenshot({ path: 'CurrentWebPage.png' });

//business name in form is ctl00_ContentPlaceHolder1_txtName2
//Document code in form is ctl00_ContentPlaceHolder1_ddlDocCodes default id is HL
//Date code in from is ctl00_ContentPlaceHolder1_datepicker and ctl00_ContentPlaceHolder1_datepickerEnd



//id for search button is ctl00_ContentPlaceHolder1_btnSearchPanel1
  await browser.close();
}

scrapeData();