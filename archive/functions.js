/*
 * jQuery FlexPanel v1
 * https://github.com/dcooney/flexpanel
 *
 * Copyright 2013 Connekt Media - http://cnkt.ca
 * Free to use under the GPLv2 license.
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Author: Darren Cooney
 */


var _options = {
	global: { 
		'speed': 500,
		'break': 1200,
	}
}


isIOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
//***********************************************
// MOBILE NAV
//***********************************************

flexpanel.mobileNavInit = function(e){
	$('#flexpanel').append('<div class="cover"></div>');
	var $btn = $('.flex-btn');		
	//Open/Close mobile menu
	mobileNav = function(e){
		if($('body').hasClass('flexpanel-active')){			
			$('.viewport').animate({scrollTop: 0}, 500);
			$('body').removeClass('flexpanel-active');
			$('body').unbind('touchmove');
		}else{
			$('body').addClass('flexpanel-active');	
			//Disable body scrolling when nav is active
			$('body').bind('touchmove', function(e){
				if (!$(e.target).parents('.scrollable')[0]) {
			        e.preventDefault();
			    }
			});			
		}
	}
	//Button click or tap
	if ($.fn.hammer && isIOS){
		$btn.hammer().on("tap",function(event) {
			mobileNav();
		});
	}else{
		$($btn).click(function(event){
			mobileNav(event);
		});
	}	
	
	//Add smooth scrolling to div on transition end.
	$('#flexpanel').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function() {		
		if($('body').hasClass('flexpanel-active') && !$('.viewport').hasClass('smooth')){
			$('.viewport').addClass('smooth');
		}else{	
			$('.viewport').removeClass('smooth');
		}
	});	
}
flexpanel.mobileNavInit(null);

//Function to set the height of the nav for overflow scrolling
flexpanel.navHeight = function(){
	if($(window).width() <= _options.global.break){
		var $nav  = $('#flexpanel');
		if(isIOS){
			$($nav).css('height', $(window).height()+120+'px');
			$('.viewport', $nav).css('height', $(window).height()+60+'px');
			$('.cover', $nav).css('height', $(window).height()+60+'px');
			
			//alert("smooth");
		}else{		
			$($nav).css('height', $(window).height()+'px');
			$('.viewport', $nav).css('height', $(window).height()+'px');
			$('.cover', $nav).css('height', $(window).height()+'px');
		}
	}
}
flexpanel.navHeight();
$(window).resize(flexpanel.navHeight);  


	
//***********************************************
// SWIPE / TOUCH EVENTS
//***********************************************
if ($.fn.hammer){//If jquery Hammer is running, use swipe!
	var $btn = $('.flex-btn');			
	$('.cover').add($btn).hammer().on("swipe, drag",function(event) {
		if(event.gesture.direction === 'right' && $('body').hasClass('flexpanel-active')){
			mobileNav();
		}
	});	
	$btn.hammer().on("swipe, drag",function(event) {
		if(event.gesture.direction === 'left' && !$('body').hasClass('flexpanel-active')){
			mobileNav();
		}
	});
	//$('body').hammer({ drag_lock_to_axis: true }).on("release dragleft dragright swipeleft swiperight", handleHammer);
}
