const express = require("express");
const app = express();


app.use(express.static("public"));

app.get("/", function(request, response) {
	response.send("Server is up.");	
});

app.listen(process.env.PORT || 3000, () => console.log("Spotter: index.js started."));