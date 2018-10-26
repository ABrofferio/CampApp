$(document).ready(function () {
	$(".addComment").on("click", function(e){
		$.ajax({
		url: "/campgrounds/campground._id/comments/new",
		success: function(result) {
			if(result[1]=="d"){
			$(".callNewComment").html(result);
			}else{
			window.location.replace("/login")
			}
		}
});
	})
});
