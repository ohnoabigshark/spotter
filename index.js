const express = require("express");
const app = express();
const pg = require('pg');
const pool = new pg.Pool();


app.use(express.static("public"));

app.get("/", function(request, response) {
	response.send("Server is up.");	
});


app.get('/listing', function ( request, response ) { 
	let sqlQuery = "select * from listing";
	pool.query(sqlQuery, [1], (err, res) => {
		if ( err ) {
			throw err
		}

		console.log(res.rows)
		response.render('pages/db', {results: res.rows})
	});
});

app.listen(process.env.PORT || 3000, () => console.log("Spotter: index.js started."));