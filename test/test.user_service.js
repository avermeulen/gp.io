var assert = require("assert"),
	MongoClient = require('../mongo-client'),
	UserService = require("../user-service")
	async = require("async");

describe("UserService", function(){
  var url = "mongodb://127.0.0.1:27017/gp_io",
      mongoClient = new MongoClient(url, ["users"]),
      userService = null;

  before(function(done){
    mongoClient.connect(function(){
      mongoClient.users.remove({email : "test@email.com"}, function(){});
      userService = new UserService(mongoClient);
      done();
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
});