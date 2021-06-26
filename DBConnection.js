const { Client } = require('pg');
const DBOperation = require('./DBOperation.js');
const DBObject = require('./DBObject.js');

function DBConnection( /* We could pass connection information in here */ ) {
	if ( !this.client ) { //if we do not have a client connection already, make one
		this.client = new Client({
		    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:dummy@localhost:5432/spotter',
		    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false 
		    //process.env.DATABASE_URL ? true : false
		});
		console.log("Opening DB connection.");
	}

	this.client.connect();

}

DBConnection.prototype.save = function ( dbObject /* Takes an object */ ) {
	if ( dbObject ) {
		if ( dbObject instanceof DBObject ) { //should DBObject try to track its state?
			//need to check DB to see if object exists
				//if it does, save it
				//if it doesn't, insert it
			dbObject.getColumnsAsString();
			console.log("We have a DBObject! Save it.");
		}
		else
			throw("Trying to save something that is not an instance of DBObject");

	} else {
		console.log("Nothing to save.");
	}
}

DBConnection.prototype.load = function ( id ) {
	console.log("Load data from DB.");
}

module.exports = DBConnection;