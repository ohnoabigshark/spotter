const Listing = require("./Listing.js");

const pListing = new Listing(1);

test ( 'Create Listing.', () => {
	//GIVEN
	let id = 1;
	let newListing = new Listing(id);
	//WHEN
	expect(newListing)
	//THEN
	.toStrictEqual(newListing);
});