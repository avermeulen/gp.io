"use strict";

var PredictionService = require("prediction-service"),
	MongoClient = require("mongo-client"),
	assert = require("assert");

describe("Prediction Service", function () {
	var url = "mongodb://127.0.0.1:27017/gp_io",
		mongoClient = new MongoClient(url, ["predictions"]),
		predictionService = null;

	before(function(done){			
		mongoClient.connect(function(){
			console.log("intialized");
			predictionService = new PredictionService(mongoClient);	
			var predictions = mongoClient.predictions;
			predictions.remove({user_id : "123", name : "Test Race"}, function(){});
			predictions.remove({user_id : "222", name : "Test Race 222"}, function(){});
			predictions.insert({user_id : "222", name : "Test Race 222"}, function(){});
			done();
		});
	});	

	describe("store", function(){
	  
	  it("should save the prediction and find it", function(done){
	  	predictionService.store(
	  		{user_id : "123"}, 
	  		{name : "Test Race"}
	  		,function(){
	  				predictionService.findPrediction({user_id : "123", name : "Test Race"}, function(err, prediction){
	    				console.log(arguments)
	    				done();
	    			});
	  			},
	  		function(err){
	  			assert.fail(err);
	  			done();
	  		});
	  	

	  });
	});

	describe("update", function(){
	  
	  it("should update the prediction", function(done){

	  	async.waterfall([
	  			function(callback){
	  				predictionService.findPrediction({user_id : "222", name : "Test Race 222"}, callback);
	  			},
	  			function(prediction, callback){
	  				assert.ok(prediction !== null, "prediction not found");
	    			predictionService.store({ user_id : "222"}, {name : "Test Race 222", details : "bla"},function(){
	    					done();
	    				});	
	  			}
	  		], function(){
	  			console.log("err : " + arguments);
	  		})
	  		
	  	
	  });
	});

});