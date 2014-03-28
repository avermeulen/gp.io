gpApp.controller("RegisterCtrl", function($scope, $rootScope, $http, $location, predictionDataService){
	"use strict";

	$scope.user = {};

	$scope.teams = predictionDataService.teams;

	$scope.register = function(){

		var loginDetails = {
			username : $scope.username,
			password : $scope.confirmPassword,
			team : $scope.team.name
		};

		$http.post("/register", loginDetails).success(function(result){

			if (result.status === "success"){
				$rootScope.message = 'Registration successful! Please login.';	
				$location.url("/login");
			}
			else {
				$rootScope.message = 'Email address already used. Please try again.';
				$location.url("/register");	
			}
		});
	};

});