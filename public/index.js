var gpApp = angular.module("gpApp", ["ngRoute", "ngCookies"])
	.run(function($rootScope, $http, $cookieStore){
		$rootScope.message = '';

    	// Logout function is available in any pages
    	$rootScope.logout = function(){
      		$rootScope.message = 'Logged out.';
      		$http.post('/logout');
    	};

    	$rootScope.loggedInUser = function($session){
    		var user = $cookieStore.get("user");
    		if (user !== undefined)
    			return user.name + " " + user.user_id;
    	}

    	$rootScope.loggedIn = function($session){
    		var user = $cookieStore.get("user");
    		return user !== undefined;
    	}
	});

gpApp.service("_dataStore", function(){
	return {
		context : {},
		set : function(key, value){
			if (value !== undefined)
				this.context[key] = value;
		},
		get : function(key){
			$rootScope.message = 'Authentication failed.';
			return this.context[key];
		}
	}
}); 

gpApp.service("localStorageDataStore", function(){
	return {
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

gpApp.service("mongoDataStore", function($http){
	return {
		set : function(key, value){
			if (value !== undefined)
				$http.post('/prediction', value).success(function(){
					console.log("prediction submitted")
				});

				//localStorage[key] = JSON.stringify(value);

		},
		get : function(key){

			/*
			if (key === undefined)
				return undefined;
			
			var value = localStorage[key];
			if (value !== undefined)
				return JSON.parse(value);
			else
				return undefined;
			*/	
		}
	}
});

gpApp.service("dataStore", function(mongoDataStore, localStorageDataStore){
	return mongoDataStore;
});


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



gpApp.config(function($routeProvider, $locationProvider, $httpProvider){
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
		controller : "PredictionCtrl",
		resolve : {
			loggedin : function($q, $timeout, $http, $location, $rootScope){

				var deferred = $q.defer();

				$http.get("/loggedin")
					.success(function(user){
						if(user !== "0")
							$timeout(deferred.resolve, 0);
						else {
							$rootScope.message = 'You need to log in.';
          					$timeout(function(){deferred.reject();}, 0);
          					$location.url('/login');			
						}
					})
				//$location.url("/login");
				return deferred.promise;
			}
		}
	});
	
	$httpProvider.responseInterceptors.push(function($q, $location) {
      return function(promise) {
        return promise.then(
          // Success: just return the response
          function(response){
            return response;
          }, 
          // Error: check the error status to get only the 401
          function(response) {
            if (response.status === 401)
              $location.url('/login');
            return $q.reject(response);
          }
        );
      }
    });
});


