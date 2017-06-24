(function($, document, window){
	
	$(document).ready(function(){

      
        //$( ".movie-title" ).click(function(e) {
        	//e.preventDefault();
            //console.log($(".movie-title").attr("value"));
        	//var id = 1;
        	//$.get( "/single?id="+id, function( data ) {
               
              //});
         //});

		// Cloning main navigation for mobile menu
		$(".mobile-navigation").append($(".main-navigation .menu").clone());

		// Mobile menu toggle 
		$(".menu-toggle").click(function(){
			$(".mobile-navigation").slideToggle();
		});
		$(".search-form button").click(function(){
			$(this).toggleClass("active");
			var $parent = $(this).parent(".search-form");

			$parent.find("input").toggleClass("active").focus();
		});


		$(".slider").flexslider({
			controlNav: false,
			prevText:'<i class="fa fa-chevron-left"></i>',
			nextText:'<i class="fa fa-chevron-right"></i>',
		});
		if( $(".map").length ) {
			$('.map').gmap3({
				map: {
					options: {
						maxZoom: 14 
					}  
				},
				marker:{
					address: "40 Sibley St, Detroit",
				}
			},
			"autofit" );
	    	
	    }

	});

	$(window).load(function(){

	});

})(jQuery, document, window);