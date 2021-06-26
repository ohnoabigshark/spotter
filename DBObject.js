const DBOperation = require('./DBOperation.js');
const SQLStatement = require('./SQLStatement.js');

class DBObject {
	constructor ( dbTableName, dbColumnNames, primaryKeyColumn ) {  //TODO: All DBObjects need to know what the PK is
		if ( dbTableName && dbColumnNames ) {
			this.dbTableName = dbTableName; //String
			this.dbColumnNames = dbColumnNames; //Array
			this.primaryKeyColumn = primaryKeyColumn;
			//this.dbOperation = DBOperation.CREATE;

			//TODO: Likely wnat to create a SQLStatement parent class to contain all these values and other helper functions
			//Such as .bind;
			this.sqlUpdateStatement = new SQLStatement("UPDATE "+dbTableName+" SET "+this.buildUpdatePairs()+" WHERE "+this.primaryKeyColumn);
			this.sqlDeleteStatement = new SQLStatement("DELETE FROM "+dbTableName+" WHERE "+this.primaryKeyColumn+"= :primaryKeyValue");
			this.sqlInsertStatement = new SQLStatement("INSERT INTO "+dbTableName+" ("+this.getColumnsAsString()+") VALUES ("+this.buildBindParamList()+")");
			this.sqlSelectStatement = new SQLStatement("SELECT "+this.getColumnsAsString()+" FROM "+dbTableName);
		}
		else {
			throw("DBObject missing id.");
		}
	}

	buildBindParamList ( ) {
		return this.dbColumnNames.map( columnName => ":"+columnName ).join(", ");
	}

	buildUpdatePairs ( ) {
		return this.dbColumnNames.map( columnName => columnName + " = :" + columnName).join(", ");
	}

	prepareSqlStatement ( statement ) {
		//bind object key/value pairs to statement
		this.dbColumnNames.forEach( el => statement.bind( el, this[el] ) );
	}

	getColumnsAsString ( str ) { 
		let delimiter = ", ";
		if ( str && typeof str === "string" ) { 
			delimiter = str;
		}
		return this.dbColumnNames.join(delimiter);
	}

	/*#dbOperationUpdate ( ) {
		console.log("dbOperationUpdate called");
		if ( this.dbOperation != DBOperation.CREATE )
			this.dbOperation = DBOperation.UPDATE;
	}

	get dbOperation ( ) {
		return this._dbOperation;
	}

	set dbOperation ( dbOperation ) {
		if ( Object.values(DBOperation).includes(dbOperation) ) //if dbOperation is a compatible value
			this._dbOperation = dbOperation;
	}
	*/
	get dbTableName ( ) {
		return this._dbTableName;
	}

	set dbTableName ( dbTableName ) {
		if ( typeof dbTableName !== "string" )
			throw ("Could not set dbTableName because "+dbTableName+" is not of type string.");
		if ( dbTableName.length < 1 ) 
			throw ("dbTableName is of length: "+dbTableName.length+". Needs to be > 0.");
		this._dbTableName = dbTableName;
	}

	get dbColumnNames ( ) {
		return this._dbColumnNames;
	}

	set dbColumnNames ( dbColumnNames ) { //TODO: Should we check for id in columnNames? should always have an id
		if ( !Array.isArray(dbColumnNames) ) 
			throw("setDbColumnNames: Could not set dbColumnNames because "+dbColumnNames+" is not of type Array.");
		if ( dbColumnNames.length < 1 )
			throw("setDbColumnNames: dbColumnNames is of length: "+dbColumnNames.length+". Needs to be > 0.");
		for ( let i = 0; i < dbColumnNames.length; i++ ) {
			if ( typeof dbColumnNames[i] !== "string" )
				throw("setDbColumnNames: dbColumnNames["+i+"]: "+dbColumnNames[i]+" is not of type string.");
		}
		this._dbColumnNames = dbColumnNames;
	}

	get primaryKeyColumn ( ) {
		return this._primaryKeyColumn;
	}

	set primaryKeyColumn ( primaryKeyColumn ) {
		if ( this._primaryKeyColumn != null || this._primaryKeyColumn != undefined )
			throw ("primaryKeyColumn cannot be set after instantiation.")
		if ( primaryKeyColumn == null ||  primaryKeyColumn == undefined ) {
			primaryKeyColumn = "uid";
		}
		if ( typeof primaryKeyColumn !== "string" )
			throw ("Could not set primaryKeyColumn because "+primaryKeyColumn+" is not of type string.");
		if ( primaryKeyColumn.length < 1 ) 
			throw ("primaryKeyColumn is of length: "+primaryKeyColumn.length+". Needs to be > 0.");
		this._primaryKeyColumn = primaryKeyColumn; 
	}
}
module.exports = DBObject;


//TODO: Below should be moved into test suite
let obj = new DBObject("test",["test2"]);
obj.sqlInsertStatement.bind("test2",'Flarfanooogen');

console.log(obj.sqlSelectStatement);
console.log(obj.sqlInsertStatement);
console.log(obj.sqlUpdateStatement);
console.log(obj.sqlDeleteStatement);
console.log(obj.sqlInsertStatement.getPreparedStatement());


