/*
 * jQuery FlexPanel v1
 * https://github.com/dcooney/flexpanel
 *
 * Copyright 2014 Connekt Media - http://cnkt.ca/flexpanel
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
         direction: 'right', // Slide direction 'left | right'
         wrapper: '#wrapper', // Define content wrapper
         button: '.flex-btn', // Define the menu button(open/close)         
         maxWidth: null, // Minimum screen width to trigger FlexPanel, 'null' = no minimum.
         speed: 500 // Speed of the transitions.
      };
      var options = $.extend(defaults, options); 
      //Create vars
      var $flexpanel = $(el),
          $direction = options.direction,
          $wrapper = $(options.wrapper),
          $btn = $(options.button),
          $maxWidth = options.maxWidth,
          $speed = options.speed,
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
            $('body').addClass('flexpanel-' + $direction);
            $flexpanel.append('<div class="cover"/>'); // Add .cover div
            $btn.append('<span class="one"></span><span class="two"></span><span class="three"></span>');
            $btn.addClass('in-view');
            if ($maxWidth === null || $w <= $maxWidth) {
               $flexpanel.delay(250).fadeIn(250); //Display FlexPanel
            }
            if ($.fn.hammer && $isMobile) { // If hammer.js is running && Mobile === True;
               methods.touch();
            }
         },
         slide: function (e) {
            //***********************************************
            // -- Open/Close FlexPanel
            //***********************************************
            switch (e) {
            case 'open':
               $('body').addClass('flexpanel-active');
               $('.viewport', $flexpanel).addClass('smooth');
               break;
            case 'close':
               $('.viewport', $flexpanel).animate({
                  scrollTop: 0
               }, 500, function () {
                  $('.viewport', $flexpanel).removeClass('smooth');
               });
               $('body').removeClass('flexpanel-active');
               $(document).on('touchmove', function (e) {
                  return true;
               });
               break;
            default:
               if ($('body').hasClass('flexpanel-active')) {
                  $('.viewport', $flexpanel).animate({
                     scrollTop: 0
                  }, 500, function () {
                     $('.viewport', $flexpanel).removeClass('smooth');
                  });
                  $('body').removeClass('flexpanel-active');
                  $(document).on('touchmove', function (e) {
                     return true;
                  });
               } else {
                  $('body').addClass('flexpanel-active');
                  $('.viewport', $flexpanel).addClass('smooth');                 
               }               
            }
         },
         touch: function () {
            //***********************************************
            // -- Swipe & Touch Events
            //***********************************************
            $('.cover').add($btn).hammer().on("swipe, drag", function (event) {
               switch ($direction) {
               case 'right':
                  if (event.gesture.direction === 'right' && $('body').hasClass('flexpanel-active')) {
                     methods.slide();
                  }
                  break;
               case 'left':
                  if (event.gesture.direction === 'left' && $('body').hasClass('flexpanel-active')) {
                     methods.slide();
                  }
                  break;
               case 'top':
                  if (event.gesture.direction === 'up' && $('body').hasClass('flexpanel-active')) {
                     methods.slide();
                  }
                  break;
               }
            });

            $btn.hammer().on("swipe, drag", function (event) {
               //$wrapper and $btn swipe events
               switch ($direction) {
               case 'right':
                  if (event.gesture.direction === 'left' && !$('body').hasClass('flexpanel-active')) {
                     methods.slide();
                  }
                  break;
               case 'left':
                  if (event.gesture.direction === 'right' && !$('body').hasClass('flexpanel-active')) {
                     methods.slide();
                  }
                  break;
               }
            });
            if ($direction === 'top') {
               $btn.hammer().on("swipe, drag", function (event) {
                  if (event.gesture.direction === 'down' && !$body.hasClass('flexpanel-active')) {
                     methods.slide();
                  }
               });
            }
            //Functions to determine swipe direction to show/hide nav
            if ($direction === 'left' || $direction === 'right') {
               var isWindowsPhone = /iemobile/i.test(navigator.userAgent.toLowerCase());
               if (!isWindowsPhone) {
                  $body.hammer().on("dragdown", function (event) {
                     //Determine if the user is attempting to scroll to top by deltaTime
                     if (event.gesture.deltaTime > 50) {
                        $btn.addClass('in-view');
                     }
                  });
                  $body.hammer().on("dragup", function (event) {
                     //Determine if the user is attempting to scroll to top by timing the drag time
                     var $top = $(window).scrollTop();
                     if (event.gesture.deltaTime > 50 && $top > 100) {
                        $btn.removeClass('in-view');
                     }
                  });
               }
            }
            //Lets add drag_lock to the panel. Coming soon
            //$('body').hammer({ drag_lock_to_axis: true }).on("release dragleft dragright swipeleft swiperight", handleHammer);
         }         
      }
      methods.init();


      //***********************************************
      // -- Click Handlers
      //***********************************************		
      $btn.click(methods.slide);
      $('.cover').click(methods.slide);

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
            }, $speed);
         }
      });

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