
var async = require("async");

var PredictionService = function(mongoClient){
	this.mongoClient = mongoClient;	
};

PredictionService.prototype.findPrediction = function(queryDetails, callback){
	var self = this;
	self.mongoClient.mongoAction(function(err, db){
		self.predictions = db.collection("predictions");
		self.predictions.findOne(queryDetails, callback);
	});
};

PredictionService.prototype.store = function(user, prediction, doneCallback, errorCallback) {
	var self = this;
	var predictionObj = JSON.parse(prediction);

	var queryDetails = {
						user_id : user.user_id, 
						name : predictionObj.name
					};
	
	console.log("===> " + JSON.stringify(queryDetails));

	async.waterfall([
			function(callback){
				self.findPrediction(queryDetails, callback);
			},
			function(racePrediction, callback){
				console.log("racePrediction found : " + racePrediction);

				
				predictionObj.user_id = user.user_id;

				if (racePrediction == null){

					self.mongoClient.mongoAction(function(err, db){
						var predictions = db.collection("predictions");
						console.log("out to add prediction : " + prediction);
						self.predictions.insert(predictionObj , callback);
					});
				}
				else{
					self.mongoClient.mongoAction(function(err, db){
						var predictions = db.collection("predictions");
						console.log("out to update prediction : " + prediction);
						predictions.update(queryDetails, {$set : predictionObj}, {w:1}, callback);
					});
				}
			},
			function(racePrediction, callback){
				doneCallback(racePrediction)
			}
		],
		function(err){
			//console.log("no prediction!");
			errorCallback(err)
		});
};

module.exports = PredictionService;