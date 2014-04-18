"use strict";

var PredictionService = require("../prediction-service"),
	MongoClient = require("../mongo-client"),
	assert = require("assert");

var drivers = [
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
			];	


describe("Adding Drivers Service", function () {
	var url = "mongodb://127.0.0.1:27017/gp_io",
		mongoClient = new MongoClient(url, ["drivers"]);

	/*	
	it("Should add drivers", function(done){
		mongoClient.connect(function(){
			console.log("initialized");
			var predictions = mongoClient.predictions;
			mongoClient.drivers.insert(drivers, function(){
				done();	
			});			
		});
	});
	*/

});