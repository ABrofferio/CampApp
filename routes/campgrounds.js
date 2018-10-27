var	express		= require("express"),
	router		= express.Router(),
	Campground	= require("../models/campground");

//INDEX - show all campgrounds
router.get("/campgrounds", function(req, res){
console.log(req.user);
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
router.post("/campgrounds", isLoggedIn, function(req,res){
    var campName = req.body.campingSpotName;
    var campImage = req.body.campingSpotImage;
    var campDescription = req.body.campingSpotDescription;
		var campuUserId= req.session.passport.user._id;
		var campUserUsername = req.session.passport.user.username;
    var campSite = {user:{id:campuUserId, username:campUserUsername},campgroundName: campName, campgroundImage: campImage, campgroundDescription:campDescription}
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
router.get("/campgrounds/new", isLoggedIn, function(req,res){
    res.render("new");
});

//SHOW - display info for a specific campground
router.get("/campgrounds/:id", function(req, res){
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, campground){
        if(err){
            console.log(err)
        }else{
            res.render("show",{campground: campground})
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

module.exports = router;
