var 	express			= require("express"),
	app			= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	Campground 		= require("./models/campground"), //creating schema and importing model
	Comment			=require("./models/comment"),
	seedDB  		=require("./seed"),
	passport		=require("passport"),
	LocalStrategy		=require("passport-local"),
	passportLocalMongoose	= require("passport-local-mongoose"),
	User			= require("./models/user"),
	expressSession		= require("express-session");
	
var	campgroundRoutes	= require("./routes/campgrounds"),
	commentRoutes		= require("./routes/comments"),
	indexRoutes		= require("./routes/index");

mongoose.connect("mongodb://localhost/camp_app", { useNewUrlParser: true });


app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//PASSSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
app.use(expressSession({
	//used to encode and decode sessions
	secret:"I like cheese a lot",
	resave: false,
	saveUninitialized: false
}));
//responsible for taking data from the session and decoding it and then recoding it
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

/*middleware that will run for every route (whatever is put in res.locals is avalable in all our templates)*/
app.use(function(req, res, next){
//whatever is put in res.locals is available in our templates
	res.locals.currentUser = req.session.user;
	//req.session.user will return undefined even after authentication so below is workaround
	if(req.session.passport && req.session.passport.user !== undefined){
                res.locals.currentUser = req.session.passport.user;
        }
	//allow us to move on to next middleware, which will be route handler in most cases
	next();
});

// the routes have been required but this tells our app to use the routes
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

seedDB();

app.listen(3000, function(){
console.log("The Server is up and running")});
