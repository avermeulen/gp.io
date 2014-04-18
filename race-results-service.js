"use strict";

var async = require("async");

var RaceResultsService = function (mongoClient) {
	this.mongoClient = mongoClient;	
}

RaceResultsService.prototype.find = function(query, resultCallback) {
	this.mongoClient.race_results.findOne(query, resultCallback);
};

RaceResultsService.prototype.store = function(queryDetails, raceResultsParam, resultCallback) {
	var self = this;
	async.waterfall([
			function(callback){
				self.find(queryDetails, callback);
			},
			function(raceResult, callback){
				var race_results = self.mongoClient.race_results;
				if (raceResult == null)
					race_results.insert(raceResultsParam, callback);
				else{
					delete raceResult._id;
					race_results.update(queryDetails, {$set : raceResultsParam}, {w:1}, callback);
				}
			},
			function(raceResult, callback){
				resultCallback(raceResult);
			}
		],
		function(err){
			if (err)
				errorCallback(err)
		});
};

RaceResultsService.prototype.findRaceResults = function(raceName, callback) {
	this.find({race : raceName}, callback);
};

module.exports = RaceResultsService;