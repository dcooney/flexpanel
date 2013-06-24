/*
 * jQuery FlexPanel v1
 * https://github.com/dcooney/flexpanel
 *
 * Copyright 2013 Connekt Media - http://cnkt.ca/flexpanel
 * Free to use under the GPLv2 license.
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Author: Darren Cooney
 * Twitter: @KaptonKaos
 */

;(function($) {		
	
	$.flexpanel = function(el, options){
	
		// default config properties		
		var defaults = {
			direction: 'right', // Panel slides in from 'left', 'right' or 'top'.
			wrapper: '#wrapper', // Define the main content wrapper, this is important as it needs to slide.
			button: '.flex-btn', // Define the menu button(open/close).
			maxWidth: null, // Define a minimum screen width, this will help trigger FlexPanel functions.	
			//panelWidth: 80, // Coming soon - Percent width of the panel, default is 80%.
			speed: 500, // Speed of the transitions.
		}; 		
		var options = $.extend(defaults, options);  	
		
		//Create vars
		var $flexpanel = $(el),
			$direction = options.direction,
			$wrapper = $(options.wrapper),
			$btn = $(options.button),
			$maxWidth = options.maxWidth;
			$panelWidth = options.panelWidth;
			$speed = options.speed; 
			$isIOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
		
		//***********************************************
		// -- Open/Close FlexPanel
		//***********************************************
		var SlidePanel = function(e){
			if($('body').hasClass('flexpanel-active')){			
				$('.viewport').animate({scrollTop: 0}, 500);
				$('body').removeClass('flexpanel-active');
				$('body').unbind('touchmove');
			}else{
				$('body').addClass('flexpanel-active');	
				//Disable body scrolling when nav is active
				$('body').bind('touchmove', function(e){
					if($('.viewport nav', $flexpanel).height() < $(window).height()){
						e.preventDefault();
					}
					if (!$(e.target).parents('.viewport')[0]) {
				        e.preventDefault();
				    }
				});			
			}
		}	
		//***********************************************
		// -- $btn click and anchor navigation
		//***********************************************
		
		//Menu Btn click
		$btn.click(SlidePanel);
				
		//Url with anchors
		$('nav ul li a', $flexpanel).click(function(){
			var $el = $(this);
			var $target = $el.attr('href');
			if($el.hasClass('anchor')){
				SlidePanel();
				var target_offset = $($target).offset();
				var target_top = target_offset.top;
				$('html, body').animate({scrollTop:target_top}, $speed);
			}
		})
		
		//***********************************************
		// -- Swipe & Touch Events
		//***********************************************
		var HammerEvents = function(e){
			if ($.fn.hammer){//If jquery Hammer is running, use swipe!
				$($wrapper).add($btn).hammer().on("swipe, drag",function(event) {
					switch($direction){
						case 'right':
						if(event.gesture.direction === 'right' && $('body').hasClass('flexpanel-active')){
							SlidePanel();
						}
						break;						
						case 'left':
						if(event.gesture.direction === 'left' && $('body').hasClass('flexpanel-active')){
							SlidePanel();
						}
						break;
					}					
				});	
				$btn.hammer().on("swipe, drag",function(event) {
					switch($direction){
						case 'right':
						if(event.gesture.direction === 'left' && !$('body').hasClass('flexpanel-active')){
							SlidePanel();
						}
						break;						
						case 'left':
						if(event.gesture.direction === 'right' && !$('body').hasClass('flexpanel-active')){
							SlidePanel();
						}
						break;
					}					
				});
				
				//Function to determine scroll direction to show/hide nav
				$('body').hammer().on("dragdown",function(event) {
					//Determine if the user is attempting to scroll to top by deltaTime
					if(event.gesture.deltaTime > 50){
			        	$btn.addClass('in-view');
			        }
				});  
				
				$('body').hammer().on("dragup",function(event) {
					//Determine if the user is attempting to scroll to top by timing the drag time
					var $top = $(window).scrollTop();
					if(event.gesture.deltaTime > 50 && $top > 100){
			        	$btn.removeClass('in-view');
			        }
				});	
				
				//Lets add drag_lock to the panel. Coming soon
				//$('body').hammer({ drag_lock_to_axis: true }).on("release dragleft dragright swipeleft swiperight", handleHammer);
			}	
		}	
		
		//***********************************************
		// -- Add smooth scrolling to the .viewport div 
		//    on transition end, otherwise the scrolling 
		//    is jumpy in iOS
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
		// -- Function to set the height of the nav for 
		//    overflow scrolling
		//***********************************************
		var panelHeight = function(){
			if($isIOS){// If is iOS, add 60px to the window height to account for menubar.
				$flexpanel.css('height', $(window).height()+60+'px');
				$('.viewport', $flexpanel).css('height', $(window).height()+60+'px');
				$('.cover', $flexpanel).css('height', $(window).height()+60+'px');
			}else{		
				$flexpanel.css('height', $(window).height()+'px');
				$('.viewport', $flexpanel).css('height', $(window).height()+'px');
				$('.cover', $flexpanel).css('height', $(window).height()+'px');
			}
		}
		
		
		//***********************************************
		// -- Window Resize Events
		//***********************************************
		$(window).resize(function(){
			$w = $(window).width();
			//If screen width has not been defined
			if($maxWidth === null){
				$(window).resize(panelHeight); 
			}else{
				if($w <= $maxWidth){//If window is less than maxWidth
					$(window).resize(panelHeight); 
				}
			}
		});
		//***********************************************
		// -- Window Scroll Events
		//***********************************************
		$(window).scroll(function(){
			var $top = $(window).scrollTop();
			if($top < 100){ // Show $btn based on scrollTop val.
				$btn.addClass('in-view');	
			}	
		});
		
		
		//***********************************************
		// -- FlexPanel Init Functions
		//***********************************************
		var Init = function(){
			$('body').addClass('flexpanel-'+$direction);
			$flexpanel.show(); //Display FLexPanel
			$btn.addClass('in-view');
			if($maxWidth === null || $w <= $maxWidth){
				panelHeight(); 
			}
			HammerEvents();
		}
		Init();
		
		
		//***********************************************
		//Public Functions
		//***********************************************
		$.fn.flexpanel.toggle=function(){
			SlidePanel();
		}
	
	
	}
	//***********************************************
	// Create FLexPanel Object
	//***********************************************
	$.fn.flexpanel = function(options){
		new $.flexpanel(this, options);
	}
	
	
	

})(jQuery);
