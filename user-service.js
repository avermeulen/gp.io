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
	
	var addUserFunc = function(){
		users.insert(user, function(err, docs){
			err ? error(err, "error") : success(null, "success", user);
		});
	};

	users.findOne({email : user.email.toLowerCase()}, function(err, theUser){
		if(err)
			error(err, "login_error");		
		else
			theUser === null ? addUserFunc() : error("username_already_exists");
	});
};

UserServices.prototype.allUsers = function(callback){
	var users = this.mongoClient.users;
	var usernames = users.find({}, {email:1}).toArray(function(err, users){
		callback(null, users);
	});
};

UserServices.prototype.findUserById = function(id, callback){
	this.mongoClient.findById("users", id, callback);
};

module.exports = UserServices;