const { Pool } = require('pg');
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

	async save ( dbObject ) {
		let client = await this.pool.connect();
		try { 
			if ( dbObject ) {
				if ( dbObject instanceof DBObject ) { 
					//need to check DB to see if object exists
					if ( dbObject.isInDB() ) {
						const res = await client.query(dbObject.prepareSqlStatement(dbObject.sqlUpdateStatement));
					} else {
						const res = await client.query(dbObject.generateInsertStatement());
					}
				}
				else
					throw("Trying to save something that is not an instance of DBObject");

			} else {
				console.log("Nothing to save.");
			}
		} finally {
			client.release();
		}
	}

	async load ( id, dbObject ) {
		let client = await this.pool.connect();
		//TODO: Check if dbObject
		try {
			dbObject[dbObject.primaryKeyColumn] = id;
			console.log(dbObject.prepareSqlStatement(dbObject.sqlSelectStatement));
			const res = await client.query(dbObject.prepareSqlStatement(dbObject.sqlSelectStatement));
			console.log(res);
		} finally {
			client.release();
		}
		console.log("Load data from DB.");
	}
}

module.exports = DBConnection;