const DBObject = require('../DBObject.js');


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
	hash = "118cd9b3-7910-5b72-aeab-e148faa73c3e";

	//THEN
	expect(validDbObject.generateHash())
	//WHEN
	.toBe(hash);
})


/** SQL generation tests **/
test ('Basic SQL generation tests.', () => {
	//GIVEN
	validDbTableName = "listing";
	validDbTableColumns = ["column1","column2"];
	validDbObject = new DBObject(validDbTableName, validDbTableColumns);

	let expectedInsertStatement = "INSERT INTO listing (id, column1, column2) VALUES ('118cd9b3-7910-5b72-aeab-e148faa73c3e', default, default) RETURNING id";
	let expectedSelectStatement = "SELECT column1, column2 FROM listing WHERE id='118cd9b3-7910-5b72-aeab-e148faa73c3e'";
	let expectedDeleteStatement = "DELETE FROM listing WHERE id = '118cd9b3-7910-5b72-aeab-e148faa73c3e'";
	let expectedUpdateStatement = "UPDATE listing SET column1 = default, column2 = default WHERE id='118cd9b3-7910-5b72-aeab-e148faa73c3e'";

	//WHEN
	let resultInsertStatement = validDbObject.generateInsertStatement();
	let resultSelectStatement = validDbObject.generateSelectStatement();
	let resultDeleteStatement = validDbObject.generateDeleteStatement();
	let resultUpdateStatement = validDbObject.generateUpdateStatement();

	//THEN
	expect(resultInsertStatement).toBe(expectedInsertStatement);
	expect(resultSelectStatement).toBe(expectedSelectStatement);
	expect(resultDeleteStatement).toBe(expectedDeleteStatement);
	expect(resultUpdateStatement).toBe(expectedUpdateStatement);
});

test ('Test SQL generation for odd values.', () => {
	//GIVEN
	validDbTableName = "listing";
	validDbTableColumns = ["column1","column2"];
	validDbObject = new DBObject(validDbTableName, validDbTableColumns);

	let expectedInsertStatement = "INSERT INTO listing (id, column1, column2) VALUES ('2922730e-8c9f-5a11-bf00-975c983ccdc8', null, current_timestamp) RETURNING id";
	let expectedSelectStatement = "SELECT column1, column2 FROM listing WHERE id='2922730e-8c9f-5a11-bf00-975c983ccdc8'";
	let expectedDeleteStatement = "DELETE FROM listing WHERE id = '2922730e-8c9f-5a11-bf00-975c983ccdc8'";
	let expectedUpdateStatement = "UPDATE listing SET column1 = null, column2 = current_timestamp WHERE id='2922730e-8c9f-5a11-bf00-975c983ccdc8'";

	//WHEN
	validDbObject.column1 = null;
	validDbObject.column2 = "current_timestamp";

	let resultInsertStatement = validDbObject.generateInsertStatement();
	let resultSelectStatement = validDbObject.generateSelectStatement();
	let resultDeleteStatement = validDbObject.generateDeleteStatement();
	let resultUpdateStatement = validDbObject.generateUpdateStatement();

	//THEN
	expect(resultInsertStatement).toBe(expectedInsertStatement);
	expect(resultSelectStatement).toBe(expectedSelectStatement);
	expect(resultDeleteStatement).toBe(expectedDeleteStatement);
	expect(resultUpdateStatement).toBe(expectedUpdateStatement);
});