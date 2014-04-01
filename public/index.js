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
    			return user.name;
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
		},
		get : function(key, callback){

			if (key === undefined)
				return undefined;

			$http.get("/prediction/" + key).success(callback);
		}
	}
});

gpApp.service("dataStore", function(mongoDataStore, localStorageDataStore){
	return mongoDataStore;
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
	$routeProvider.when("/about", 
	{
		templateUrl : "templates/about.html",
		controller : "LoginCtrl"
	});
	
	var loggedIn = function($q, $timeout, $http, $location, $rootScope){
		var deferred = $q.defer();
		$http.get("/loggedin").success(function(user){
				if(user !== "0")
					$timeout(deferred.resolve, 0);
				else {
					$rootScope.message = 'You need to log in.';
  					$timeout(function(){deferred.reject();}, 0);
  					$location.url('/login');			
				}
		});
		return deferred.promise;
	};

	$routeProvider.when("/predictions", 
	{
		templateUrl : "templates/prediction.html",
		controller : "PredictionCtrl",
		resolve : {
			loggedin : loggedIn
		}
	});

	$routeProvider.when("/prediction-summary", 
	{
		templateUrl : "templates/prediction-summary.html",
		controller : "PredictionSummaryCtrl",
		resolve : {
			loggedin : loggedIn
		}
	});

	$routeProvider.when("/scoreboard", 
	{
		templateUrl : "templates/scoreboard.html",
		controller : "ScoreboardCtrl",
		resolve : {
			loggedin : loggedIn
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


