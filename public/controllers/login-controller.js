gpApp.controller("LoginCtrl", function($scope, $rootScope, $http, $location){
	$scope.user = {};

	$scope.login = function () {

		var loginDetails = {
			username : $scope.user.username,
			password : $scope.user.password
		};

		$http.post('/login', loginDetails)
		.success(function(user){
		    $rootScope.message = 'Authentication successful!';	
			$location.url("/predictions");
		}).error(function(){
			$rootScope.message = 'Authentication failed!';
			$location.url("/login");
		});
	}
});