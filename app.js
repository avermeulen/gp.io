var express = require('express'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    _ = require('lodash'),
    LocalStrategy = require('passport-local').Strategy,
    UserService = require("./user-service"), 
    PredictionService = require("./prediction-service"),
    DriverService = require("./driver-service"),
    MongoClient = require("./mongo-client"),
    RaceResultsService = require("./race-results-service"), 
    ScoringService = require("./scoring-engine"),
    async = require("async"),
    url = process.env.GP_IO_MONGO_URL,
    mongoClient = new MongoClient(url, ["predictions", "users", "drivers", "race_results"]),
    userService = new UserService(mongoClient),
    predictionService = new PredictionService(mongoClient),
    driverService = new DriverService(mongoClient),
    raceResultsService = new RaceResultsService(mongoClient),
    scoringService = new ScoringService(raceResultsService, driverService, predictionService, userService),
    app = express();
//==================================================================
// Define the strategy to be used by PassportJS
passport.use(new LocalStrategy(
  function(username, password, done) {
    var status;
    async.waterfall([
      function(callback){
        userService.login({email : username, password: password}, callback, callback);    
      }],
      function(err, result, user){
        console.log(arguments);
        if (result === "login_success"){
          status = done(null, {name: username, user_id : user._id});
        }
        else{
          status = done(null, false, { message: 'Incorrect username.' });
        }
      });      
      return status
  }
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
  if (!req.isAuthenticated()) 
  	res.send(401);
  else
  	next();
};
//==================================================================

// Start express application

// all environments
app.set('port', process.env.PORT || 3000);
//app.set('views', __dirname + '/public');
//app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser()); 

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ 
    secret: 'die_BlouBulleWetie_vanVerloornie',
    cookie: { maxAge : 1800000 } // time out after 30 minutes
  }
));
app.use(passport.initialize()); // Add passport initialization
app.use(passport.session());    // Add passport initialization
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//==================================================================
// route to test if the user is logged in or not
app.get('/loggedin', function(req, res) {

  if (!req.isAuthenticated()){
    req.logOut();
    res.clearCookie("user");
  }

  res.send(req.isAuthenticated() ? req.user : '0');
});

// route to log in
app.post('/login', passport.authenticate('local'), 
  function(req, res) {
    res.cookie("user", JSON.stringify(req.user));
    res.send(req.user);
});

// route to log out
app.post('/logout', function(req, res){
  req.logOut();
  res.clearCookie("user");
  res.send(200);
});

// route to log in
app.post('/register', 
  function(req, res) { 
    var username = req.body.username,
        password = req.body.password,
        team = req.body.team;

    var userDetails = {email : username, password : password, team: team};
    userService.addUser(userDetails, 
      function(err, status, user){
        res.send({
          status : "success",
          username : username
        });
      }, 
      function(status){
        res.send({
          status : status,
          username : ""
        });
      });
});

app.get("/drivers", auth, function(req, res){
  driverService.allDrivers(function(err, drivers){
    res.send(drivers);
  });
});

app.post('/prediction', auth, function(req, res){
  predictionService.store(req.user, JSON.parse(req.body.prediction), 
    function(prediction){
      res.send({ response : "ok" });
    }, 
    function(err){
      res.send({response : "error", details : err});   
    })
});

app.get("/prediction-results", function(req, res){
  var group = driverService.findDriverGroup("Jenson Button");
  console.log(group + "=> group");
  res.send({});
});

app.get('/prediction/:race_name', auth, function(req, res){
    var queryDetails = {
      user_id : req.user.user_id, 
      name : req.params.race_name
    };
    predictionService.findPrediction(queryDetails, 
      function(err, prediction){
        if (err)
          res.send("no : " + err);
        else    
          res.send(prediction);
      }, 
      function(err){   
      });
});

app.get("/predictions/:race_name", auth, function(req, res){
  var queryDetails = {
      name : req.params.race_name
    };

  predictionService.findRacePredictions(queryDetails, function(err, predictions){
    if (err){
      res.send([]);
    }
    else{
      res.send(predictions);
    }
  });
});

app.get("/race-results/:race_name", auth, function(req, res){
  var queryDetails = {
      name : req.params.race_name
  };
  raceResultsService.find({race : req.params.race_name}, function(err, raceResults){
      raceResults = raceResults || {};
      res.send(raceResults);  
  });
});

app.post("/race-results", auth, function(req, res){
  var params = req.body,
      query = {race : params.race};

  raceResultsService.store(query, params, function(raceResult){
    console.log("done : " + raceResult);
  });
});

app.get("/scores/:race_name", auth, function(req, res){
    var raceName = req.params.race_name;
    scoringService.calculate(raceName, function(err, scores){
       res.send(scores);
    });
});

app.get("/scores", function(req, res){
  var raceResults = mongoClient.race_results.find({},{_id:0,race:1});
  raceResults.toArray(function(err, race_results){
    async.map(race_results, 
      function(race_result, done){
        var raceName = race_result.race;
        scoringService.calculate(raceName, function(err, scores){
          var vals = _.map(scores, function(score){
            return _.pick(score, 'user_name', 'totalPoints', 'pointsByCategory');
          })
          done(err, {
            raceName : raceName,
            scores : vals
          });
        });     
      },
      function(err, results){
        res.send(results);
      }
    )
    
  });

});

//==================================================================
mongoClient.connect(function(){
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
});

