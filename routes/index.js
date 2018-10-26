var	express		= require("express"),
	router		= express.Router();
	User 		= require("../models/user"),
	passport	= require("passport");

router.get("/", function(req, res){
res.redirect("/campgrounds");
});

router.get("/secret", isLoggedIn, function(req, res){
console.log("req.user",req.user);
console.log("req.session.user", req.session.user)
console.log("req.session.passport.user",req.session.passport.user);
res.render("Secret");
});

//-----------------
//AUTH ROUTES
//-----------------
router.get("/signup", function(req, res){
	res.render("signup");
});
router.post("/signup", function(req, res){
	//create user without password and then takes password as argument as hashes it to save to db
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
		console.log(err);
		return res.render('register');
		}else{
		//this will log the user in
		passport.authenticate("local")(req, res, function(){
		res.redirect("/secret");
		});
		}
	});
});

router.get("/login", function(req, res){
	res.render("login");
});
/*middleware is code that runs before final callback which is what is happening with our passport.authenticate()*/
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){
});

router.get("/logout", function(req, res){
	/*passport destroying the user data in session (no longer keeping track of user data in session from request to request*/
	req.session.destroy();
	res.redirect("/");
});


//middleware for checking if a user is logged in or not (always takes 3 params: req, res, next)
function isLoggedIn(req, res, next){
	if(req.session.passport && req.session.passport.user !== undefined){
		return next();
	}
	res.redirect("/login");
}


module.exports = router;
