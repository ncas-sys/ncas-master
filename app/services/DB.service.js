var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/ncas';
var ObjectId = require('mongodb').ObjectID;
var $q = require('q');

function DB(){
	
	
}

DB.prototype.getCode = function(code){
	var def = $q.defer();
	var codes = [];
	var findRestaurants = function(db, callback) {
		var cursor =db.collection('codes').find( { "code": code } );
		cursor.each(function(err, doc) {
			assert.equal(err, null);
			if (doc != null) {
				codes.push(doc);
			} else {
				callback();
			}
		});
	};
	
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		findRestaurants(db, function() {
			def.resolve(codes);
			db.close();
		});
	});
	return def.promise;
}

DB.prototype.getCommand = function(command){
	var def = $q.defer();
	var commands = [];
	var findRestaurants = function(db, callback) {
		var cursor =db.collection('commands').find( { "command": command } );
		cursor.each(function(err, doc) {
			assert.equal(err, null);
			if (doc != null) {
				commands.push(doc);
			} else {
				callback();
			}
		});
	};
	
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		findRestaurants(db, function() {
			def.resolve(commands);
			db.close();
		});
	});
	return def.promise;
}

module.exports = function(){
	return new DB();
}