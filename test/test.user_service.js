var assert = require("assert"),
	MongoClient = require('../mongo-client'),
	UserService = require("../user-service")
	async = require("async");

describe("UserService", function(){
  var url = "mongodb://127.0.0.1:27017/gp_io",
      mongoClient = new MongoClient(url, ["users"]),
      userService = null;

  beforeEach(function(done){
    //var d = done;
    mongoClient.connect(function(){
        mongoClient.users.remove({email : "test@email.com"}, function(err){
          if (err) done(err);

          userService = new UserService(mongoClient);
          done();
        });
    });

  });

  describe("addUser and Login", function(){
    it("should create user", function(done){
      	var userDetails = {email : "test@email.com", password : "pass"};
        async.waterfall([
        	function(callback){
            	userService.addUser(userDetails, 
        				 function(){
                    console.log("...")
                  },
        				 function(){
                  console.log("444")
                  });
            },
            /*
            function(status, user, callback){
            	userService.login(userDetails, 
            		callback, 
            		callback);
            }
            */
        ],
        function(err, result){
            assert.equal(err, null, err);

            assert.equal("login_success", result);
            done();
        });
    });
  });

  describe("addUser and Login with uppercase user name", function(){
    it("should create user", function(done){
        var userDetails = {email : "test@email.com", password : "pass"};
        async.waterfall([
          function(callback){
              userService.addUser(userDetails, 
                 callback,
                 callback);
            },
            function(status, user, callback){
              userService.login({ email : "Test@email.com", password : "pass" }, 
                callback, 
                callback);
            },
        ],
        function(err, result){
          console.log("arguments : " + arguments);

          assert.equal(err, null, err);
          assert.equal("login_success", result);
          //setTimeout(done, 250);
        });
    });
  });

  describe("addUser with uppercase test and Login with lower user name", function(){
    it("should create user", function(done){
        var userDetails = {email : "TEST@email.com", password : "pass"};
        async.waterfall([
          function(callback){
              userService.addUser(userDetails, 
                 callback,
                 callback);
            },
            function(status, user, callback){
              userService.login({ email : "test@email.com", password : "pass" }, 
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
            assert.equal("username_already_exists", status);
            done();
        });
    });
  });
});