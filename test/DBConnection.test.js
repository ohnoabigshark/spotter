const DBObject = require('../DBObject.js');
const DBConnection = require('../DBConnection.js');
const Listing = require('../Listing.js');


test ('Create DBObject and save to DB.', async () => {
	//GIVEN
	let dbtest = new DBConnection();
	await dbtest.pool.query('DELETE FROM serializableobjecttest');

	validDbTableName = "serializableobjecttest";
	validDbTableColumns = ["teststring"];
	//WHEN
	validDbObject = new DBObject(validDbTableName, validDbTableColumns);
	validDbObject.teststring = "Testing.";
	//THEN
	expect(validDbObject).not.toBe(null);
	await dbtest.save(validDbObject);
	dbtest.pool.end();
});

test ('Create DBObject, save to DB, check isInDB() is true.', async () => {
	//GIVEN
	let dbtest = new DBConnection();
	await dbtest.pool.query('DELETE FROM serializableobjecttest');

	validDbTableName = "serializableobjecttest";
	validDbTableColumns = ["teststring"];
	//WHEN
	validDbObject = new DBObject(validDbTableName, validDbTableColumns);
	validDbObject.teststring = "Testing.";
	expect(validDbObject).not.toBe(null);
	expect(validDbObject.isInDB()).toBe(false);
	await dbtest.save(validDbObject);
	expect(validDbObject.isInDB()).toBe(true);


	dbtest.pool.end();
});


test ('Create DBObject, save to DB, make changes, save again.', async () => {
	//GIVEN
	let dbtest = new DBConnection();
	await dbtest.pool.query('DELETE FROM serializableobjecttest');

	validDbTableName = "serializableobjecttest";
	validDbTableColumns = ["teststring"];
	//WHEN
	validDbObject = new DBObject(validDbTableName, validDbTableColumns);
	validDbObject.teststring = "Testing.";
	expect(validDbObject).not.toBe(null);
	expect(validDbObject.isInDB()).toBe(false);
	await dbtest.save(validDbObject);
	expect(validDbObject.isInDB()).toBe(true);
	validDbObject.teststring = "New String.";
	await dbtest.save(validDbObject);



	dbtest.pool.end();
});

//319698b9-a5a1-52f1-b61c-9124f9ba1fd2
test ('Create DBObject, save to DB, make changes, save again, then load.', async () => {
	//GIVEN
	let dbtest = new DBConnection();
	await dbtest.pool.query('DELETE FROM serializableobjecttest');

	validDbTableName = "serializableobjecttest";
	validDbTableColumns = ["teststring"];
	//WHEN
	validDbObject = new DBObject(validDbTableName, validDbTableColumns);
	validDbObject.teststring = "Testing.";
	expect(validDbObject).not.toBe(null);
	expect(validDbObject.isInDB()).toBe(false);
	await dbtest.save(validDbObject);
	expect(validDbObject.isInDB()).toBe(true);
	validDbObject.teststring = "New String.";
	await dbtest.save(validDbObject);

	let emptyDbObject = new DBObject(validDbTableName, validDbTableColumns);
	await dbtest.load("319698b9-a5a1-52f1-b61c-9124f9ba1fd2", emptyDbObject);
	expect(emptyDbObject).toEqual(validDbObject);

	dbtest.pool.end();
});


test ('Create DBObject, save to DB, make changes, save again, then load, then delete.', async () => {
	//GIVEN
	let dbtest = new DBConnection();
	await dbtest.pool.query('DELETE FROM serializableobjecttest');

	validDbTableName = "serializableobjecttest";
	validDbTableColumns = ["teststring"];
	//WHEN
	validDbObject = new DBObject(validDbTableName, validDbTableColumns);
	validDbObject.teststring = "Testing.";
	expect(validDbObject).not.toBe(null);
	expect(validDbObject.isInDB()).toBe(false);
	await dbtest.save(validDbObject);
	expect(validDbObject.isInDB()).toBe(true);
	validDbObject.teststring = "New String.";
	await dbtest.save(validDbObject);

	let emptyDbObject = new DBObject(validDbTableName, validDbTableColumns);
	await dbtest.load("319698b9-a5a1-52f1-b61c-9124f9ba1fd2", emptyDbObject);
	expect(emptyDbObject).toEqual(validDbObject);

	await dbtest.delete(emptyDbObject);
	//await dbtest.load("319698b9-a5a1-52f1-b61c-9124f9ba1fd2", emptyDbObject);

	await expect( dbtest.load("319698b9-a5a1-52f1-b61c-9124f9ba1fd2", emptyDbObject) )
	.rejects.toThrow();


	dbtest.pool.end();
});

test ('Create Listing, save to DB, then load it.', async () => {
	let dbtest = new DBConnection();
	await dbtest.pool.query('DELETE FROM listing');

	let originalListing = new Listing();
	originalListing = new Listing();
	originalListing.dateposted = "1999-01-08";
	originalListing.datescraped = "1999-02-18";
	originalListing.datelastviewed = "current_timestamp",
	originalListing.location = "Brattleboro, VT";
	originalListing.sellerid = "4df51cdd-ecd4-46d3-a24c-5b90a9f53b03";
	originalListing.title = "Goat for sale.";
	originalListing.description = "This is a good goat. Pretty nice. Brand new.";
	originalListing.scrapeconfig = "68f6296d-81e3-463c-baec-1c846816560e";
	
	await dbtest.save(originalListing,true);
	//WHEN
	let loadedListing = new Listing();
	await dbtest.load('a6d081dc-f25c-582e-a73d-ae4e685351ea',loadedListing);

	//THEN
	expect(originalListing).toEqual(loadedListing);
	dbtest.pool.end();
});


test ('FAILURE: Try to save non dbobject.', async () => {
	let dbtest = new DBConnection();

	let badObject = "";

	await expect( dbtest.save(badObject) ).rejects.toThrow();
	dbtest.pool.end();

});

test ('FAILURE: Try to load non dbobject.', async () => {
	let dbtest = new DBConnection();

	let badObject = "";

	await expect( dbtest.load(badObject) ).rejects.toThrow();
	dbtest.pool.end();

});

test ('FAILURE: Try to delete non dbobject.', async () => {
	let dbtest = new DBConnection();

	let badObject = "";

	await expect( dbtest.delete(badObject) ).rejects.toThrow();
	dbtest.pool.end();

});

