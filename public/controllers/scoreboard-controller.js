gpApp.controller("ScoreboardCtrl", function($scope, $http) {

	$http.get("/users").success(function(users){
		$scope.users = users;
	})

});