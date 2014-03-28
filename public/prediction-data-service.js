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
			/*
			{ id : "1", name : "Driver 1", selected : false},
			{ id : "2", name : "Driver 2", selected : false},
			{ id : "3", name : "Driver 3", selected : false},
			{ id : "4", name : "Driver 4", selected : false},
			{ id : "5", name : "Driver 21", selected : false},
			{ id : "6", name : "Driver 22", selected : false},
			{ id : "7", name : "Driver 23", selected : false},
			{ id : "8", name : "Driver 24", selected : false}
			*/
{ id : "1",  driverName : "Sebastian Vettel",  team : "Red Bull Racing"  },
{ id : "2",  driverName : "Daniel Ricciardo",  team : "Red Bull Racing"  },
{ id : "3",  driverName : "Max Chilton",  team : "Marussia"  },
{ id : "4",  driverName : "Nico Rosberg",  team : "Mercedes"  },
{ id : "5",  driverName : "Kimi Räikkönen",  team : "Ferrari"  },
{ id : "6",  driverName : "Romain Grosjean",  team : "Lotus"  },
{ id : "7",  driverName : "Marcus Ericsson",  team : "Caterham"  },
{ id : "8",  driverName : "Kamui Kobayashi",  team : "Caterham"  },
{ id : "9",  driverName : "Sergio Perez",  team : "Force India"  },
{ id : "10",  driverName : "Pastor Maldonado",  team : "Lotus"  },
{ id : "11",  driverName : "Fernando Alonso",  team : "Ferrari"  },
{ id : "12",  driverName : "Jules Bianchi",  team : "Marussia"  },
{ id : "13",  driverName : "Felipe Massa",  team : "Williams"  },
{ id : "14",  driverName : "Kevin Magnussen",  team : "McLaren"  },
{ id : "15",  driverName : "Esteban Gutierrez",  team : "Sauber"  },
{ id : "16",  driverName : "Jenson Button",  team : "McLaren"  },
{ id : "17",  driverName : "Jean-Eric Vergne",  team : "Toro Rosso"  },
{ id : "18",  driverName : "Daniil Kvyat",  team : "Toro Rosso"  },
{ id : "19",  driverName : "Nico Hulkenberg",  team : "Force India"  },
{ id : "20",  driverName : "Lewis Hamilton",  team : "Mercedes"  },
{ id : "21",  driverName : "Valtteri Bottas",  team : "Williams"  },
{ id : "22",  driverName : "Adrian Sutil",  team : "Sauber"  }];

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

	return predictionDataService;
});