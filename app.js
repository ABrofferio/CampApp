var express = require("express"),
	app		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	Campground 	= require("./models/campground"), //creating the schema and importing the model
	Comment		=require("./models/comment"),
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

//Nested NEW - show form to create new comment
app.get("/campgrounds/:id/comments/new", function(req,res){
	res.send('<div><form action="/campgrounds/'+req.params.id+'/comments" method="POST"><input type="text" class="form-control" name="comment[author]" placeholder="Enter your name"><input type="text" class="form-control newCampFormInput" name="comment[text]" placeholder="Enter your comment"><input type="submit" class="btn btn-dark btn-block newCampFormInput"></form></div>');
i});

//Nested CREATE -submit create form to create new comment
app.post("/campgrounds/:id/comments", function(req,res){
	Comment.create(req.body.comment, function(err, newComment){
		if(err){
			console.log(err)
		}else{ 
			Campground.update({_id:req.params.id},
			{$push:{comments:{$each:[newComment]}}}, function(err, updatedCamp){
				if(err){
					console.log(err)
				}else{
					res.redirect("/campgrounds/:id")	
				}		
			})	
		}
	})
});

app.listen(3000, function(){
console.log("The Server is up and running")});
