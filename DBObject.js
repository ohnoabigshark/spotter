const { v1: uuidv1, v5: uuidv5 } = require('uuid');
const SQLStatement = require('./SQLStatement.js');
const UUID_NAMESPACE = "57b9d446-6803-4fd3-a876-657969e4fd67";

//TODO: Revisit how we want hashing to work. There are potential issues with hashes actually being consistent due to how we generate them. May want to move to timestamp UUID or just generic namespaced UUID mechanism.
//TODO: Refactor all source files into a src directory.

class DBObject {
	constructor ( dbTableName, dbColumnNames, primaryKeyColumn ) { 
		if ( dbTableName && dbColumnNames ) {
			this.dbTableName = dbTableName; //String
			this.dbColumnNames = dbColumnNames; //Array
			this.primaryKeyColumn = primaryKeyColumn ? primaryKeyColumn : "id";

		} else {
			throw("DBObject missing id.");
		}
	}


	/*** BASIC GET/SETS ***/
	//TODO: Write a nice tostring method!

	get primaryKeyValue ( ) {
		return this[this.primaryKeyColumn];
	}

	set primaryKeyValue ( value ) {
		if ( typeof value !== "string" )
			throw ("Could not set primaryKeyValue because "+value+" is not of type string.");
		if ( value.length < 1 ) 
			throw ("dbTableName is of length: "+value.length+". Needs to be > 0.");
		this[this.primaryKeyColumn] = value;
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

	set dbColumnNames ( dbColumnNames ) { 
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

	/*** HELPER METHODS ***/
	isInDB ( ) {
		let primaryKey = this.primaryKeyValue;
		if ( primaryKey && primaryKey.length > 0 ) {
			return true;
		}
		return false;
	}
	
	buildBindParamList ( ) {
		return this.dbColumnNames.map( columnName => ":"+columnName ).join(", ");
	}

	buildUpdatePairs ( ) { //Do not want to include primaryKeyColumn here as we never want to change the value of it
		return this.dbColumnNames.map( columnName => columnName + " = :" + columnName).join(", ");
	}

	getColumnsAsString ( str ) { 
		let delimiter = ", ";
		if ( str && typeof str === "string" ) { 
			delimiter = str;
		}
		return this.dbColumnNames.join(delimiter);
	}

	/*** SQL Generators ***/
	generateInsertStatement ( ) {
		this.primaryKeyValue = this.primaryKeyValue ? this.primaryKeyValue : this.generateHash();
		let query = new SQLStatement("INSERT INTO "+this.dbTableName+" ("+this.primaryKeyColumn+", "+this.getColumnsAsString()+") VALUES (:"+this.primaryKeyColumn+", "+this.buildBindParamList()+") RETURNING "+this.primaryKeyColumn);
		
		query.bind(this.primaryKeyColumn,this.primaryKeyValue);
		this.dbColumnNames.forEach( el => {
				query.bind( el, this[el] );
		});
		return query.getPreparedStatement();
	}

	generateUpdateStatement ( ) { //Returns SQL to update a SINGLE entry
		let query = new SQLStatement("UPDATE "+this.dbTableName+" SET "+this.buildUpdatePairs()+" WHERE "+this.primaryKeyColumn+"=:"+this.primaryKeyColumn);
		
		query.bind(this.primaryKeyColumn,this.primaryKeyValue);
		this.dbColumnNames.forEach( el => {
				query.bind( el, this[el] );
		});
		return query.getPreparedStatement();
	}

	generateDeleteStatement ( ) { //Returns SQL to delete a SINGLE entry
		let query = new SQLStatement("DELETE FROM "+this.dbTableName+" WHERE "+this.primaryKeyColumn+" = :"+this.primaryKeyColumn);
		query.bind(this.primaryKeyColumn,this.primaryKeyValue);
		return query.getPreparedStatement();
	}

	generateSelectStatement ( ) { //Returns SQL to retrieve entry for a SINGLE object
		let query = new SQLStatement("SELECT "+this.getColumnsAsString()+" FROM "+this.dbTableName+" WHERE "+this.primaryKeyColumn+"=:"+this.primaryKeyColumn);
		query.bind(this.primaryKeyColumn,this.primaryKeyValue);
		return query.getPreparedStatement();
	}

	generateHash ( ) {
		let reducer = (accumulator, currentValue) => accumulator + this[currentValue];
		let objData = this.dbColumnNames.reduce(reducer,"");
		return uuidv5(objData,UUID_NAMESPACE);
	}

}
module.exports = DBObject;





