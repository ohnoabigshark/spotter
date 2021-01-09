const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);

//postgreSQL conection
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:dummy@localhost:5432/spotter',
    ssl: false //process.env.DATABASE_URL ? true : false
	/*ssl: {
		rejectUnauthorized: false
	}*/
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

app.listen(process.env.PORT || 3000, () => console.log("Spotter: index.js started."));