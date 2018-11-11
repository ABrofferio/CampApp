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
		req.body.campingSpotName = req.sanitize(req.body.campingSpotName);
		req.body.campingSpotDescription = req.sanitize(req.body.campingSpotDescription);
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

//EDIT - Show form to edit campground
router.get("/campgrounds/:id/edit", checkCampgroundCreator, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("edit", {campground,campground});
		}
	})
});

//UPDATE - Update campground in the database
router.put("/campgrounds/:id", checkCampgroundCreator, function(req, res){
	req.body.newCampground.campgroundName = req.sanitize(req.body.newCampground.campgroundName);
	req.body.newCampground.campgroundDescription = req.sanitize(req.body.newCampground.campgroundDescription);
	Campground.findOneAndUpdate({_id:req.params.id}, {$set:req.body.newCampground}, {new: true}, function(err, newCampground){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

//DESTROY - Delete a campground in the database
router.delete("/campgrounds/:id", checkCampgroundCreator, function(req, res){
	Campground.findOneAndDelete({_id:req.params.id}, function(err, deletedCampground){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds/");
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

//middleware for checking if the user logged in is the user who created campground
function checkCampgroundCreator(req, res, next){
        if(req.session.passport && req.session.passport.user !== undefined){
                Campground.findById(req.params.id, function(err, campground){
									if(err){
										res.redirect("back");
									}else{
										if(campground.user.id.equals(req.session.passport.user._id)){
											next();
										}else{
											return res.redirect("back")
										}
									}
								})
        }else{
					res.redirect("back");
				}

}

module.exports = router;
