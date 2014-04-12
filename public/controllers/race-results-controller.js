gpApp.controller("RaceResultsCtrl", function($scope, $http, predictionDataService) {
	"use strict";
	
  $scope.races = predictionDataService.races;
	$scope.drivers = predictionDataService.drivers;

	$scope.retiredDrivers = [];
  
 	$scope.retiredDriverNames = function(){
		return _.pluck($scope.retiredDrivers, "driverName");
	};
  
  $scope.podiumDrivers = function(){
      return [$scope.podium1, $scope.podium2, $scope.podium3];
  };           
 
 $scope.driversOnGrid = function(){
   return [$scope.grid1, $scope.grid2];  
 };            
              
 $scope.driversAvaialbleForGrid = function(){
     return _.difference($scope.drivers, $scope.driversOnGrid());
 };
 
 $scope.driversAvaialbleForPodium = function(){
     return _.difference($scope.driversThatAreNotRetired(), $scope.podiumDrivers());
 };             
              
              
 $scope.clear = function(val){
   $scope[val] = null;
 };             
 
 $scope.driversThatAreNotRetired = function(){
     return _.difference($scope.drivers, $scope.retiredDrivers);  
 };
 
           
              
 $scope.driversThatCanRetired = function(){
     return _.difference($scope.driversThatAreNotRetired(), $scope.podiumDrivers());  
 };
              
  $scope.retire = function(r){
    console.log($scope.retired);
    $scope.retiredDrivers.push(r);
  };
  
  $scope.unretire = function(r){
    _.remove($scope.retiredDrivers, function(driver){
      if (r.driverName)
        return driver.driverName === r.driverName;
      return false;
    });
  };
});