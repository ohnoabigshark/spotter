const SQLStatement = require('../SQLStatement.js');
const DBObject = require('../DBObject.js');

/** SUCCESSES **/
test ('Success: Create a SQLStatement.', () => {
	//GIVEN
	let statement = "INSERT INTO serializableobjecttest (:id, :teststring)";
	//WHEN
	let sql = new SQLStatement(statement);
	let result = sql.statement;
	//THEN
	expect(result).toEqual(statement);
});

test ('Success: Create a SQLStatement and bind all parameters.', () => {
	//GIVEN
	let statement = "INSERT INTO serializableobjecttest (:id, :teststring)";
	//WHEN
	let sql = new SQLStatement(statement);
	let result = sql.statement;
	//THEN
	expect(result).toEqual(statement);
});

test ('Success: Create a SQLStatement and bind duplicate parameters.', () => {
	//GIVEN
	let statement = "SELECT * FROM test WHERE id = :id AND uuid = :id";
	//WHEN
	let sql = new SQLStatement(statement);
	let expectedStatement = "SELECT * FROM test WHERE id = '319698b9-a5a1-52f1-b61c-9124f9ba1fd2' AND uuid = '319698b9-a5a1-52f1-b61c-9124f9ba1fd2'"; 
	sql.bind("id","319698b9-a5a1-52f1-b61c-9124f9ba1fd2");
	expect(sql.getPreparedStatement()).toEqual(expectedStatement);
	//THEN
});

test ('Success: Create a SQL SQLStatement and bind some parameters.', () => {
	//GIVEN
	let statement = "SELECT * FROM test WHERE id = :id AND nobind = :nobind";
	//WHEN
	let sql = new SQLStatement(statement);
	let expectedStatement = "SELECT * FROM test WHERE id = '319698b9-a5a1-52f1-b61c-9124f9ba1fd2' AND nobind = :nobind"; 
	sql.bind("id","319698b9-a5a1-52f1-b61c-9124f9ba1fd2");
	expect(sql.getPreparedStatement()).toEqual(expectedStatement);
	//THEN
});

test ('Success: Create a SQL SQLStatement and bind reserved words (default, current_timestamp).', () => {
	//GIVEN
	let statement = "SELECT * FROM test WHERE dateviewed = :timestamp AND service = :service";
	//WHEN
	let sql = new SQLStatement(statement);
	let expectedStatement = "SELECT * FROM test WHERE dateviewed = current_timestamp AND service = default"; 
	sql.bind("timestamp","current_timestamp");
	sql.bind("service","default");
	expect(sql.getPreparedStatement()).toEqual(expectedStatement);
	//THEN
});

//TODO: Test binds of other data types (integers/numbers, timestamps, json)

test ('Success: Create SQL Insert with null values.', () => {
	//GIVEN
	let statement = "INSERT INTO testtable (id, value, nullvalue) VALUES (:id, :value, :nullvalue)";
	//WHEN
	let sql = new SQLStatement(statement);
	let expectedStatement = "INSERT INTO testtable (id, value, nullvalue) VALUES ('319698b9-a5a1-52f1-b61c-9124f9ba1fd2', 'Some value.', null)"; 
	sql.bind("id","319698b9-a5a1-52f1-b61c-9124f9ba1fd2");
	sql.bind("value","Some value.");
	sql.bind("nullvalue",null);
	expect(sql.getPreparedStatement()).toEqual(expectedStatement);
	//THEN
});

test ('Success: Create SQL Insert with undefined/default values.', () => {
	//GIVEN
	let statement = "INSERT INTO testtable (id, value, defaultvalue) VALUES (:id, :value, :defaultvalue)";
	//WHEN
	let sql = new SQLStatement(statement);
	let expectedStatement = "INSERT INTO testtable (id, value, defaultvalue) VALUES ('319698b9-a5a1-52f1-b61c-9124f9ba1fd2', 'Some value.', default)"; 
	sql.bind("id","319698b9-a5a1-52f1-b61c-9124f9ba1fd2");
	sql.bind("value","Some value.");
	sql.bind("defaultvalue",);
	expect(sql.getPreparedStatement()).toEqual(expectedStatement);
	//THEN
});



/** FAILURES **/

test ('Failure: Try to change statement after instantiation.', () => {
	//GIVEN
	let statement = "INSERT INTO serializableobjecttest (:id, :teststring)";
	//WHEN
	let sql = new SQLStatement(statement);
	let newStatement = statement;
	//THEN
	expect(() => sql.statement=newStatement).toThrow();
});

//TODO: tests to confirm that get/sets work correctly