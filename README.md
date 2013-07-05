#FlexPanel

A responsive scrolling panel navigation for mobile and desktop

##Features

###Swipe Controls
With the help of hammer.js you can swipe to interact with the Flexpanel menu.


###CSS3 Animations
There are no jQuery animations here. All animations are controlled by CSS3 properties.

###Fully Responsive
From mobile applications to desktop websites, FlexPanel can handle your navigation.

##Usage

###HTML Structure
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

###Basic Init Method
```javascript
$('.flexpanel').flexpanel();
```

###Advanced Method
```javascript
$('.flexpanel').flexpanel({
    wrapper: '#wrapper',
    button: '.flex-btn',
	maxWidth: 1200,    
});
```


View FlexPanel examples on the [offical website](http://cnkt.ca/flexpanel/)

