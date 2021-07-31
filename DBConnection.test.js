const DBObject = require('./DBObject.js');
const DBConnection = require('./DBConnection.js');


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