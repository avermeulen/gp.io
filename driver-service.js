var async = require("async");

var DriverService = function(mongoClient){
	this.mongoClient = mongoClient;	
};

DriverService.prototype.allDrivers = function(callback) {
	this.mongoClient.drivers.find({}).toArray(callback);
};

DriverService.prototype.findDriverByName = function(driverName, cb) {
	this.mongoClient.drivers.findOne({ driverName : driverName }, cb);
};

DriverService.prototype.findDriverGroup = function(driverName){
	var self = this;
	var driverGroup = null;
	var d = async.waterfall(
		[function(callback){
			self.findDriverByName(driverName, callback);
		},
		function(driver, callback){
			callback(null, driver.group)
		}],
		function(err, group){
			if (!err)
				driverGroup = "";
			else{
				driverGroup = group;
				console.log(driverGroup)
			}
		}
	);
	//console.log(d);

	async.until(function(){ return driverGroup !== null}, function(){
		console.log("done!");
	}, function(){});

	return driverGroup;
}

module.exports = DriverService;