gpApp.directive('passwordMatch', [function () {
	return {
		restrict: 'A',
		scope : true,
		require : 'ngModel',
		link : function(scope, elem, attrs, control){
			var passwordChecker = function(){
				//get the value of the first password
                var password1 = scope.$eval(attrs.ngModel); 
                //get the value of the other password  
                var password2 = scope.$eval(attrs.passwordMatch);
                return password1 === password2;
			};
			scope.$watch(passwordChecker, function (n) {
                //set the form control to valid if both 
                //passwords are the same, else invalid
                control.$setValidity("passwordMatch", n);
            });
		}
	}	
}]);