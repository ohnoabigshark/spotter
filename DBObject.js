const DBOperation = require('./DBOperation.js');
const SQLStatement = require('./SQLStatement.js');

class DBObject {
	constructor ( dbTableName, dbColumnNames, primaryKeyColumn ) {  //TODO: All DBObjects need to know what the PK is
		if ( dbTableName && dbColumnNames ) {
			this.dbTableName = dbTableName; //String
			this.dbColumnNames = dbColumnNames; //Array
			this.primaryKeyColumn = primaryKeyColumn ? primaryKeyColumn : "_id";

			this.sqlUpdateStatement = new SQLStatement("UPDATE "+dbTableName+" SET "+this.buildUpdatePairs()+" WHERE "+this.primaryKeyColumn);
			this.sqlDeleteStatement = new SQLStatement("DELETE FROM "+dbTableName+" WHERE "+this.primaryKeyColumn+" = :primaryKeyValue");
			this.sqlInsertStatement = new SQLStatement("INSERT INTO "+dbTableName+" ("+this.getColumnsAsString()+") VALUES ("+this.buildBindParamList()+")");
			this.sqlSelectStatement = new SQLStatement("SELECT "+this.getColumnsAsString()+" FROM "+dbTableName);
		}
		else {
			throw("DBObject missing id.");
		}
	}

	isInDB ( ) {
		if ( this[this.primaryKeyColumn].length > 0 ) {
			return true;
		}
		return false;
	}

	buildBindParamList ( ) {
		return this.dbColumnNames.map( columnName => ":"+columnName ).join(", ");
	}

	buildUpdatePairs ( ) {
		return this.dbColumnNames.map( columnName => columnName + " = :" + columnName).join(", ");
	}

	//TODO: How do we figure out which statement to get and how to prepare it properly?
	prepareSqlStatement ( statement ) {
		//bind object key/value pairs to statement
		this.dbColumnNames.forEach( el => statement.bind( el, this[el] ) );
		return statement.getPreparedStatement();
	}

	getColumnsAsString ( str ) { 
		let delimiter = ", ";
		if ( str && typeof str === "string" ) { 
			delimiter = str;
		}
		return this.dbColumnNames.join(delimiter);
	}

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

	generateInsertStatement ( ) {
		this.dbColumnNames.forEach( el => {
			if ( this[el] )
				this.sqlInsertStatement.bind( el, this[el] );
		});
		return this.sqlInsertStatement.getPreparedStatement();
	}
}
module.exports = DBObject;


//TODO: Below should be moved into test suite
let obj = new DBObject("test",["name","title"]);
obj.name = "Name goes here";
console.log( obj.isInDB() + " | " +obj.primaryKeyColumn+ " | " +this[this.primaryKeyColumn] );

console.log(obj.sqlSelectStatement);
console.log(obj.sqlInsertStatement);
console.log(obj.sqlDeleteStatement);
console.log(obj.sqlDeleteStatement.getPreparedStatement());
console.log(obj.sqlInsertStatement.getPreparedStatement());
console.log(obj.generateInsertStatement());


