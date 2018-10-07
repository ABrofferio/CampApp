var mongoose = require("mongoose");
var campgroundSchema = new mongoose.Schema({
	campgroundName: String,
	campgroundImage: String,
	campgroundDescription: String,
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

module.exports = mongoose.model("Campground", campgroundSchema);
