var MongoClient = require('mongodb').MongoClient;

var UserServices = function(mongoClient){
	this.mongoClient = mongoClient;	
};

UserServices.prototype.login = function(loginDetails, success, error){

	var users = this.mongoClient.users;
	users.findOne({email : loginDetails.email.toLowerCase()}, 
		function(err, user){
			if(err){
				error(err, "login_error");		
			}
			else{
				if (loginDetails.password === user.password)
					success(null, "login_success", user);
				else
					success(null, "login_failed", {});
			}
		});
};

UserServices.prototype.addUser = function(user, success, error){
	var self = this;
	var users = this.mongoClient.users;
	
	user.email = user.email.toLowerCase();
	
	var addUser = function(){
		users.insert(user, function(err, docs){
			err ? error("error", err) : success(null, "success", user);
		});
	};

	users.findOne({email : user.email.toLowerCase()}, function(err, user){
		if(err)
			error(err, "login_error");		
		else
			user === null ? addUser() : error("username_already_exists");
	});
};

module.exports = UserServices;