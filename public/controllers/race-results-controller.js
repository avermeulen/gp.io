gpApp.controller("RaceResultsCtrl", function($scope, $http, predictionDataService) {
	"use strict";
	
  $scope.races = predictionDataService.races;
	$scope.drivers = predictionDataService.drivers;
  $scope.currentSelectedRace = null;
	$scope.retiredDrivers = [];
  
  $scope.submitRaceResults = function(){
    $http.post("./race-results", $scope.raceResults()).success(function(err, race){
      
    });
  }

  $scope.raceResults = function(){
    return {
      race : $scope.currentSelectedRace ? $scope.currentSelectedRace.name : "",
      grid : {
        first : $scope.grid1 ? $scope.grid1 : "",
        second : $scope.grid2 ? $scope.grid2 : ""
      },
      podium : {
         first : $scope.podium1 ? $scope.podium1 : "",
        second : $scope.podium2 ? $scope.podium2 : "",
        third  : $scope.podium3 ? $scope.podium3 : ""
      },
      retirees : $scope.retiredDriverNames()
    }; 
  };

  $scope.raceSelectionChanged = function(selectedRace){
      $scope.currentSelectedRace = selectedRace;

      /*
      
      */

      $http.get("./race-results/" + $scope.currentSelectedRace.name).success(function(raceResults){
        if (raceResults.grid && raceResults.podium){
          $scope.grid1 = raceResults.grid.first;
          $scope.grid2 = raceResults.grid.second;

          $scope.podium1 = raceResults.podium.first;
          $scope.podium2 = raceResults.podium.second;
          $scope.podium3 = raceResults.podium.third;

          $scope.retiredDrivers = raceResults.retirees;
        }
        else{
          $scope.grid1 = null;
          $scope.grid2 = null;
          $scope.podium1 = null;
          $scope.podium2 = null;
          $scope.podium3 = null;
          $scope.retiredDrivers = [];
        }
      });   
  };

 	$scope.retiredDriverNames = function(){
    //return _.pluck($scope.retiredDrivers, "driverName");
		return $scope.retiredDrivers;
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
      if (r)
        return driver === r;
      return false;
    });
  };
});