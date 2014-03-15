#FlexPanel

A responsive scrolling panel navigation for mobile and desktop

####
View FlexPanel examples on the [official website](http://cnkt.ca/flexpanel/)

##Updates

####Additional Animation Now Available!
You now have the option to 'reveal' or 'slide' the panel. The 'reveal' animation will give a more native app movement to the navigation.

##Features

####Swipe Controls
With the help of hammer.js you can swipe to interact with the Flexpanel menu.

####CSS3 Animations
There are no jQuery animations here. All animations are controlled by CSS3 properties.

####Fully Responsive
From mobile applications to desktop websites, FlexPanel can handle your navigation.

##Usage

####HTML Structure
```
<div id="container">
	<div class="wrapper">
		// All site content here
	</div>
	<nav class="flexpanel">
		<div class="viewport-wrap">
			<div class="viewport">
				// Your Flexpanel menu would be here
			</div>
		</div>
	</nav>
</div>
```

####Basic Init Method
```javascript
$('.flexpanel').flexpanel();
```

####Advanced Method
```javascript
$('.flexpanel').flexpanel({
    animation: 'slide', // 'slide' | 'reveal'
    direction: 'right', // 'left' | 'right'
    wrapper: '#wrapper',
    button: '.flex-btn',  
});
```

##Changelog
- 03/14/2014, Added reveal animation
- 03/12/2014, Removing maxWidth parameter
- 03/1/2014, Added IE8 & 9 support

View the full changelog on the [official website](http://cnkt.ca/flexpanel/#changelog) 

