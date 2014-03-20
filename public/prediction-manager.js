gpApp.service("predictionManager", function(){
	var predictionManager = {};

	predictionManager.selectDriver = function(driver, predictions){
		var findDriver = function(prediction) { 
			return prediction.driverName === driver.name
		};

		var existPredictionEntry = _.find(predictions, findDriver);
		if (driver.selected === "true" && existPredictionEntry === undefined){
			var predictionEntry = {
				driverName: driver.name, 
				points : {grid : 0, podium : 0, retire: 0}, 
				selected: false, totalPoints:0
			};
			predictions.push(predictionEntry);
		}
		else if (driver.selected === "false" && existPredictionEntry !== undefined){
			_.remove(predictions, findDriver);
		}
	};

	predictionManager.manageDriverSelection = function(drivers, predictions){
		var selectedDrivers = _.pluck(predictions, "driverName");
		_.each(drivers, function(driver){	
			driver.selected = _.contains(selectedDrivers, driver.name) ? "true" : "false";
		});
	}

	predictionManager.groupPointsByType = function(racePrediction){
		var empty = {grid : 0, podium : 0, retire: 0};

		if (racePrediction === undefined)
			return empty;

		return _.reduce(
			racePrediction.predictions, 
			function(initialPoints, prediction){
				var points = prediction.points;
				initialPoints.grid += points.grid ? points.grid : 0;
				initialPoints.retire += points.retire ? points.retire : 0;
				initialPoints.podium += points.podium ? points.podium : 0;
				return initialPoints;
			}, empty);
	}

	

	
	predictionManager.totalPoints = function(racePrediction){

		if (racePrediction === undefined)
			return 0;
		var total = _.reduce(racePrediction.predictions, 
			function(t, pred) {
				return t + pred.totalPoints
			}, 0);
		return total !== undefined ? total : 0;

	}

	return predictionManager;
});