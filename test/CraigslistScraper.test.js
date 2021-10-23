/**
 * @jest-environment jsdom
 */

 require('iconv-lite').encodingExists('foo');
const CraigslistScraper = require('../CraigslistScraper.js');

test ('Create scraper and scrape.', async () => {
	//GIVEN
	scraper = new CraigslistScraper();
	//WHEN
	let result = await scraper.scrape();
	//THEN
	expect(result).not.toBe(null); //TODO: Should also expect result to have a size that is equal to the number of listings in a web page
});

//TODO: Create tests to see if specific data is returned by the Listing objects