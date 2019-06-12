//Get reference to canvas
var canvas = document.getElementById('canvas');

//Get reference to canvas context
var context = canvas.getContext('2d');

//Get reference to loading screen
var loading_screen = document.getElementById('loading');

//Initialize loading variables
var loaded = false;
var load_counter =0;

//	initialize images for layers
var background = new Image();
var maskshadow = new Image();
var mask = new Image();
var shadow = new Image();
var figure = new Image();

// create a list of layer objects
var layer_list = [
	{
		'image': background,
		'src': './images/background.png',
		'z_index': -2.25,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	{
		'image': maskshadow,
		'src': './images/maskshadow.png',
		'z_index': -2,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	{
		'image': mask,
		'src': './images/mask.png',
		'z_index': 0,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	{
		'image': shadow,
		'src': './images/shadow.png',
		'z_index':  0.25,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	{
		'image': figure,
		'src': './images/figure.png',
		'z_index': 0.8,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	}
];

layer_list.forEach(function(layer, index){
	layer.image.onload = function(){
		load_counter += 1;
		if (load_counter >= layer_list.length) {
			//hide the loading screen
			hideLoading();
			requestAnimationFrame(drawCanvas);
		} 
		
	}
	layer.image.src = layer.src;
	
});

function hideLoading(){
	loading_screen.classList.add('hidden');
}

function drawCanvas() {
	// clear whatever is in the canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	// This is needed for the animation to snap back to center when you release mouse or touch
	TWEEN.update();
	
	//calculate how much the canvas should rotate
	var rotate_x = (pointer.y * -0.15) + (motion.y * -1.2);
	var rotate_y = (pointer.x * 0.15) + (motion.x * 1.2);
	
	var transform_string = "rotateX(" + rotate_x + "deg) rotateY("+ rotate_y + "deg)"
	
	//Actually rotate the canvas
	
	canvas.style.transform = transform_string;
	
	// Loop through each layer and draw it to the canvas
	layer_list.forEach(function(layer, index) {
		layer.position = getOffset(layer);
		
		
		
		if (layer.blend) {
			context.globalCompositeOperation = layer.blend;
		} else {
			context.globalCompositeOperation = 'normal';
		}
		
		context.globalAlpha = layer.opacity;
		
		context.drawImage(layer.image, layer.position.x, layer.position.y);
	});
	requestAnimationFrame(drawCanvas);
	
}

function getOffset(layer){
	var touch_offset_x = pointer.x * layer.z_index;
	var touch_offset_y = pointer.y * layer.z_index;
	
	var offset = {
		x: touch_offset_x,
		y: touch_offset_y,
	};
	
	return offset;
	
}

//// TOUCH AND MOUSE CONTROLS


//// TOUCH AND MOUSE CONTROLS ////

// Initialize variables for touch and mouse-based parallax

// This is a variable we're using to only move things when you're touching the screen, or holding the mouse button down.
var moving = false;

// Initialize touch and mouse position
var pointer_initial = {
	x: 0,
	y: 0
};
var pointer = {
	x: 0,
	y: 0
};

// This one listens for when you start touching the canvas element
canvas.addEventListener('touchstart', pointerStart);
// This one listens for when you start clicking on the canvas (when you press the mouse button down)
canvas.addEventListener('mousedown', pointerStart);

// Runs when touch or mouse click starts
function pointerStart(event) {
	// Ok, you touched the screen or clicked, now things can move until you stop doing that
	moving = true;
	// Check if this is a touch event
	if (event.type === 'touchstart') {
		// set initial touch position to the coordinates where you first touched the screen
		pointer_initial.x = event.touches[0].clientX;
		pointer_initial.y = event.touches[0].clientY;
	// Check if this is a mouse click event
	} else if (event.type === 'mousedown') {
		// set initial mouse position to the coordinates where you first clicked
		pointer_initial.x = event.clientX;
		pointer_initial.y = event.clientY;
	}
}


// This runs whenever your finger moves anywhere in the browser window
window.addEventListener('mousemove', pointerMove);
// This runs whenever your mouse moves anywhere in the browser window
window.addEventListener('touchmove', pointerMove);

// Runs when touch or mouse is moved
function pointerMove(event) {
	// This is important to prevent scrolling the page instead of moving layers around
	event.preventDefault();
	// Only run this if touch or mouse click has started
	if (moving === true) {
		var current_x = 0;
		var current_y = 0;
		// Check if this is a touch event
		if (event.type === 'touchmove') {
			// Current position of touch
			current_x = event.touches[0].clientX;
			current_y = event.touches[0].clientY;
		// Check if this is a mouse event
		} else if (event.type === 'mousemove') {
			// Current position of mouse cursor
			current_x = event.clientX;
			current_y = event.clientY;
		}
		// Set pointer position to the difference between current position and initial position
		pointer.x = current_x - pointer_initial.x;
		pointer.y = current_y - pointer_initial.y; 
	}
};

// Listen to any time you move your finger in the canvas element
canvas.addEventListener('touchmove', function(event) {
	// Don't scroll the screen
	event.preventDefault();
});
// Listen to any time you move your mouse in the canvas element
canvas.addEventListener('mousemove', function(event) {
	// Don't do whatever would normally happen when you click and drag
	event.preventDefault();
});

// Listen for when you stop touching the screen
window.addEventListener('touchend', function(event) {
	// Run the endGesture function (below)
	endGesture();
});
// Listen for when you release the mouse button anywhere on the screen
window.addEventListener('mouseup', function(event) {
	// Run the endGesture function (below)
	endGesture();
});


function endGesture() {
	// You aren't touching or clicking anymore, so set this back to false
	moving = false;
	
	// This removes any in progress tweens
	TWEEN.removeAll();
	// This starts the animation to reset the position of all layers when you stop moving them
	var pointer_tween = new TWEEN.Tween(pointer).to({x: 0, y: 0}, 300).easing(TWEEN.Easing.Back.Out).start();	
}


//// MOTION CONTROLS ////

// Initialize variables for motion-based parallax
var motion_initial = {
	x: null,
	y: null
};
var motion = {
	x: 0,
	y: 0
};

// This is where we listen to the gyroscope position
window.addEventListener('deviceorientation', function(event) {
	// If this is the first run through here, set the initial position of the gyroscope
	if (!motion_initial.x && !motion_initial.y) {
		motion_initial.x = event.beta;
		motion_initial.y = event.gamma;
	}
	
	// Depending on what orientation the device is in, you need to adjust what each gyroscope axis means
	// This can be a bit tricky
    if (window.orientation === 0) {
    	// The device is right-side up in portrait orientation
    	motion.x = event.gamma - motion_initial.y;
    	motion.y = event.beta - motion_initial.x;
    } else if (window.orientation === 90) {
    	// The device is in landscape laying on its left side
    	motion.x = event.beta - motion_initial.x;
    	motion.y = -event.gamma + motion_initial.y;
    } else if (window.orientation === -90) {
    	// The device is in landscape laying on its right side
    	motion.x = -event.beta + motion_initial.x;
    	motion.y = event.gamma - motion_initial.y;
    } else {
    	// The device is upside-down in portrait orientation
		motion.x = -event.gamma + motion_initial.y;
		motion.y = -event.beta + motion_initial.x;
    }
});

// Reset the position of motion controls when device changes between portrait and landscape, etc.
window.addEventListener('orientationchange', function(event) {
	motion_initial.x = 0;
	motion_initial.y = 0;
});


