var express = require("express"),
	app		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	Campground 	= require("./models/campground"), //creating the schema and importing the model
	seedDB  	=require("./seed");

seedDB();

mongoose.connect("mongodb://localhost/camp_app", { useNewUrlParser: true });


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//ROUTES
app.get("/", function(req, res){
res.redirect("/campgrounds");
});

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

app.listen(3000, function(){
console.log("The Server is up and running")});
