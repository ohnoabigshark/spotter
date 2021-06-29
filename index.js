const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const craigslistScraper = require('./craigslistScraper.js');
const DBConnection = require('./DBConnection.js');
const DBObject = require('./DBObject.js');
const Listing = require('./Listing.js');
const DBOperation = require('./DBOperation.js');

//postgreSQL conection
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:dummy@localhost:5432/spotter',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false 
    //process.env.DATABASE_URL ? true : false
	
});

client.connect();


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get("/", function(request, response) {
	response.send("Server is up.");	
});


app.get('/listing', function ( request, response ) { 
	let sqlQuery = "select * from listing";
	client.query(sqlQuery, (err, res) => {
		if ( err ) {
			throw err
		}

		console.log(res.rows)
		response.render('pages/db', {results: res.rows})
	});
});

app.get('/scrapeTest', function ( request, response ) {

	craigslistScraper.scrape();
	response.render('pages/scrapeTest');
});


app.listen(process.env.PORT || 3000, () => console.log("Spotter: index.js started."));
	//let t = new dbInterface('let see');
	//console.log(t.test);
const dbtest = new DBConnection();
const listing = new Listing();
/*
["id","dateposted","datescraped","datelastviewed","location",
  								"sellerid", "title", "description", "price", "status", "hash",
  								"service", "serviceuid"];
  								*/
listing.location = "Boston";
listing.title = "A thing I am selling.";
listing.description = "This thing is great. Buy it.";
listing.price = "100";
listing.service = "Facebook";
console.log(listing.sqlInsertStatement.getPreparedStatement());
dbtest.save(listing);
//craigslistScraper.scrape();