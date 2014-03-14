var MongoClient = require('mongodb').MongoClient;

var UserServices = function(mongoUrl){
	var self = this;
	self.mongoUrl = mongoUrl;	
};

UserServices.prototype.mongoClient = function(mongoAction){
	MongoClient.connect(this.mongoUrl, mongoAction);
};

UserServices.prototype.login = function(loginDetails, success, error){
	var userLogin = function(err, db){
		var users = db.collection("users");
		users.findOne({email : loginDetails.email}, function(err, user){
			if(err){
				error(err, "login_error");		
			}
			else{
				if (loginDetails.password === user.password)
					success(null, "login_success", user);
				else
					success(null, "login_failed", {});
			}
			db.close();
		});
	};
	this.mongoClient(userLogin);
};

UserServices.prototype.addUser = function(user, success, error){
	var self = this;
	var findUser = function(err, db) {
		var users = db.collection("users");
		users.findOne({email : user.email}, function(err, user){
			if(err)
				error(err, "login_error");		
			else
				user === null ? self.mongoClient(addUser) : error("username_already_exists");
			db.close();
		});
	};

	var addUser = function(err, db) {
		var users = db.collection("users");
		users.insert(user, function(err, docs){
			err ? error("error", err) : success(null, "success", user);
			db.close();
		});
	};
	this.mongoClient(findUser);
};

module.exports = UserServices;