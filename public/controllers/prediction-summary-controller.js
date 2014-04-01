gpApp.controller("PredictionSummaryCtrl", function ($scope, $http, predictionDataService) {
	"use strict";

	$scope.races = predictionDataService.races;

	$scope.raceSelectionChanged = function(){
		predictionDataService.racePredictions($scope.selectedRace.name, function(predictions){
			$scope.racePredictions = predictions;
		});
	}

})