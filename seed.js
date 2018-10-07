var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var campData = [
    {
        campgroundName: "Cloud's Rest", 
        campgroundImage: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        campgroundDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        campgroundName: "Desert Mesa", 
        campgroundImage: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        campgroundDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        campgroundName: "Canyon Floor", 
        campgroundImage: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        campgroundDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB(){
   //Remove all campgrounds
	Campground.remove({}, function(err){
        	if(err){
			console.log(err);
		}
	});
	campData.forEach(function(dataItem){
	Campground.create(dataItem, function(err, campground){
		if(err){console.log(err)}
		else{
			Comment.create({
				author: "Bob Boberts",
				text:"I really liked this campsite and just wanted to express my feelings on the subject."
			},function(err,comment){
				if(err){console.log(error)}
				else{
					campground.comments.push(comment);
				}	
			});
			Comment.create({
                                author: "Bill Billiams",
                                text:"I enjoyed camping at this campsite and just wanted to express my delight at the cleanliness and views this campsite had to offer."
                        },function(err,comment){
                                if(err){console.log(error)}
                                else{
                                        campground.comments.push(comment);
                                        campground.save();
                                }
                        })			
		}	
	});
	});
 }
module.exports = seedDB;
