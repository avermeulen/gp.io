"use strict";

var ScoringEngine = require("scoring-engine");

var ScoringService = function(raceResultsService, driverService, predictionService){
	var self = this;
	self.scoringEngine = new ScoringEngine(raceResultsService, driverService, predictionService);
	return {
		score : function(raceName, callback){
            self.scoringEngine.score(raceName, callback);
		}
	}
};

//module.exports = ScoringService;


