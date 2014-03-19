var express = require('express'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    UserService = require("./user-service"), 
    PredictionService = require("prediction-service"),
    MongoClient = require("mongo-client"),
    async = require("async"),
    PredictionRoutes = require("./routes/prediction-routes"),
    url = process.env.GP_IO_MONGO_URL,
    mongoClient = new MongoClient(url, ["predictions", "users"]),
    userService = new UserService(mongoClient),
    predictionService = new PredictionService(mongoClient),
    //predictionRoutes = new PredictionRoutes(mongoClient),
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
app.use(express.session({ secret: 'die_BlouBulleWetie_vanVerloornie' }));
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

// route to log in
app.post('/register', 
  function(req, res) { 
    var username = req.body.username,
        password = req.body.password;

    var userDetails = {email : username, password : password};
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

app.post('/prediction', auth, function(req, res){
  predictionService.store(req.user, JSON.parse(req.body.prediction), 
    function(prediction){
      res.send({ response : "ok" });
    }, 
    function(err){
      res.send({response : "error", details : err});   
    })
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

// route to log out
app.post('/logout', function(req, res){
  req.logOut();
  res.clearCookie("user");
  res.send(200);
});
//==================================================================
mongoClient.connect(function(){
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
});

