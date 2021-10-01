/**
 * @jest-environment jsdom
 */

 require('iconv-lite').encodingExists('foo');
const CraigslistScraper = require('../CraigslistScraper.js');

test ('Create scraper and scrape.', async () => {
	//GIVEN
	scraper = new CraigslistScraper();
	//WHEN
	await scraper.scrape();
	//THEN
	expect(scraper).not.toBe(null);
});