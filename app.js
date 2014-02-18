var gpApp = angular.module("gpApp", []);


gpApp.controller("PredictionCtrl", function StoryCtrl($scope){


	$scope.maxPointsUsed = function(){
		return $scope.totalPoints() === 10;
	}

	$scope.drivers = [
		{ id : "1", name : "Driver 1", selected : false},
		{ id : "2", name : "Driver 2", selected : false},
		{ id : "3", name : "Driver 3", selected : false},
		{ id : "4", name : "Driver 4", selected : false},
	];

	$scope.racePrediction = {
		name : "Uk Grand Prix",
		predictions : []
	};

	$scope.predictionTypes = ["grid", "retire", "podium"];

	$scope.driverSelectionChanged = function(driver){

		var findDriver = function(prediction) { return prediction.driverName === driver.name};
		var existPredictionEntry = _.find($scope.racePrediction.predictions, findDriver);
		if (driver.selected === "true" && existPredictionEntry === undefined){
			var predictionEntry = {driverName: driver.name, 
				points : {grid : 0, podium : 0, retire: 0}, selected: false, totalPoints:0};
			$scope.racePrediction.predictions.push(predictionEntry);
		}
		else if (driver.selected === "false" && existPredictionEntry !== undefined){
			_.remove($scope.racePrediction.predictions, findDriver);
		}
	};

	$scope.totalPoints = function(){
		if ($scope.racePrediction === undefined)
			return 0;

		var total = _.reduce($scope.racePrediction.predictions, 
			function(t, pred) {
				return t + pred.totalPoints
			}, 0);

		return total !== undefined ? total : 0;
	};

	$scope.pointsPerCategory = function(){
		return _.reduce($scope.racePrediction.predictions, function(initialPoints, 
			prediction){
			var points = prediction.points;
			initialPoints.grid += points.grid ? points.grid : 0;
			initialPoints.retire += points.retire ? points.retire : 0;
			initialPoints.podium += points.podium ? points.podium : 0;
			return initialPoints;
		}, {grid : 0, podium : 0, retire: 0});
	}

	$scope.increase = function(prediction, field){
		if ($scope.maxPointsUsed())
			return;

		prediction.points[field] = prediction.points[field] + 1;
		prediction.totalPoints +=1;
	}

	$scope.decrease = function(prediction, field){
		if (prediction.points[field] === 0)
			return;
		prediction.points[field] = prediction.points[field] - 1;
		prediction.totalPoints -=1;
	}

});

