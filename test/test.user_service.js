var assert = require("assert"),
	MongoClient = require('mongodb').MongoClient,
	UserService = require("../user-service")
	async = require("async");

describe("UserService", function(){
  var 	url = "mongodb://127.0.0.1:27017/gp_io",
  		userService = new UserService(url);

  before(function(){
    MongoClient.connect(url, function(err, db){
      var  users = db.collection("users");
		  users.remove({email : "test@email.com"}, function(){});
    });
  });

  describe("addUser and Login", function(){
    it("should create user", function(done){
      	var userDetails = {email : "test@email.com", password : "pass"};
        async.waterfall([
        	function(callback){
            	userService.addUser(userDetails, 
        				 callback,
        				 callback);
            },
            function(status, user, callback){
            	userService.login(userDetails, 
            		callback, 
            		callback);
            },
        ],
        function(err, result){
            assert.equal(err, null, err);

            assert.equal("login_success", result);
            done();
        });
    });
  });

  describe("addUser that already exists", function(){
    it("should create user", function(done){
        var userDetails = {email : "test@email.com", password : "pass"};
        async.waterfall([
          function(callback){
              userService.addUser(userDetails, 
                 callback,
                 callback);
            },
            function(status, user, callback){
              userService.addUser(userDetails, 
                 callback,
                 callback);
            },
        ],
        function(status){
            //assert.equal(status, null, status);
          
            assert.equal("username_already_exists", status);
            done();
        });
    });
  });

  /*
  describe("login", function(done){
    // Add your setup and assertions here
    userService.login({email : "test@email.com", password : "pass"}, 
    	function(status){
   			setTimeout(done, 500);
    		assert.equal("login_success", status);
    	},
    	function(){
    		assert.ok(1==2)
    	});
  });
*/

});