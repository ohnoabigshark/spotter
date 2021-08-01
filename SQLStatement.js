/*
	SQLStatement

	This class represents a SQLStatement that can be run on a SQL database.
	Binds are stored in a map and are not applied to the statement until 
	getPreparedStatement is called.

*/


//TODO: SQL/postgres is not case sensitive when it comes to field names. Need to account for this.
class SQLStatement { 
	constructor ( statement ) {
		this.statement = statement;
		this.bindMap = new Map();
		this.bindVarRegex = /:[a-zA-Z0-9]+/g; //TODO: add underscores and dashes
		//TODO: Should check statement for semicolon. We never want semicolons.
	}

	bind ( key, value ) {
		if ( typeof value === "string" ) {
			value = value.replace("'","''")//TODO: Need to escape other chars.
			if (value == "current_timestamp") {
				//do nothing, want it to be raw value in query
			} else if ( value == "default" ) {
				//do nothing, want raw value in query
			} else {
				value = "'"+value+"'"; 
			}
		}  else if ( value == null ) {
			//TODO: How do we handle null? There may be occasions where we want to pass null
		}

		//find all potential bind parameters
		let matches = this.statement.match(this.bindVarRegex);
		if ( matches.find( el => el == ":"+key ) ) {
			//search through all bind parameters and if one is found, add to bindMap
			this.bindMap.set(":"+key,value);
		}
		return this;
	}

	getPreparedStatement ( ) {
		let bindMapIterator = this.bindMap.keys();
		let key, keyRegex, value;
		let preparedStatement = this.statement;
		let result = bindMapIterator.next();
		while ( !result.done ) {
			key = result.value;
			keyRegex = new RegExp(key,"g"); //Want to match all instances of the given key
			value = this.bindMap.get(key);
			if ( value != undefined ) {
				preparedStatement = preparedStatement.replace(keyRegex,value);
			} else if ( value === null ) {
				preparedStatement = preparedStatement.replace(keyRegex,'null')
			} else if ( value === undefined ) {
				preparedStatement = preparedStatement.replace(keyRegex,"default")
			}
			result = bindMapIterator.next();
		}

		return preparedStatement;
	}

	get statement ( ) {
		return this._statement;
	}

	set statement ( statement ) {
		if (!this._statement) {
			if ( typeof statement !== "string" )
				throw ("Could not set statement because "+statement+" is not of type string.");
			if ( statement.length < 1 ) 
				throw ("statement is of length: "+statement.length+". Needs to be > 0.");
			this._statement = statement;
		} else {
			throw new Error("SQLStatement: Cannot change statement value after instantiation.");
		}
	}

}

module.exports = SQLStatement;
