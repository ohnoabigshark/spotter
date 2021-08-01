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
		if ( this._pool )
			throw new Error ("pool is constant.");
		this._pool = pool;
	}

	//TODO: Add return values to save, load, delete that signify whether the operation was successful or not.
	async save ( dbObject, reload ) { 
		let client = await this.pool.connect();
		let error;
		try { 
			if ( dbObject && dbObject instanceof DBObject ) {
				if ( dbObject.isInDB() ) {
					const res = await client.query(dbObject.generateUpdateStatement());
					if ( reload ) {
						await this.load(dbObject.primaryKeyValue,dbObject);
					}
				} else {
					const res = await client.query(dbObject.generateInsertStatement());
					let uuid = res.rows[0][dbObject.primaryKeyColumn];
					if ( reload && uuid ) {
						await this.load(uuid,dbObject);
					}  
				}
			} else {
				error = new Error("Trying to save something that is not an instance of DBObject");
			}
		} finally {
			client.release();
		}
		if (error) {
			throw error;
		}
	}

	async load ( id, dbObject ) { 
		let client = await this.pool.connect();
		let error;
		try {
			if ( dbObject && dbObject instanceof DBObject ) {
				dbObject.primaryKeyValue = id;
				const res = await client.query(dbObject.generateSelectStatement());
				if ( res.rows.length == 1) {
					Object.keys(res.rows[0]).forEach( el => dbObject[el] = res.rows[0][el]);
				} else {
					error = new Error("No entry of "+dbObject.dbTableName+"."+dbObject.primaryKeyColumn+":"+dbObject.primaryKeyValue);
				}
			}
			else {
				error = new Error("Unable to call DBConnection.load without a valid DBObject.");
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
		let error;
		try {
			if ( dbObject && dbObject instanceof DBObject ) {
				const res = await client.query(dbObject.generateDeleteStatement());
			} else {
				error = new Error("Unable to call DBConnection.delete without a valid DBObject.");
			}
		} finally {
			client.release();
		}
		if (error) {
			throw error;
		}
	}
}

module.exports = DBConnection;