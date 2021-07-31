const { Pool } = require('pg');
const SQLStatement = require('./SQLStatement.js');
const DBObject = require('./DBObject.js');

class DBConnection {
	constructor ( ) {
		this.pool = new Pool ({
			connectionString: process.env.DATABASE_URL || 'postgresql://postgres:dummy@localhost:5432/spotter',
			ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
			idleTimeoutMillis: 30000,
  			connectionTimeoutMillis: 2000
		});

		
	}

	get pool ( ) {
		return this._pool;
	}

	set pool ( pool ) { //TODO: Do we need to do any error checking here?
		this._pool = pool;
	}

	async save ( dbObject ) { //TODO: Should this return the response?
		let client = await this.pool.connect();
		try { 
			if ( dbObject ) {
				if ( dbObject instanceof DBObject ) { 
					//need to check DB to see if object exists
					if ( dbObject.isInDB() ) {
						console.log(dbObject.generateUpdateStatement());
						const res = await client.query(dbObject.generateUpdateStatement());
					} else {
						const res = await client.query(dbObject.generateInsertStatement());
					}
				}
				else //TODO: Need to bubble this error up out of the try/catch. See load function for example.
					throw("Trying to save something that is not an instance of DBObject");

			} else {
				console.log("Nothing to save.");
			}
		} finally {
			client.release();
		}
	}

	//TODO: Do we want this to just return data for an entry and then handle object creation elsewhere?
	async load ( id, dbObject ) { //TODO: Can we make this so we don't need to pass in the dbObject? Maybe just pass it a TYPE instsead? Sort of like Class injection
		let client = await this.pool.connect();
		let error;
		//TODO: Check if dbObject
		try {
			dbObject.primaryKeyValue = id;
			const res = await client.query(dbObject.generateSelectStatement());
			if ( res.rows.length == 1) {
				Object.keys(res.rows[0]).forEach( el => dbObject[el] = res.rows[0][el]);
			} else {
				error = new Error("No entry of "+dbObject.dbTableName+"."+dbObject.primaryKeyColumn+":"+dbObject.primaryKeyValue);
			}
		} finally {
			if ( error ) {
				throw error;
			}
			client.release();
		}
	}

	async delete ( dbObject ) {
		let client = await this.pool.connect();
		try {
			const res = await client.query(dbObject.generateDeleteStatement());
			console.log(res);
		} finally {
			client.release();
		}
	}
}

module.exports = DBConnection;