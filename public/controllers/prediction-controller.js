gpApp.controller("PredictionCtrl", 
  function StoryCtrl($scope, $location, $http, predictionDataService, predictionManager){
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
		 predictionDataService.findPrediction({raceName : $scope.selectedRace()}, function(racePrediction){
		 	if (racePrediction !== ""){
		 		$scope.racePrediction = racePrediction;
				predictionManager.manageDriverSelection($scope.drivers, $scope.racePrediction.predictions);
			}
		 });
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

	$scope.pointWarnings = function(){
		var warnings = [];
		var pointsPerCategory = $scope.pointsPerCategory();
		if ($scope.totalPoints() >= 5){
			if (pointsPerCategory['retire'] < 2)
				warnings.push("Add at least 2 retirement predictions");
			if (pointsPerCategory['podium'] < 2)
				warnings.push("Add at least 2 podium predictions");
			if (pointsPerCategory['grid'] < 2)
				warnings.push("Add at least 2 grid predictions");
			if (!$scope.maxPointsUsed())
				warnings.push("Not all points have been used yet.");
		}
		return warnings;
	}

	$scope.canBeSubmitted = function(){
		return ($scope.pointWarnings().length === 0)
			&& $scope.maxPointsUsed();
	}

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