

gpApp.controller("RegisterCtrl", function($scope, $rootScope, $http, $location){
	"use strict";

	$scope.user = {};

	$scope.register = function(){

		var loginDetails = {
			username : $scope.username,
			password : $scope.password
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