//scraper for craigslist pages
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const domOptions = {
	contentType: "text/html",
	includeNodeLocations: true
};

const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:dummy@localhost:5432/spotter',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false 
    //process.env.DATABASE_URL ? true : false
	
});

client.connect();

const craigslistScraper = {

		scrape: function ( ) {
			JSDOM.fromFile('./test_pages/craigslist_olympic_weights.html',domOptions).then(dom => {
				console.log("SCRAPING");
				console.log(dom.window.document.getElementsByClassName('result-row').length);
				let listing = dom.window.document.getElementsByClassName('result-row')[0];
				console.log(listing.getAttribute('data-pid'));
				console.log(listing.getAttribute('data-repost-of'));
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

				console.log(listingHeading.getElementsByTagName('a')[0].text);
				console.log("Scrape output \n Title: "+listingScrape.title+" Price: "+listingScrape.price+" Date: "+listingScrape.datePosted);

				let sqlQuery = "insert into listing (datePosted, dateScraped, location, sellerId, title, description, price) "+
							"values (current_timestamp, current_timestamp, 'Boston', 123, '"+listingScrape.title+"', '"+listingScrape.title+"', "+listingScrape.price+" )";
				client.query(sqlQuery, (err, res) => {
					if ( err ) {
						throw err
					}

					console.log(res.rows);
				});

			});

			
			
			//let rawResultTags = dom.window.document.querySelectorAll('result-info');
			//console.log( rawResultTags.length );
			//console.log( rawResultTags );
		},

		load: function ( ) {
			console.log(dom.serialize());
		}

	};

module.exports = craigslistScraper;
