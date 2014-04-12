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
				predictions : [],
                banker : userPrediction.banker
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
		var driver = scoringPrediction.driver;
		scoringPrediction.predictions.forEach(function(predictionEntry){
			predictionEntry.points = 0;
			predictionEntry.pointsByType = {};

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

module.exports = function(raceResultsService, driverService){
    
    var findDriversForPrediction = function(scoringPrediction, callback){
		var predictions = scoringPrediction.predictions;
		predictions.forEach(function(prediction){
			driverService.findDriverByName(prediction.driverName, function(err, driver){
				scoringPrediction.driver = driver;
				setTimeout(callback, 20);
			});
		});
	};

	var findDrivers = function(scoringPredictions){
		async.each(scoringPredictions, findDriversForPrediction);
	};

	return {
		calculate : function(userPredictions, resultCallback){
	        async.waterfall(
	        [
	            function(callback){
	                var raceName = _(userPredictions).pluck("name").first();
	                raceResultsService.findRaceResults(raceName, callback);
	            },
	            function(raceResults, callback){
	                var predictions = findScoringPredictions(raceResults, userPredictions);
	                findDrivers(predictions)
	                predictions.forEach(calculatePoints);
	                predictions.forEach(doubleScoreIfBankPlayed);
	                callback(null, predictions);
	            }
	        ],
	        resultCallback);
		}
	};
};