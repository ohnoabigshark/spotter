class SQLStatement { 
	constructor ( statement ) {
		this.statement = statement;
		this.bindMap = new Map();
	}

	bind ( key, value ) {
		let regex = /:[a-zA-Z0-9]+/g;
		let matches = this.statement.match(regex);
		if ( typeof value === "string" ) {
			value = value.replace("'","''")//TODO: Need to escape other chars.
			value = "'"+value+"'"; 
		}

		if ( matches.find( el => el == ":"+key ) ) {
			this.bindMap.set(":"+key,value);
		}
		return this;
	}

	getPreparedStatement ( ) {
		let bindMapIterator = this.bindMap.keys();
		let key, value;
		let preparedStatement = this.statement;
		let result = bindMapIterator.next();
		while ( !result.done ) {
			key = result.value;
			value = this.bindMap.get(key);
			if ( value != undefined ) {
				preparedStatement = preparedStatement.replace(key,value);
			}
			result = bindMapIterator.next();
		}
		return preparedStatement;
	}

	get statement ( ) {
		return this._statement;
	}

	set statement ( statement ) {
		//TODO: should check for duplicate bind params
		if ( typeof statement !== "string" )
			throw ("Could not set statement because "+statement+" is not of type string.");
		if ( statement.length < 1 ) 
			throw ("statement is of length: "+statement.length+". Needs to be > 0.");
		this._statement = statement;
	}

}

module.exports = SQLStatement;
/*
let test = new SQLStatement("INSERT INTO test (test2) VALUES(:test2, :test, :bloom)");
console.log(test.statement);
test.bind("test2","basic 'replace").bind("test",100).bind("bloom","flarf");
console.log(test.getPreparedStatement());
console.log(test.statement);
*/

