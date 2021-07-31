const DBObject = require('./DBObject.js');

class Listing extends DBObject {

  	constructor ( id ) {
  		const dbColumnNames = ["dateposted","datescraped","datelastviewed","location",
  								"sellerid", "title", "description", "price", "status", "hash",
  								"service", "serviceuid"];
		const dbTableName = "listing";
		super(dbTableName, dbColumnNames);
		if ( id )
			this._id = id;
	}

	get id ( ) {
		return this._id;
	}

	set id ( id ) {
		throw( "Cannot set id of DBObject after object creation." );
		return this._id;
	}

	get title ( ) {
		return this._name;
	}

	set title ( str ) {
		if ( typeof str !== 'string' )
			throw ( "Cannot set Listing.title to "+str+" because it is not of type string.");
		//this.dbOperationUpdate();
		this._name = str;
	}
}

module.exports = Listing;