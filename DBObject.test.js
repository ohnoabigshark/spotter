const DBObject = require('./DBObject.js');

const pDbTableName = "listing";
const fDbTableName = "";
const pDbTableColumns = ["column1","column2"];
const fDbTableColumns = [];
const fNonStringDbTableColumns = [{},""];
const pDbObject = new DBObject(pDbTableName,pDbTableColumns);


test ('Create DBObject.', () => {
	expect(new DBObject(pDbTableName,pDbTableColumns)).toStrictEqual(pDbObject);
});

test ('Create DBObject with dbTableName of length 0 throws error.', () => { 
	expect(() => {new DBObject(fDbTableName,pDbTableColumns);}).toThrow();
});

test ('Create DBObject with dbColumns of length 0 throws error.', () => { 
	expect(() => {new DBObject(pDbTableName,fDbTableColumns);}).toThrow();
});

test ('Create DBObject with dbColumns with non string member throws error.', () => { 
	expect(() => {new DBObject(pDbTableName,fNonStringDbTableColumns);}).toThrow();
});

test ('DBObject.getColumnsAsString().', () => {
	expect(pDbObject.getColumnsAsString()).toBe("column1, column2");
})