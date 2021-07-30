const DBObject = require('./DBObject.js');

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
})