/*
 * jQuery FlexPanel v1.1
 * https://github.com/dcooney/flexpanel
 *
 * Copyright 2015 Connekt Media - http://connekthq.com/flexpanel
 * Free to use under the GPLv2 license.
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Author: Darren Cooney
 * Twitter: @KaptonKaos
 */
(function ($) {
   "use strict";
   
   $.flexpanel = function (el, options) {
      var defaults = { 
      	 animation: 'slide', //'slide' | 'reveal'
          direction: 'right', // 'left | right'
          wrapper: '#wrapper', // Define content wrapper
          maxWidth: null, // Max viewport width for FlexPanel, null = always, e.g. '768'.
          button: '.flex-btn' // Define the menu button(open/close)         
      };
      var options = $.extend(defaults, options); 
      //Create vars
      var $flexpanel = $(el),
          $animation = options.animation, 
          $direction = options.direction,
          $wrapper = $(options.wrapper),
          $maxWidth = options.maxWidth,
          $btn = $(options.button),
          $prefix = 'flexpanel',
          $w = $(window).width(),
          $isMobile = (navigator.userAgent.match(/iemobile|android|webos|iphone|ipad|ipod|blackberry|bb10/i) ? true : false),
          isIE = false,
          $body = $('body');

      //***********************************************
      // - Test for IE versions. Need to use css transtions for anything less than IE10
      //***********************************************
      if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
         var ua = navigator.userAgent;
         if ((ua.match(/MSIE 9.0/i))) {
            $('body').addClass("ie9");
            isIE = true;
         }
         if ((ua.match(/MSIE 8.0/i)) || (ua.match(/MSIE 7.0/i))) {
            $('body').addClass("isIE");
            isIE = true;
         }
      }


      var methods = {
         init: function () {
            //***********************************************
            // -- FlexPanel Init Functions
            //***********************************************
            $('body').addClass($prefix+ '-' + $direction + ' ' + $prefix+ '-' + $animation + ' ' + $prefix+ '-hide');
            if($animation === 'reveal'){
            	$btn.append('<a href="javascript:void(0);"><span class="one"></span><span class="two"></span><span class="three"></span></a>');
            	$btn.appendTo($body);
            }else{
	            $btn.append('<a href="javascript:void(0);"><span class="one"></span><span class="two"></span><span class="three"></span></a>');
            }
            $btn.addClass('in-view');
            if($maxWidth === null || $w <= $maxWidth){               
       			$('body').removeClass('flexpanel-hide');
    				$flexpanel.delay(500).fadeIn(250); //Display FlexPanel
    			}
            if($animation === 'reveal')
            	$flexpanel.addClass('reveal');
            	
            if ($.fn.hammer /* && $isMobile */ ) 
            	methods.touch();// If hammer.js is installed
            
         },
         slide: function (e) {
            //***********************************************
            // -- Open/Close FlexPanel
            //***********************************************
            switch (e) {
            case 'open':
               $body.addClass('flexpanel-active');
               $('.viewport', $flexpanel).addClass('smooth');
               break;
            case 'close':
               $('.viewport', $flexpanel).animate({
                  scrollTop: 0
               }, 500, function () {
                  $('.viewport', $flexpanel).removeClass('smooth');
               });
               $body.removeClass('flexpanel-active');
               $(document).on('touchmove', function (e) {
                  return true;
               });
               break;
            default:
               if ($body.hasClass('flexpanel-active')) {
                  $('.viewport', $flexpanel).animate({
                     scrollTop: 0
                  }, 500, function () {
                     $('.viewport', $flexpanel).removeClass('smooth');
                  });
                  $wrapper.unbind('click');  
                  $body.removeClass('flexpanel-active');
                  $(document).on('touchmove', function (e) {
                     return true;
                  });
               } else {               
                  $body.addClass('flexpanel-active');
                  $('.viewport', $flexpanel).addClass('smooth');  
                  setTimeout(function() {
                  	$wrapper.delay(250).unbind('click').bind('click', methods.slide);
				  }, 250);              
               }               
            }
         },
         touch: function () {
            //***********************************************
            // -- Swipe & Touch Events
            //***********************************************
            
            $btn.hammer().bind("swipeleft swiperight", function (event) {
               var evType = event.type;               
               switch ($direction) {
               case 'right':
                  if (evType === 'swipeleft' && !$('body').hasClass('flexpanel-active')) { //Open
                     methods.slide();
                  }
                  if (evType === 'swiperight' && $('body').hasClass('flexpanel-active')) { //Close
                     methods.slide();
                  }
                  break;
               case 'left':   
                  if (evType === 'swiperight' && !$('body').hasClass('flexpanel-active')) { //Open
                     methods.slide();
                  }
                  if (evType === 'swipeleft' && $('body').hasClass('flexpanel-active')) { //Close
                     methods.slide();
                  }
                  break;
               }
            });
            //Lets add drag_lock to the panel. Coming soon
            //$('body').hammer({ drag_lock_to_axis: true }).on("release dragleft dragright swipeleft swiperight", handleHammer);
         }         
      }
      methods.init();


      //***********************************************
      // -- Click Handlers
      //***********************************************		
      
      $btn.on('click', function(){
         methods.slide();
      });
      

      // -- FlexPanel Menu Items w/anchors
      $('ul li a', $flexpanel).click(function () {
         var $el = $(this);
         var $target = $el.attr('href');
         if ($el.hasClass('anchor')) {
            methods.slide();
            var target_offset = $($target).offset();
            var target_top = target_offset.top;
            $('html, body').animate({
               scrollTop: target_top
            }, 500);
         } 
      });
      
		//***********************************************
		// -- Window Resize() Event
		//***********************************************
		
		$(window).resize(function() {
			$w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			//console.log($maxWidth, $w);			
			if($maxWidth === null){//If screen width has not been defined
				$flexpanel.show();
			}else{
				//Hide FlexPanel if window is larger than maxWidth
				if($w > $maxWidth){
					if($('body.flexpanel-active')){
						$('body').removeClass('flexpanel-active').addClass('flexpanel-hide');
						$wrapper.unbind('click');
					}
				}else{
					$flexpanel.show();
					$('body').removeClass('flexpanel-hide');
				}
			}
		});
		
		var delay = (function(){
			var timer = 0;
			return function(callback, ms){
				clearTimeout (timer);
				timer = setTimeout(callback, ms);
			};
		})(); 
		

      //***********************************************
      // -- Smooth Scrolling
      //
      //    Add smooth scrolling to the .viewport div 
      //    on transition end, otherwise the scrolling 
      //    is jumpy in iOS
      // - Removed for now, issues with iOS7.
      //***********************************************
      $('.viewport', $flexpanel).bind("touchstart", function (event) {}); //iOS7 smooth scroll fix						


      //***********************************************
      // -- Window Scroll() Events
      //***********************************************
      $(window).scroll(function () {
         var $top = $(window).scrollTop();
         if ($top < 100) { // Show $btn based on scrollTop val.
            $btn.addClass('in-view');
         }
      });


      //***********************************************
      // -- Viewport Scrolling
      //
      // Allow scrolling for .viewport div only if
      // $flexpanl has a class of 'flexpanel-active'
      //***********************************************
      $(document).on('touchmove', function (e) {
         if ($body.hasClass('flexpanel-active')) {
            e.preventDefault();
         }
      });

      $body.on('touchstart', '.viewport', function (e) {
         if (e.currentTarget.scrollTop === 0) {
            e.currentTarget.scrollTop = 1;
         } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
            e.currentTarget.scrollTop -= 1;
         }
      });

      //***********************************************
      // -- Prevent Unnecessary Window Scrolling
      //
      // prevents e.preventDefault from being called
      // on document if it sees a scrollable div
      //***********************************************
      $body.on('touchmove', '.viewport', function (e) {
         e.stopPropagation();
      });

      // -- Stop body from scrolling using mousewheel while .viewport is active
      $('.viewport').bind('mousewheel DOMMouseScroll', function (e) {
         var scrollTo = null;
         if (e.type == 'mousewheel') {
            scrollTo = (e.originalEvent.wheelDelta * -1);
         } else if (e.type == 'DOMMouseScroll') {
            scrollTo = 40 * e.originalEvent.detail;
         }
         if (scrollTo) {
            e.preventDefault();
            $(this).scrollTop(scrollTo + $(this).scrollTop());
         }
      });


      //***********************************************
      // -- Public Methods
      //***********************************************
      $.fn.flexpanel.toggle = function () {
         methods.slide();
      }
      $.fn.flexpanel.open = function () {
         methods.slide('open');
      }
      $.fn.flexpanel.close = function () {
         methods.slide('close');
      }
   }
   //***********************************************
   // Create FLexPanel Object
   //***********************************************
   $.fn.flexpanel = function (options) {
      new $.flexpanel(this, options);
   }


})(jQuery);