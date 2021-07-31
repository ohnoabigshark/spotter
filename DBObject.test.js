const DBObject = require('./DBObject.js');
murmurhash = require('murmurhash');


test ('Create DBObject.', () => {
	//GIVEN
	validDbTableName = "listing";
	validDbTableColumns = ["column1","column2"];
	//WHEN
	validDbObject = new DBObject(validDbTableName, validDbTableColumns);
	//THEN
	expect(validDbObject).not.toBe(null);
});

test ('Create DBObject with dbTableName of length 0 throws error.', () => { 
	//GIVEN
	badTableName = "";
	validDbTableColumns = ["column1","column2"];
	//WHEN
	expect(() => {new DBObject(badTableName,validDbTableColumns);})
	//THEN
	.toThrow();
});

test ('Create DBObject with dbColumns of length 0 throws error.', () => { 
	//GIVEN
	validDbTableName = "listing";
	badTableColumns = [];
	//WHEN
	expect(() => {new DBObject(validDbTableName,badTableColumns);})
	//THEN
	.toThrow();
});

test ('Create DBObject with dbColumns with non string member throws error.', () => { 
	//GIVEN
	validDbTableName = "listing";
	badTableColumns = [{},""];
	//WHEN
	expect(() => {new DBObject(validDbTableName,badTableColumns);})
	//THEN
	.toThrow();
});

test ('DBObject.getColumnsAsString().', () => {
	//GIVEN
	validDbTableName = "listing";
	validDbTableColumns = ["column1","column2"];
	validDbObject = new DBObject(validDbTableName, validDbTableColumns);
	//THEN
	expect(validDbObject.getColumnsAsString())
	//WHEN
	.toBe("column1, column2");
});


test ('DBObject.generateHash() success.', () => {
	//GIVEN
	validDbTableName = "listing";
	validDbTableColumns = ["column1","column2"];
	validDbObject = new DBObject(validDbTableName, validDbTableColumns);
	hash = "1512654344";

	//THEN
	expect(validDbObject.generateHash())
	//WHEN
	.toBe(hash);
})