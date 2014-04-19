"use strict";

var pointsSchedule = require("./scoring-schedule"),
	async = require("async"),
    _ = require("lodash");

var findDriverResults = function(raceResults, prediction){
	var driverResults = {},
		driverName = prediction.driverName;

	if (prediction.points.grid > 0){
		if (raceResults.grid.first === driverName)
			driverResults.grid_first = prediction.points.grid;
		if (raceResults.grid.second === driverName)
			driverResults.grid_second = prediction.points.grid;
	}

	if (prediction.points.podium > 0){
		if (raceResults.podium.first === driverName)
			driverResults.podium_first = prediction.points.podium;
		if (raceResults.podium.second === driverName)
			driverResults.podium_second = prediction.points.podium;
		if (raceResults.podium.third === driverName)
			driverResults.podium_third = prediction.points.podium;
	}

	var retired = raceResults.retirees.some(function(retiree){ return  retiree === driverName});
	if (retired && prediction.points.retire > 0)
		driverResults.retire = prediction.points.retire;

	return driverResults;
};

var findScoringPredictions = function(raceResults, predictions){
		var scoringPredictions = [];
		predictions.forEach(function(userPrediction){
			var userScoringPredictions = {
				user_id : userPrediction.user_id,
				prediction_id : userPrediction._id,
				banker : userPrediction.banker,
				raceName : userPrediction.name,
				predictions : [],
                
			};
			userPrediction.predictions.forEach(function(prediction){
				var theResults = findDriverResults(raceResults, prediction);
				if (Object.keys(theResults).length !== 0){
					userScoringPredictions.predictions.push({
						driverName : prediction.driverName,
						results : theResults
					});
				}
			});
			if (userScoringPredictions.predictions.length > 0){
				scoringPredictions.push(userScoringPredictions);
			}
		});
		return scoringPredictions;
	};

var calculatePoints = function(scoringPrediction){
		
		scoringPrediction.predictions.forEach(function(predictionEntry){

			var driver = predictionEntry.driver;
			predictionEntry.points = 0;
			predictionEntry.pointsByType = {};

			//todo find a better way to find the first entry in the list
			var scheduleToUse = pointsSchedule.filter(function(schedule){
				return schedule.group == driver.group;
			})[0];

			if (!scheduleToUse)
				return;

			for(var result in predictionEntry.results){
				var parts = result.split("_"),
					resultType = parts[0],
					position = parts.length > 1 ? parts[1] : null,
					predictionPoints = predictionEntry.results[result];

				var points = position != null ? scheduleToUse[resultType][position]: scheduleToUse[resultType];
				points = points || 0;

				var totalPoints = points * predictionPoints;
				predictionEntry.points += totalPoints;
				predictionEntry.pointsByType[resultType] = predictionEntry.pointsByType[resultType] || 0;
				predictionEntry.pointsByType[resultType] += totalPoints;
			}
		});
	};

	var doubleScoreIfBankPlayed = function(scoringPrediction){
        scoringPrediction.predictions.forEach(function(prediction){
            if (scoringPrediction.banker === true){
                prediction.points =  prediction.points ? prediction.points * 2 : 0;
            }
        });
	};

	var calculateGrandTotal = function(prediction){
    	var totalPoints = prediction.predictions.reduce(function(prev, current){
    		return prev + current.points;
    	}, 0);
    	prediction.totalPoints = totalPoints;
    };

    var calculatePointsByCategory = function(prediction){
    	var pointsByCategory = prediction.predictions.reduce(function(prev, current){
    		 prev.grid += current.pointsByType && current.pointsByType.grid ? current.pointsByType.grid : 0;
    		 prev.podium += current.pointsByType.podium ? current.pointsByType.podium : 0;
    		 prev.retire += current.pointsByType.retire ? current.pointsByType.retire : 0;
    		 return prev;
    		 
    	}, {grid : 0, podium : 0, retire : 0});
    	prediction.pointsByCategory = pointsByCategory;
    };

module.exports = function(raceResultsService, driverService, predictionService, userService){

    var enrichUserPrediction = function(scoringPrediction, resultCallback){
    	var predictions = scoringPrediction.predictions;
		async.mapSeries(predictions, 
			function(prediction, callback){
				async.series({
					driver : function(cb){
						driverService.findDriverByName(prediction.driverName, function(err, driver){
							cb(null, driver);	
						});
					},
					user : function(cb){
						userService.findUserById(scoringPrediction.user_id, function(err, user){
							delete user.password
							cb(null, user);
						});
					}
				},
				function(err, results){
					prediction.driver = results.driver;
					scoringPrediction.user_name = results.user.email;
					callback(err, prediction);
				}
			);
		}, function(err, mappedPredictions){
			scoringPrediction.predictions = mappedPredictions;
			resultCallback(err, scoringPrediction);
		});
	};

	var enrichPredictions = function(scoringPredictions, callback){
        async.mapSeries(scoringPredictions, enrichUserPrediction, function(err, predictions){
        	callback(predictions);
        });
    };

	return {
		calculate : function(raceName, resultCallback){
			var userPredictions = null;
	        async.waterfall(
	        [
	        	function(callback){
	        		predictionService.findPredictionsForRace(raceName, callback);
	        	},
	            function(userPredictionsForRace, callback){
	                userPredictions = userPredictionsForRace;
	                raceResultsService.findRaceResults(raceName, callback);
	            },
	            function(raceResults, callback){
	                var predictions = findScoringPredictions(raceResults, userPredictions);
	                enrichPredictions(predictions, function(enrichedPredictions){
	                	enrichedPredictions.forEach(function(prediction){
	                		calculatePoints(prediction);
							doubleScoreIfBankPlayed(prediction);
							calculateGrandTotal(prediction);
							calculatePointsByCategory(prediction);
						});

	                	callback(null, enrichedPredictions);	
	                });
	            }
	        ],
	        resultCallback);
		}
	};
};