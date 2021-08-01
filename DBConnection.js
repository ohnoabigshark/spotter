const { Pool } = require('pg');
const SQLStatement = require('./SQLStatement.js');
const DBObject = require('./DBObject.js');

class DBConnection {
	constructor ( ) { //TODO: Modify this so that we can connect to test DB
		this.pool = new Pool ({
			connectionString: process.env.DATABASE_URL || 'postgresql://postgres:dummy@localhost:5432/spottertest',
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

	//TODO: Add return values to save, load, delete that signify whether the operation was successful or not.
	async save ( dbObject, reload ) { 
		let client = await this.pool.connect();
		try { 
			if ( dbObject ) {
				if ( dbObject instanceof DBObject ) { 
					if ( dbObject.isInDB() ) {
						console.log(dbObject.generateUpdateStatement());
						const res = await client.query(dbObject.generateUpdateStatement());
						if ( reload ) {
							await this.load(dbObject.primaryKeyValue,dbObject);
						}
					} else {
						console.log(dbObject.generateInsertStatement());
						const res = await client.query(dbObject.generateInsertStatement());
						let uuid = res.rows[0][dbObject.primaryKeyColumn];
						if ( reload && uuid ) {
							await this.load(uuid,dbObject);
						}  
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
			client.release();
		}
		if ( error ) {
			throw error;
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