var express = require('express'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    users = {};

//==================================================================
// Define the strategy to be used by PassportJS
passport.use(new LocalStrategy(
  function(username, password, done) {
    //console.log("=> " + username + ":" + password);
    var userPassword = users[username];
    console.log(users);

    if (userPassword != undefined && userPassword === password){
      return done(null, {name: username});
    }
    return done(null, false, { message: 'Incorrect username.' });
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
  console.log("*** auth!!");
  if (!req.isAuthenticated()) 
  	res.send(401);
  else
  	next();
};
//==================================================================

// Start express application
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
//app.set('views', __dirname + '/public');
//app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser()); 
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'securedsession' }));
app.use(passport.initialize()); // Add passport initialization
app.use(passport.session());    // Add passport initialization
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//==================================================================
// routes
app.get('/', function(req, res){
  res.render('index.html');
});

app.get('/users', auth, function(req, res){
  res.send(users);
});
//==================================================================

//==================================================================
// route to test if the user is logged in or not
app.get('/loggedin', function(req, res) {
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

    console.log(req.body);
    console.log(username);
    console.log(password);

    users[username] = password;

    res.send({
      status : "success",
      username : username
    });
});

// route to log out
app.post('/logout', function(req, res){
  req.logOut();
  res.clearCookie("user");
  res.send(200);
});
//==================================================================

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});