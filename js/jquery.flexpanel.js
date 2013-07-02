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
    "use strict";
    $.flexpanel = function(el, options) {
        var defaults = {
            direction: 'right', // Panel slides in from 'left', 'right' or 'top'.
            wrapper: '#wrapper', // Define the main content wrapper, this is important as it needs to slide.
            button: '.flex-btn', // Define the menu button(open/close).
            maxWidth: null, // Define a minimum screen width to trigger FlexPanel functions - 'null' means there is no minimum.
            //panelWidth: 80, // Coming soon - Percent width of the panel, default is 80%.
            delay: 250, // Delay length, used for window.resize() events (100 = 1 second).
            speed: 500 // Speed of the transitions.
        }
        var options = $.extend(defaults, options);
        //Create vars
        var $flexpanel = $(el),
			$direction = options.direction,
			$wrapper = $(options.wrapper),
			$btn = $(options.button),
			$maxWidth = options.maxWidth,
			//$panelWidth = options.panelWidth,
			$delay = options.delay,
			$speed = options.speed,
			$w = $(window).width(),
			$h = $(window).height(),
			$isMobile = (navigator.userAgent.match(/android|webos|iphone|ipad|ipod|blackberry/i) ? true : false );	
		
		var methods = {
            init: function() {
                //***********************************************
                // -- FlexPanel Init Functions
                //***********************************************
                $('body').addClass('flexpanel-'+$direction);
    			$flexpanel.append('<div class="cover"/>'); // Add .cover div
    			$btn.addClass('in-view');    			
    			if($maxWidth === null || $w <= $maxWidth){
    				methods.height(); 
    				$flexpanel.delay(250).fadeIn(250); //Display FlexPanel
    			}
    			if ($.fn.hammer && $isMobile){// If hammer.js is running && Mobile === True;
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
						case 'top':
						if(event.gesture.direction === 'up' && $('body').hasClass('flexpanel-active')){
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
				if($direction === 'top'){
					$btn.hammer().on("swipe, drag",function(event) {
						if(event.gesture.direction === 'down' && !$('body').hasClass('flexpanel-active')){
							methods.slide();
						}
					});
				}	
				//Functions to determine swipe direction to show/hide nav
				if($direction === 'left' || $direction === 'right'){
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
				}
				//Lets add drag_lock to the panel. Coming soon
				//$('body').hammer({ drag_lock_to_axis: true }).on("release dragleft dragright swipeleft swiperight", handleHammer);
            },
            height: function(){
                //***********************************************
        		// -- Function to set the height of the nav for 
        		//    overflow scrolling
        		//***********************************************
        		var $ph = $h - ($h/4);//panelheight
            	switch($direction){
            		case 'top':
            			$flexpanel.css('height', $ph+'px');
            			$('.viewport', $flexpanel).css('height', $ph+'px');
            			$('.cover', $flexpanel).css('height', $ph+'px');
            		break;
            		default:  
            			if($isMobile){
            				// If is iOS, add 60px to the window height to account for menubar.
            				$flexpanel.css('height', $h+60+'px');
            				$('.viewport', $flexpanel).css('height', $h+60+'px');
            				$('.cover', $flexpanel).css('height', $h+60+'px');
            			}else{
                			$flexpanel.css('height', $h+'px');
                			$('.viewport', $flexpanel).css('height', $h+'px');
                			$('.cover', $flexpanel).css('height', $h+'px');
            			}
            		break;
				}
            }
        }
		methods.init();				
		
		
		//***********************************************
		// -- Click Handlers
		//***********************************************		
		
		$btn.click(methods.slide);
					
		// -- FlexPanel Menu Items w/anchors
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
		// -- Smooth Scrolling
		//
		//    Add smooth scrolling to the .viewport div 
		//    on transition end, otherwise the scrolling 
		//    is jumpy in iOS
		//***********************************************
		$flexpanel.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function() {
			var $el = $('.viewport', $flexpanel);
			if($('body').hasClass('flexpanel-active')){
				$el.addClass('smooth');
			}else{	
				$el.removeClass('smooth');
			}
		});		
				
		
		//***********************************************
		// -- Window Resize() Events
		//***********************************************
		$(window).resize(function(){
			delay(function(){
				$w = $(window).width();
				$h = $(window).height();
				//If screen width has not been defined
				if($maxWidth === null){
					methods.height(); 
				}else{
					if($w <= $maxWidth){//If window is less than maxWidth
						methods.height(); 
					}
					if($w > $maxWidth){
						$flexpanel.hide(); //Hide flexpanel if $w is greater then maxWidth.
						if($('body.flexpanel-active')) $('body').removeClass('flexpanel-active');
					}else{
						$flexpanel.show(); //Make sure flexpanel is always showing if $w is less then maxWidth.
					}
				}
			}, $delay); 
		});
		// -- delay function
		var delay = (function(){
		  var timer = 0;
		  return function(callback, ms){
		    clearTimeout (timer);
		    timer = setTimeout(callback, ms);
		  };
		})();
		
		
		//***********************************************
		// -- Window Scroll() Events
		//***********************************************
		$(window).scroll(function(){
			var $top = $(window).scrollTop();
			if($top < 100){ // Show $btn based on scrollTop val.
				$btn.addClass('in-view');	
			}	
		});
		
		
		//***********************************************
		// -- Global Scrolling Functions
		//***********************************************
			
		//***********************************************
		// -- Viewport Scrolling
		//
		//  Allow scrolling for .viewport div only if 
		//  $flexpanl has a class of 'flexpanel-active'
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
		// -- Prevent Unnecessary Window Scrolling
		//
		//    prevents e.preventDefault from being called 
		//    on document if it sees a scrollable div
		//***********************************************
		$('body').on('touchmove','.viewport',function(e) {
			e.stopPropagation();
		});
		
		// -- Stop body from scrolling using mousewheel while .viewport is active
		$('.viewport').bind('mousewheel DOMMouseScroll', function(e) {
		    var scrollTo = null;		
		    if (e.type == 'mousewheel') {
		        scrollTo = (e.originalEvent.wheelDelta * -1);
		    }
		    else if (e.type == 'DOMMouseScroll') {
		        scrollTo = 40 * e.originalEvent.detail;
		    }		
		    if (scrollTo) {
		        e.preventDefault();
		        $(this).scrollTop(scrollTo + $(this).scrollTop());
		    }
		});
		
		//***********************************************
		// -- Detect Mobile
		//***********************************************
		window.mobilecheck = function() {
var check = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
return check; }
		
		//***********************************************
		// -- Public Methods
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
