//scraper for craigslist pages
const Listing = require("./Listing.js");
const DBConnection = require('./DBConnection.js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const domOptions = {
	contentType: "text/html",
	includeNodeLocations: true
};

class CraigslistScraper {

	//TODO: Create save function or perform saving in ScraperManager (probably that)
	//TODO: Do we want to pass a URL or filename to the scraper for parsing?
	//TODO: Do we want to download files to scrape and never have the scrapers themselves going directly out to the internet? If the file is downloaded and saved, that requires more storage space, but allows us to have a scraped page history and decouples scraping from page access.
	async scrape ( ) {
		console.log("SCRAPITY SCRAPE");
		let dbConnection = new DBConnection();
		return await JSDOM.fromFile('./test_pages/craigslist_olympic_weights.html',domOptions).then( (dom) => {
			//console.log("SCRAPING");
			//console.log(dom.window.document.getElementsByClassName('result-row').length);
			
			let listingParents = dom.window.document.getElementsByClassName('result-row');
			let listingParentsArray = [...listingParents];
			let listingArray = [];
			listingParentsArray.forEach( 
				listing => {
					//let listing = dom.window.document.getElementsByClassName('result-row')[0];
					//console.log(listing.getAttribute('data-pid'));
					//console.log(listing.getAttribute('data-repost-of'));
					let listingMeta = listing.getElementsByClassName('result-meta')[0];
					let listingInfo = listing.getElementsByClassName('result-info')[0];
					let listingHeading = listing.getElementsByClassName('result-heading')[0];

					let listingObject = new Listing();
					listingObject.title = listingHeading.getElementsByTagName('a')[0].text;
					listingObject.price = listingMeta.getElementsByClassName('result-price')[0].innerHTML.substring(1);
					listingObject.datePosted = listingInfo.getElementsByClassName('result-date')[0].getAttribute('title');
					listingObject.dateScraped = "current_timestamp";
					listingObject.scrapeconfig = '';
					//console.log(listingObject.title);
					listingArray.push(listingObject);
				}
			);

			console.log(listingArray.length);

			return listingArray;

			//console.log(listingHeading.getElementsByTagName('a')[0].text);
			//console.log("Scrape output \n Title: "+listingScrape.title+" Price: "+listingScrape.price+" Date: "+listingScrape.datePosted);

		}, (err) => {console.log("Error.");});

	}

	async scrape2 ( ) {

	}

	load ( ) {
		console.log(dom.serialize());
	}

}

module.exports = CraigslistScraper;
