const { v1: uuidv1, v5: uuidv5 } = require('uuid');
const SQLStatement = require('./SQLStatement.js');
const UUID_NAMESPACE = "57b9d446-6803-4fd3-a876-657969e4fd67";

class DBObject {
	constructor ( dbTableName, dbColumnNames, primaryKeyColumn ) {  //TODO: All DBObjects need to know what the PK is
		if ( dbTableName && dbColumnNames ) {
			this.dbTableName = dbTableName; //String
			this.dbColumnNames = dbColumnNames; //Array
			this.primaryKeyColumn = primaryKeyColumn ? primaryKeyColumn : "id";

			//TODO: implement getPrimaryKeyValue() to return this[this.getPrimaryKey]. Can add extra processing, if necessary
			this.sqlUpdateStatement = new SQLStatement("UPDATE "+dbTableName+" SET "+this.buildUpdatePairs()+" WHERE "+this.primaryKeyColumn+"="+this[this.primaryKeyColumn]);
			this.sqlDeleteStatement = new SQLStatement("DELETE FROM "+dbTableName+" WHERE "+this.primaryKeyColumn+" = :primaryKeyValue");
			this.sqlSelectStatement = new SQLStatement("SELECT "+this.getColumnsAsString()+" FROM "+dbTableName);
		}
		else {
			throw("DBObject missing id.");
		}
	}

	isInDB ( ) {
		let primaryKey = this[this.primaryKeyColumn];
		if ( primaryKey && this[this.primaryKeyColumn].length > 0 ) {
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

	getColumnsWithValuesAsString ( delimiter ) { 
		if ( delimiter && typeof delimiter === "string" ) { 
			
		} else {
			delimiter = ", ";
		}
		let fieldsWithValues = this.dbColumnNames.filter(fieldName => this[fieldName] != undefined || this[fieldName] != null)
		return fieldsWithValues.join(delimiter);
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
		this[this.primaryKeyColumn] = this[this.primaryKeyColumn] != undefined ? this[this.primaryKeyColumn] : this.generateHash();
		let query = new SQLStatement("INSERT INTO "+this.dbTableName+" ("+this.primaryKeyColumn+", "+this.getColumnsWithValuesAsString()+") VALUES ('"+this[this.primaryKeyColumn]+"', "+this.buildBindParamList()+")");

		this.dbColumnNames.forEach( el => {
				query.bind( el, this[el] );
		});
		return query.getPreparedStatement();
	}

	generateHash ( ) {
		let reducer = (accumulator, currentValue) => accumulator + this[currentValue];
		let objData = this.dbColumnNames.reduce(reducer,"");
		return uuidv5(objData,UUID_NAMESPACE);
	}

}
module.exports = DBObject;


//TODO: Below should be moved into test suite
let obj = new DBObject("test",["name","title"]);
let obj2 = new DBObject("test",["name","title"]);
let obj3 = new DBObject("test",["name","title"]);
obj.name = "Name goes here";
obj.title = "test";
console.log( obj.isInDB() + " | " +obj.primaryKeyColumn+ " | " +this[this.primaryKeyColumn] );

console.log(obj.sqlSelectStatement);
console.log(obj.sqlInsertStatement);
console.log(obj.sqlDeleteStatement);
console.log(obj.sqlDeleteStatement.getPreparedStatement());
console.log(obj.generateInsertStatement());


