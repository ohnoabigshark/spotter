const express = require("express");
const app = express();
const { Client } = require('pg');
const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

client.connect();

app.use(express.static("public"));

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