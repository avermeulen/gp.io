var MongoDB = require('mongodb').MongoClient;

var MongoClient = function(mongoUrl){
	if (!mongoUrl)
		throw Error("Mongo database url not specified");
	this.mongoUrl = mongoUrl;
};

MongoClient.prototype.mongoAction = function(mongoAction){
	MongoDB.connect(this.mongoUrl, mongoAction);
};

module.exports = MongoClient;