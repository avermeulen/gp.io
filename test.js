var UserService = require("./user-service"),
	userService = new UserService("mongodb://127.0.0.1:27017/gp_io");


/*
users.addUser({email:'andre.vermeulen@gmail.com', password : 'pass'}, 
	function (status, user) {
		console.log(status);
		console.log(user);
	},
	function (status, err) {
		console.log(status);
		console.log(err);
});
*/


userService.login({email:'andre.vermeulen@gmail.com', password : 'pass1'}, 
	function (status, user) {
		console.log(status);
		console.log(user);
	},
	function (status, err) {
		console.log(status);
		console.log(err);
});
