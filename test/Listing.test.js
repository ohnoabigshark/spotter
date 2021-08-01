const Listing = require("../Listing.js");
const DBConnection = require('../DBConnection.js');

test ( 'Create Listing.',  () => {
	//GIVEN
	let id = 1;
	let newListing = new Listing(id);
	//WHEN
	expect(newListing)
	//THEN
	.toStrictEqual(newListing);
});

test ( 'Create and save listing.', async () => {
	//GIVEN
	let dbtest = new DBConnection();
	await dbtest.pool.query('DELETE FROM listing');

	//WHEN
	validDbObject = new Listing();
	validDbObject.dateposted = "1999-01-08";
	validDbObject.datescraped = "1999-02-18";
	validDbObject.datelastviewed = "current_timestamp",
	validDbObject.location = "Brattleboro, VT";
	validDbObject.sellerid = "4df51cdd-ecd4-46d3-a24c-5b90a9f53b03";
	validDbObject.title = "Goat for sale.";
	validDbObject.description = "This is a good goat. Pretty nice. Brand new.";
	validDbObject.price = 0;
	validDbObject.status = 1;
	validDbObject.scrapeconfig = "68f6296d-81e3-463c-baec-1c846816560e";
	//THEN
	expect(validDbObject).not.toBe(null);
	await dbtest.save(validDbObject);
	dbtest.pool.end();

});