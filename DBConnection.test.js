const DBObject = require('./DBObject.js');
const DBConnection = require('./DBConnection.js');

test ('Create DBObject.', () => {
	//GIVEN
	let dbtest = new DBConnection();

	validDbTableName = "serializableobjecttest";
	validDbTableColumns = ["teststring"];
	//WHEN
	validDbObject = new DBObject(validDbTableName, validDbTableColumns);
	validDbObject.teststring = "Testing.";
	//THEN
	expect(validDbObject).not.toBe(null);
	dbtest.save(validDbObject);
});