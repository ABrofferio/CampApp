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

seedDB();

//=================
//ROUTES
//=================

app.get("/", function(req, res){
res.redirect("/campgrounds");
});

app.get("/secret", isLoggedIn, function(req, res){
res.render("Secret");
});

//-----------------
//AUTH ROUTES
//-----------------
app.get("/signup", function(req, res){
	res.render("signup");
});
app.post("/signup", function(req, res){
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

app.get("/login", function(req, res){
	res.render("login");
});
/*middleware is code that runs before final callback which is what is happening with our passport.authenticate()*/
app.post("/login", passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "/login"
}), function(req, res){
});

app.get("/logout", function(req, res){
	/*passport destroying the user data in session (no longer keeping track of user data in session from request to request*/
	req.session.destroy();
	res.redirect("/");
});

//----------------
//RESTful CRUD ROUTES
//----------------

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
//get campgrounds out of db to display
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("index", {campgrounds: campgrounds});
        }
    });
});

//CREATE - add new campground to db
app.post("/campgrounds", function(req,res){
    var campName = req.body.campingSpotName;
    var campImage = req.body.campingSpotImage;
    var campDescription = req.body.campingSpotDescription;
    var campSite = {campgroundName: campName, campgroundImage: campImage, campgroundDescription:campDescription}
    Campground.create( campSite, function(err, campground)
        {
            if(err){
                console.log(err)
            } else{
                res.redirect("/campgrounds");
            }
        })
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req,res){
    res.render("new");
});

//SHOW - display info for a specific campground
app.get("/campgrounds/:id", function(req, res){
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, campground){
        if(err){
            console.log(err)
        }else{
            res.render("show",{campground: campground})
        }
    })
});

//-----------------
//RESTful NESTED CRUD ROUTES
//-----------------

//Nested NEW - show form to create new comment
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
	res.send('<div><form action="/campgrounds/'+req.params.id+'/comments" method="POST"><input type="text" class="form-control" name="comment[author]" placeholder="Enter your name"><input type="text" class="form-control newCampFormInput" name="comment[text]" placeholder="Enter your comment"><input type="submit" class="btn btn-dark btn-block newCampFormInput"></form></div>');
});

//Nested CREATE -submit create form to create new comment
app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
	Comment.create(req.body.comment, function(err, newComment){
		if(err){
			console.log(err)
		}else{ 
			Campground.update({_id:req.params.id},
			{$push:{comments:{$each:[newComment]}}}, function(err, updatedCamp){
				if(err){
					console.log(err)
				}else{
					res.redirect("/campgrounds/"+req.params.id)	
				}		
			})	
		}
	})
});

//middleware for checking if a user is logged in or not (always takes 3 params: req, res, next)
function isLoggedIn(req, res, next){
	if(req.session.passport && req.session.passport.user !== undefined){
		return next();
	}
	res.redirect("/login");
}



app.listen(3000, function(){
console.log("The Server is up and running")});
