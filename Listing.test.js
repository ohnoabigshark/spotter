const Listing = require("./Listing.js");

const pListing = new Listing(1);

test ( 'Create Listing.', () => {
	expect(new Listing(1)).toStrictEqual(pListing);
});