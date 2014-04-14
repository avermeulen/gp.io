"use strict";

var async = require("async");

var PredictionService = function(mongoClient){
	this.mongoClient = mongoClient;	
};

PredictionService.prototype.findPrediction = function(queryDetails, callback){
	var self = this;
	self.mongoClient.predictions.findOne(queryDetails, callback);
};

PredictionService.prototype.findRacePredictions = function(queryDetails, clientCallback){
	var self = this;
	var predictionList = [];

	var racePredictions = self.mongoClient.predictions.find(queryDetails);
	racePredictions.toArray(function(err, predictions){
		async.each(predictions, function(prediction, callback){
			self.mongoClient.users.findOne({_id : self.mongoClient.Id(prediction.user_id)},
				function(err, user){
					prediction.user_name = user.email;
					predictionList.push(prediction);
					callback(err);
				});
		}, function(err){
			clientCallback(err, predictionList);
		});
	});
};

PredictionService.prototype.store = function(user, prediction, doneCallback, errorCallback) {
	var self = this;	
	var queryDetails = {
						user_id : user.user_id, 
						name : prediction.name
					};
	
	async.waterfall([
			function(callback){
				self.findPrediction(queryDetails, callback);
			},
			function(racePrediction, callback){
				prediction.user_id = user.user_id;
				
				if (prediction._id)
					delete prediction._id;

				var predictions = self.mongoClient.predictions;
				if (racePrediction == null){
					predictions.insert(prediction , callback);
				}
				else{
					predictions.update(queryDetails, {$set : prediction}, {w:1}, callback);
				}
			},
			function(racePrediction, callback){
				doneCallback(racePrediction)
			}
		],
		function(err){
			errorCallback(err)
		});
};

module.exports = PredictionService;