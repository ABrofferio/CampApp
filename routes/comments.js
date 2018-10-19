var	express		= require("express"),
	router  	= express.Router(),
	Campground	= require("../models/campground"),
	Comment		= require("../models/comment");

//Nested NEW - show form to create new comment
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
	res.send('<div><form action="/campgrounds/'+req.params.id+'/comments" method="POST"><input type="text" class="form-control" name="comment[author]" placeholder="Enter your name"><input type="text" class="form-control newCampFormInput" name="comment[text]" placeholder="Enter your comment"><input type="submit" class="btn btn-dark btn-block newCampFormInput"></form></div>');
});

//Nested CREATE -submit create form to create new comment
router.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
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

module.exports = router;
