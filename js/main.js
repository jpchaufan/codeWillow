

/* Image Viewer */

$("figure img").click(function(){
	var src = $(this).attr('src');
	var caption = $(this).siblings('figcaption').html();
	$('body').append("<div class='overlay'><img src='"+src+"' /><p>"+caption+"</p></div>");
	overlayOnClick();
});
function overlayOnClick(){
	$(".overlay").click(function(){
		$(".overlay").remove();
	});	
}

/* mobile nav */

$('.mobile_nav select').change(function(){
	window.location = $(this).val();
});

/* mobile app viewer */

$('.mobile_app_viewer').change(function(){
	$('[class^="view_apps_"]').hide();
	$('.view_apps_'+$(this).val()).show();
});
$(window).on('resize', function(){
	if(window.innerWidth > 740){
		$('[class^="view_apps_"]').removeAttr('style');
	}
});


