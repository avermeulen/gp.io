gpApp.service("predictionDataService", function(dataStore, $http){

	var predictionDataService = {}; 
		
	var drivers = 
	[
			{ id : "1",  driverName : "Sebastian Vettel",  team : "Red Bull Racing", group : "A"  },
			{ id : "2",  driverName : "Daniel Ricciardo",  team : "Red Bull Racing", group : "C"  },
			{ id : "3",  driverName : "Max Chilton",  team : "Marussia", group : "D"  },
			{ id : "4",  driverName : "Nico Rosberg",  team : "Mercedes", group : "B"  },
			{ id : "5",  driverName : "Kimi Räikkönen",  team : "Ferrari", group : "B"  },
			{ id : "6",  driverName : "Romain Grosjean",  team : "Lotus" , group : "B"  },
			{ id : "7",  driverName : "Marcus Ericsson",  team : "Caterham", group : "D"  },
			{ id : "8",  driverName : "Kamui Kobayashi",  team : "Caterham", group : "C"  },
			{ id : "9",  driverName : "Sergio Perez",  team : "Force India", group : "C"  },
			{ id : "10",  driverName : "Pastor Maldonado",  team : "Lotus", group : "D"  },
			{ id : "11",  driverName : "Fernando Alonso",  team : "Ferrari", group :"B"  },
			{ id : "12",  driverName : "Jules Bianchi",  team : "Marussia", group : "D"  },
			{ id : "13",  driverName : "Felipe Massa",  team : "Williams", group : "B"  },
			{ id : "14",  driverName : "Kevin Magnussen",  team : "McLaren", group : "D"  },
			{ id : "15",  driverName : "Esteban Gutierrez",  team : "Sauber", group : "D"  },
			{ id : "16",  driverName : "Jenson Button",  team : "McLaren", group : "B"  },
			{ id : "17",  driverName : "Jean-Eric Vergne",  team : "Toro Rosso", group : "D"  },
			{ id : "18",  driverName : "Daniil Kvyat",  team : "Toro Rosso", group : "D"  },
			{ id : "19",  driverName : "Nico Hulkenberg",  team : "Force India", group : "C"  },
			{ id : "20",  driverName : "Lewis Hamilton",  team : "Mercedes", group : "B"  },
			{ id : "21",  driverName : "Valtteri Bottas",  team : "Williams", group : "D"  },
			{ id : "22",  driverName : "Adrian Sutil",  team : "Sauber", group : "C"  }
	],
	driversSortedByGroup = _.sortBy(drivers, function(driver){
		return driver.group
	}),
	teams = _(drivers).pluck("team").uniq().value();

	predictionDataService.races = [
		{ id : "1", name : "Australian Grand Prix" },
		{ id : "2", name : "Malaysian Grand Prix" },
		{ id : "3", name : "Bahrain Grand Prix" },
		{ id : "4", name : "Chinese Grand Prix" },
		{ id : "5", name : "Spanish Grand Prix" },
		{ id : "6", name : "Monaco Grand Prix" },
		{ id : "7", name : "Canadian Grand Prix" },
		{ id : "8", name : "Austrian Grand Prix" },
		{ id : "9", name : "British Grand Prix" },
		{ id : "10", name : "German Grand Prix" },
		{ id : "11", name : "Hungarian Grand Prix" },
		{ id : "12", name : "Belgian Grand Prix" },
		{ id : "13", name : "Italian Grand Prix" },
		{ id : "14", name : "Singapore Grand Prix" },
		{ id : "15", name : "Japanese Grand Prix" },
		{ id : "16", name : "Russian Grand Prix" },
		{ id : "17", name : "United States Grand Prix" },
		{ id : "18", name : "Brazilian Grand Prix" },
		{ id : "19", name : "Abu Dhabi Grand Prix" },
	];

	predictionDataService.teams = [
		{ name : "Red Bull Racing"},
		{ name : "Marussia" },
		{ name : "Mercedes" },
		{ name : "Ferrari" },
		{ name : "Lotus" },
		{ name : "Caterham" },
		{ name : "Force India" },
		{ name : "Williams" },
		{ name : "McLaren" },
		{ name : "Sauber" },
		{ name : "Toro Rosso"}
	];

	predictionDataService.drivers = driversSortedByGroup;

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
					banker : false,
					predictionType : "bothWays",
					predictions : []
				});
			}
			resultCallback(results);
		};
		dataStore.get(predictionDetails.raceName, callback);
	};

	predictionDataService.racePredictions = function(raceName, callback){
		$http.get("/predictions/" + raceName).success(callback);
	};


	return predictionDataService;
});