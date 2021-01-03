const express = require("express");
const app = express();
const pg = require('pg');


app.use(express.static("public"));

app.get("/", function(request, response) {
	response.send("Server is up.");	
	let sqlQuery = "select * from noteentries where noteid = "+NOTE.currentNoteId+" order by entryid asc";
	console.log(sqlQuery);
	pg.connect(process.env.DATABASE_URL, function ( err, client, done ) {
		client.query(sqlQuery, function(err, result) {
			//console.log(result.rows);
			NOTE.entries = result.rows;
			VASH.changeState(STATE.Note);
			io.emit('openNote',NOTE.getData());
			done();
		}); 
	});
});

app.listen(process.env.PORT || 3000, () => console.log("Spotter: index.js started."));