var mongoose = require("mongoose");
var campgroundSchema = new mongoose.Schema({
	user: {
		id:{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
		},
		username: String
	},
	campgroundName: String,
	campgroundImage: String,
	campgroundDescription: String,
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

module.exports = mongoose.model("Campground", campgroundSchema);
