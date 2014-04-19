gpApp.controller("ScoreboardCtrl", function($scope, $http) {
	$http.get("/scores-summary").success(function(scores){
		$scope.scores = scores;
	})
});