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
	var addUser = function(err, db) {
		var users = db.collection("users");
		users.insert(user, function(err, docs)
		{
			if(err){
				error("error", err);		
			}
			else{
				success(null, "success", user);
			}
			db.close();
		});
	};	
	this.mongoClient(addUser);
};

module.exports = UserServices;
