var gpApp = angular.module("gpApp", ['ngRoute']);

gpApp.controller("RegisterCtrl", function(){

});

gpApp.controller("LoginCtrl", function(){

});

gpApp.service("_dataStore", function(){
	return {
		context : {},
		set : function(key, value){
			if (value !== undefined)
				this.context[key] = value;
		},
		get : function(key){
			return this.context[key];
		}
	}
}); 

gpApp.service("dataStore", function(){
	return {
		context : {},
		set : function(key, value){
			if (value !== undefined)
				localStorage[key] = JSON.stringify(value);
		},
		get : function(key){
			if (key === undefined)
				return undefined;
			
			var value = localStorage[key];
			if (value !== undefined)
				return JSON.parse(value);
			else
				return undefined;
		}
	}
}); 

gpApp.service("predictionDataService", function(dataStore){

	var predictionDataService = {}; 
		//context = {};
		
	predictionDataService.races = [
			//{ id:0, name : "Select race"},
			{ id:1, name : "Australian Grandpree"},
			{ id:2, name : "UK Grandpree"},
			{ id:3, name : "French Grandpree"},
			{ id:4, name : "German Grandpree"}
		];

	predictionDataService.drivers = [
			{ id : "1", name : "Driver 1", selected : false},
			{ id : "2", name : "Driver 2", selected : false},
			{ id : "3", name : "Driver 3", selected : false},
			{ id : "4", name : "Driver 4", selected : false},
			{ id : "5", name : "Driver 21", selected : false},
			{ id : "6", name : "Driver 22", selected : false},
			{ id : "7", name : "Driver 23", selected : false},
			{ id : "8", name : "Driver 24", selected : false}
		];

	predictionDataService.storePrediction = function(predictionDetails){
		if (predictionDetails !== undefined && predictionDetails.racePrediction !== undefined){
			var racePrediction = predictionDetails.racePrediction;
			dataStore.set(racePrediction.name, racePrediction);
			//context[racePrediction.name] = racePrediction;
		}
	};

	predictionDataService.findPrediction = function(predictionDetails){
		// context[predictionDetails.raceName]
		var prediction = dataStore.get(predictionDetails.raceName) || {
			name : predictionDetails.raceName,
			predictions : []
		};

		return prediction;
	};

	return predictionDataService;
});

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

gpApp.controller("PredictionCtrl", function StoryCtrl($scope, predictionDataService, predictionManager){

	$scope.races = predictionDataService.races;
	$scope.drivers = predictionDataService.drivers;
	$scope.driverSelectionVisible = false;
	$scope.predictionTypes = ["grid", "retire", "podium"];

	$scope.maxPointsUsed = function(){
		return $scope.totalPoints() === 10;
	}

	$scope.selectedRace = function(){
		if ($scope.selectedRaceId === undefined)
			return;		
		var race = _.find($scope.races, function(race) {return race.id === $scope.selectedRaceId });
		var raceName = race.name;
		return raceName;
	};

	$scope.showOrHideDriverSelection = function(showOrHide){
		$scope.driverSelectionVisible = showOrHide;
	}

	$scope.changeRaceSelection = function(){
		if ($scope.selectedRace() === "")
			return;
		predictionDataService.storePrediction({racePrediction : $scope.racePrediction});
		$scope.racePrediction = predictionDataService.findPrediction({raceName : $scope.selectedRace()});
		predictionManager.manageDriverSelection($scope.drivers, $scope.racePrediction.predictions);
	}

	$scope.driverSelectionChanged = function(driver){
		if ($scope.racePrediction !== undefined)
			predictionManager.selectDriver(driver, $scope.racePrediction.predictions);
	};

	$scope.totalPoints = function(){
		return predictionManager.totalPoints($scope.racePrediction);
	};

	$scope.pointsPerCategory = function(){
		return predictionManager.groupPointsByType($scope.racePrediction);
	};

	$scope.increase = function(prediction, field){
		if ($scope.maxPointsUsed())
			return;
		prediction.points[field] = prediction.points[field] + 1;
		prediction.totalPoints +=1;
	};

	$scope.decrease = function(prediction, field){
		if (prediction.points[field] === 0)
			return;
		prediction.points[field] = prediction.points[field] - 1;
		prediction.totalPoints -=1;
	};

	$scope.submitPrediction = function(prediction){
		$scope.racePrediction.submitted = true;
	}

	$scope.reopenPrediction = function(prediction){
		$scope.racePrediction.submitted = false;
	}
});

gpApp.config(function($routeProvider, $locationProvider){
	$routeProvider.when("/register", 
	{
		templateUrl : "templates/register.html",
		controller : "RegisterCtrl"
	});
	$routeProvider.when("/login", 
	{
		templateUrl : "templates/login.html",
		controller : "LoginCtrl"
	});
	$routeProvider.when("/predictions", 
	{
		templateUrl : "templates/prediction.html",
		controller : "PredictionCtrl"
	});


});