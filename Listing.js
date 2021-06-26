const DBObject = require('./DBObject.js');

class Listing extends DBObject {

  	constructor ( id ) {
  		const dbColumnNames = ["id","dateposted","datescraped","datelastviewed","location",
  								"sellerid", "title", "description", "price", "status", "hash",
  								"service", "serviceuid"];
		const dbTableName = "listing";
		super(dbTableName, dbColumnNames);
		this._id = id;
	}

	get id ( ) {
		return this._id;
	}

	set id ( id ) {
		throw( "Cannot set id of DBObject after object creation." );
		return this._id;
	}

	get name ( ) {
		return this._name;
	}

	set name ( str ) {
		if ( typeof str !== 'string' )
			throw ( "Cannot set Listing.name to "+str+" because it is not of type string.");
		//this.dbOperationUpdate();
		this._name = str;
	}
}

module.exports = Listing;