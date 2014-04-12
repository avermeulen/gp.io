var fs = require("fs"),	
	assert = require("assert"),
	ScoringEngine = require("../scoring-engine")

var FindDriver = function(driverName){
			this.findDriverByName = function(driverName, callback){
				callback(null, {group : "A"})
			}
    },
    FindRaceResults = function(results){
        return {
            findRaceResults : function(raceName, callback){
                callback(null, results);
            }
        }
    };

describe("Scoring Service", function(){
	it("should calculate score for a race", function(done){
		var predictions = [
		  {
		    name: "Malaysian Grand Prix",
		    banker : false,
		    predictionType: "bothWays",
		    predictions : [
		      {
		        driverName : "Driver1",
		        points : {
		        	grid : 2,
		          	podium: 4,
		          	retire: 0
		        },
		        selected : false,
		        totalPoints : 3
		      },

		      {
		        driverName : "Driver2",
		        points : {
		        	grid : 0,
		          	podium: 0,
		          	retire: 3
		        },
		        selected : false,
		        totalPoints : 3
		      }

		    ],
		     submitted : true,
		     user_id : "5339a6098edc2744eb7b966f",
		    _id : "5339a95833229b19ec799b77",
		    user_name : "test@email.com"
		  }
		]

		results = {
			grid : {
				first : "Driver1",
				second : ""
			},
			podium : {
				first : "Driver1",
				second : "",
				third : ""
			},
			retirees : [
				"Driver2"
			]
		};

		var scoringEngine = new ScoringEngine(new FindRaceResults(results), new FindDriver());
		var scoringPredictions = scoringEngine.calculate(predictions, 
				function(err, predictions){
                	scoringPredictions = predictions;
                	var prediction = scoringPredictions[0];
					assert.equal(16, prediction.predictions[0].points);
					assert.equal(24, prediction.predictions[1].points);
					done();
                });
	});

	it("should double the score for a banker", function(done){

		var predictions = [
		  {
		    name: "Malaysian Grand Prix",
		    banker : true,
		    predictionType: "bothWays",
		    predictions : [
		      {
		        driverName : "Driver1",
		        points : {
		        	grid : 2,
		          	podium: 4,
		          	retire: 0
		        },
		        selected : false,
		        totalPoints : 3
		      },

		      {
		        driverName : "Driver2",
		        points : {
		        	grid : 0,
		          	podium: 0,
		          	retire: 3
		        },
		        selected : false,
		        totalPoints : 3
		      }

		    ],
		     submitted : true,
		     user_id : "5339a6098edc2744eb7b966f",
		    _id : "5339a95833229b19ec799b77",
		    user_name : "test@email.com"
		  }
		]

		results = {
			grid : {
				first : "Driver1",
				second : ""
			},
			podium : {
				first : "Driver1",
				second : "",
				third : ""
			},
			retirees : [
				"Driver2"
			]
		};

		var scoringEngine = new ScoringEngine(
            new FindRaceResults(results),
            new FindDriver());

		var scoringPredictions = scoringEngine.calculate(predictions, function(err, scoringPredictions){
        	var prediction = scoringPredictions[0];
			assert.equal(32, prediction.predictions[0].points);
			assert.equal(48, prediction.predictions[1].points);
			done();
		});

	});

	it("should double winning point for win only when winOnly selected", function(done){

		var predictions = [
		  {
		    name: "Malaysian Grand Prix",
		    banker : true,
		    predictionType: "bothWays",
		    predictions : [
		      {
		        driverName : "Driver1",
		        points : {
		        	grid : 2,
		          	podium: 4,
		          	retire: 0
		        },
		        selected : false,
		        totalPoints : 3
		      },

		      {
		        driverName : "Driver2",
		        points : {
		        	grid : 0,
		          	podium: 0,
		          	retire: 3
		        },
		        selected : false,
		        totalPoints : 3
		      }

		    ],
		     submitted : true,
		     user_id : "5339a6098edc2744eb7b966f",
		    _id : "5339a95833229b19ec799b77",
		    user_name : "test@email.com"
		  }
		]

		results = {
			grid : {
				first : "Driver1",
				second : ""
			},
			podium : {
				first : "Driver1",
				second : "",
				third : ""
			},
			retirees : [
				"Driver2"
			]
		};

		var scoringEngine = new ScoringEngine(new FindRaceResults(results), new FindDriver());
		var scoringPredictions = scoringEngine.calculate(predictions);

		//console.log(JSON.stringify(scoringPredictions));
		//assert.equal(32, scoringPredictions[0].predictions[0].points);
		//assert.equal(48, scoringPredictions[0].predictions[1].points);

		done();

	});
});	