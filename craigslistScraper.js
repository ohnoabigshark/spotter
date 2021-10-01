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

	async scrape ( ) {
		console.log("SCRAPITY SCRAPE");
		await JSDOM.fromFile('./test_pages/craigslist_olympic_weights.html',domOptions).then( (dom) => {
			//console.log("SCRAPING");
			//console.log(dom.window.document.getElementsByClassName('result-row').length);
			let listingObject = new Listing();
			let listing = dom.window.document.getElementsByClassName('result-row')[0];
			//console.log(listing.getAttribute('data-pid'));
			//console.log(listing.getAttribute('data-repost-of'));
			let listingMeta = listing.getElementsByClassName('result-meta')[0];
			let listingInfo = listing.getElementsByClassName('result-info')[0];
			let listingHeading = listing.getElementsByClassName('result-heading')[0];

			let listingScrape = { 
				title: listingHeading.getElementsByTagName('a')[0].text,
				price: listingMeta.getElementsByClassName('result-price')[0].innerHTML.substring(1),
				datePosted: listingInfo.getElementsByClassName('result-date')[0].getAttribute('title'),
				location: '',
				sellerId: '',
				description: '',
				service: 'craigslist',
				serviceUid: listing.getAttribute('data-pid')
			};

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
