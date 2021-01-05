const express = require("express");
const app = express();
const pg = require('pg');


app.use(express.static("public"));

app.get("/", function(request, response) {
	response.send("Server is up.");	
});


app.get('/listing', function ( request, response ) { 
	let sqlQuery = "select * from listing";
	pg.connect(process.env.DATABASE_URL, function ( err, client, done ) {
		client.query(sqlQuery, function(err, result) {
			done();
			if(err){
				console.error(err); response.send("Error " + err);
			}
			else {
				console.log(result.rows);
				response.render('pages/db', { results: result.rows } );
			}

		});
	});
});

app.listen(process.env.PORT || 3000, () => console.log("Spotter: index.js started."));