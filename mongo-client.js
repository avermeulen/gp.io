var MongoDB = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID,
	mongoDB;

var MongoClient = function(mongoUrl, collections){
	if (!mongoUrl)
		throw Error("Mongo database url not specified");
	this.mongoUrl = mongoUrl;
	this.collections = collections;
};

MongoClient.prototype.connect = function(connectedCallback){
	var self = this;
	MongoDB.connect(this.mongoUrl, function(err, db){
		mongoDB = db;
		setupCollections.call(self, db);
		connectedCallback();
	});
}

MongoClient.prototype.collection = function(collection){
	return mongoDB.collection(collection);
};

MongoClient.prototype.Id = function(id) {
	return new ObjectID(id);
};

var setupCollections = function(db){
	for (var i = this.collections.length - 1; i >= 0; i--) {
		var collectionName = this.collections[i];
		this[collectionName] = db.collection(collectionName);
	};
}

module.exports = MongoClient;