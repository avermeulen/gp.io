gpApp.service("predictionDataService", function(dataStore){

	var predictionDataService = {}; 
		
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

	predictionDataService.storePrediction = function(predictionDetails, user_id){
		if (predictionDetails !== undefined && predictionDetails.racePrediction !== undefined){
			var racePrediction = predictionDetails.racePrediction;
			racePrediction.user_id = user_id;
			dataStore.set(racePrediction.name, { prediction : angular.toJson(racePrediction)});
		}
	};

	predictionDataService.findPrediction = function(predictionDetails, resultCallback){
		var callback = function(results){
			if (!results){
				resultCallback({
					name : predictionDetails.raceName,
					predictions : []
				});
			}
			resultCallback(results);
		};
		dataStore.get(predictionDetails.raceName, callback);
	};

	return predictionDataService;
});