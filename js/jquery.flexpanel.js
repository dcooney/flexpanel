/*
 * jQuery FlexPanel v1
 * https://github.com/dcooney/flexpanel
 *
 * Copyright 2013 Connekt Media - http://cnkt.ca/flexpanel
 * Free to use under the GPLv2 license.
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Author: Darren Cooney
 */

;(function($) {
	$.flexpanel = function(el, options){
	
		// default config properties		
		var defaults = {	
			panelBtn: '.flex-btn',
			screenBreak: 767, // Min screen width
			panelWidth: 80, //Percent width of the panel
			speed: 500, // Speed of the transition
			isIOS: ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false ),
		}; 
		
		
		var options = $.extend(defaults, options);  	
		var $flexpanel = $(el),
			$btn = $(options.panelBtn),
			$screenBreak = options.screenBreak;
			$panelWidth = options.panelWidth;
			$speed = options.speed;
			$isIOS = options.isIOS;			
			
		$flexpanel.append('<div class="cover"></div>');	
		//***********************************************
		// -- Open/Close mobile menu
		//***********************************************
		flexpanel.slideNav = function(e){
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
		//***********************************************
		// -- $btn click or tap
		//***********************************************
		if ($.fn.hammer && $isIOS){
			$btn.hammer().on("tap",function(event) {
				flexpanel.slideNav();
			});
		}else{
			$btn.click(function(event){
				flexpanel.slideNav();
			});
		}	
		
		//***********************************************
		// -- Swipe & Touch Events
		//***********************************************
		if ($.fn.hammer){//If jquery Hammer is running, use swipe!
			$('.cover').add($btn).hammer().on("swipe, drag",function(event) {
				if(event.gesture.direction === 'right' && $('body').hasClass('flexpanel-active')){
					flexpanel.slideNav();
				}
			});	
			$btn.hammer().on("swipe, drag",function(event) {
				if(event.gesture.direction === 'left' && !$('body').hasClass('flexpanel-active')){
					flexpanel.slideNav();
				}
			});
			//$('body').hammer({ drag_lock_to_axis: true }).on("release dragleft dragright swipeleft swiperight", handleHammer);
		}		
		
		//***********************************************
		// -- Add smooth scrolling to the .viewport div on transition end, otherwise the scrolling is jumpy in iOS
		//***********************************************
		$flexpanel.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function() {
			var $el = $('.viewport', $flexpanel);
			if($('body').hasClass('flexpanel-active') && !$el.hasClass('smooth')){
				$el.addClass('smooth');
			}else{	
				$el.removeClass('smooth');
			}
		});	
		
		//***********************************************
		// -- Function to set the height of the nav for overflow scrolling
		//***********************************************
		flexpanel.panelHeight = function(){
			if($(window).width() <= $screenBreak){
				if($isIOS){// If is iOS, add 60px to the window height to account for menubar.
					$flexpanel.css('height', $(window).height()+120+'px');
					$('.viewport', $flexpanel).css('height', $(window).height()+60+'px');
					$('.cover', $flexpanel).css('height', $(window).height()+60+'px');
				}else{		
					$flexpanel.css('height', $(window).height()+'px');
					$('.viewport', $flexpanel).css('height', $(window).height()+'px');
					$('.cover', $flexpanel).css('height', $(window).height()+'px');
				}
			}
		}
		flexpanel.panelHeight();
		$(window).resize(flexpanel.panelHeight);  
	
	};
	
	
	
	//Flexpanel, engage!
	$.fn.flexpanel = function(options){
		new $.flexpanel(this, options);
	}

})(jQuery);
