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

(function($) {
    $.flexpanel = function(el, options) {
        var defaults = {
            direction: 'right', // Panel slides in from 'left', 'right' or 'top'.
            wrapper: '#wrapper', // Define the main content wrapper, this is important as it needs to slide.
            button: '.flex-btn', // Define the menu button(open/close).
            maxWidth: null, // Define a minimum screen width, this will help trigger FlexPanel functions.
            //panelWidth: 80, // Coming soon - Percent width of the panel, default is 80%.
            speed: 500 // Speed of the transitions.
        }	
		var options = $.extend(defaults, options);
		//Create vars
		var $flexpanel = $(el),
			$direction = options.direction,
			$wrapper = $(options.wrapper),
			$btn = $(options.button),
			$maxWidth = options.maxWidth;
			//$panelWidth = options.panelWidth,
			$speed = options.speed,
			$isMobile = ('ontouchstart' in window);//( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );	
		
		var methods = {
            init: function() {
                //***********************************************
                // -- FlexPanel Init Functions
                //***********************************************
                $('body').addClass('flexpanel-'+$direction);
    			$flexpanel.append('<div class="cover"/>'); // Add .cover div
    			$flexpanel.show(); //Display FlexPanel
    			$btn.addClass('in-view');
    			if($maxWidth === null || $w <= $maxWidth){
    				methods.height(); 
    			}
    			if ($.fn.hammer){// If hammer.js is running
    			    methods.touch();
    			}
            },   
            slide: function(e){                
                //***********************************************
                // -- Open/Close FlexPanel
                //***********************************************
                switch(e){
                    case 'open':
                        $('body').addClass('flexpanel-active');	
                        $(document).on('touchmove',function(e){
						  e.preventDefault();
						});
                    break;
                    case 'close':
                        $('.viewport', $flexpanel).animate({scrollTop: 0}, 500);
                        $('body').removeClass('flexpanel-active'); 
                        $(document).on('touchmove',function(e){
							  return true;
							});               
                    break;
                    default: 
                        if($('body').hasClass('flexpanel-active')){			
            				$('.viewport', $flexpanel).animate({scrollTop: 0}, 500);
            				$('body').removeClass('flexpanel-active');
            				$(document).on('touchmove',function(e){
							  return true;
							});  
            			}else{
            				$('body').addClass('flexpanel-active');	           				         						
            			}                    
                }    			
            },
            touch: function(){
                //***********************************************
                // -- Swipe & Touch Events
                //***********************************************
				$('.cover').add($btn).hammer().on("swipe, drag",function(event) {
					switch($direction){
						case 'right':
						if(event.gesture.direction === 'right' && $('body').hasClass('flexpanel-active')){
							methods.slide();
						}
						break;						
						case 'left':
						if(event.gesture.direction === 'left' && $('body').hasClass('flexpanel-active')){
							methods.slide();
						}
						break;
					}					
				});	
				$wrapper.add($btn).hammer().on("swipe, drag",function(event) {
					//$wrapper and $btn swipe events
					switch($direction){
						case 'right':
						if(event.gesture.direction === 'left' && !$('body').hasClass('flexpanel-active')){
							methods.slide();
						}
						break;						
						case 'left':
						if(event.gesture.direction === 'right' && !$('body').hasClass('flexpanel-active')){
							methods.slide();
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
            },
            height: function(){
                //***********************************************
        		// -- Function to set the height of the nav for 
        		//    overflow scrolling
        		//***********************************************
        		
                if($isMobile){// If is iOS, add 60px to the window height to account for menubar.
    				$flexpanel.css('height', $(window).height()+60+'px');
    				$('.viewport', $flexpanel).css('height', $(window).height()+60+'px');
    				$('.cover', $flexpanel).css('height', $(window).height()+60+'px');
    			}else{		
    				$flexpanel.css('height', $(window).height()+'px');
    				$('.viewport', $flexpanel).css('height', $(window).height()+'px');
    				$('.cover', $flexpanel).css('height', $(window).height()+'px');
    			}
            }
        }
		methods.init();
			
			
			
		//***********************************************
		// --  Allow scrolling for .viewport div only.
		//***********************************************
		
		$(document).on('touchmove',function(e){
			if($('body').hasClass('flexpanel-active')){
				e.preventDefault();
			}
		}); 
		
		$('body').on('touchstart','.viewport',function(e) {
			if (e.currentTarget.scrollTop === 0) {
				e.currentTarget.scrollTop = 1;
			} else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
				e.currentTarget.scrollTop -= 1;
			}
		});
		//***********************************************
		// -- prevents preventDefault from being called 
		//    on document if it sees a scrollable div
		//***********************************************
		$('body').on('touchmove','.viewport',function(e) {
			e.stopPropagation();
		});


		
		//***********************************************
		// -- $btn click and anchor navigation
		//***********************************************		
		//Menu Btn click
		$btn.click(methods.slide);
			
		//Url with anchors
		$('nav ul li a', $flexpanel).click(function(){
			var $el = $(this);
			var $target = $el.attr('href');
			if($el.hasClass('anchor')){
				methods.slide();
				var target_offset = $($target).offset();
				var target_top = target_offset.top;
				$('html, body').animate({scrollTop:target_top}, $speed);
			}
		});		
		
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
		// -- Window Resize Events
		//***********************************************
		$(window).resize(function(){
			$w = $(window).width();
			//If screen width has not been defined
			if($maxWidth === null){
				$(window).resize(methods.height); 
			}else{
				if($w <= $maxWidth){//If window is less than maxWidth
					$(window).resize(methods.height); 
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
		//Public Functions
		//***********************************************
		$.fn.flexpanel.toggle=function(){
			methods.slide();
		}
		$.fn.flexpanel.open=function(){
			methods.slide('open');
		}
		$.fn.flexpanel.close=function(){
			methods.slide('close');
		}
	
	
	}
	//***********************************************
	// Create FLexPanel Object
	//***********************************************
	$.fn.flexpanel = function(options){
		new $.flexpanel(this, options);
	}
	
	
	

})(jQuery);
