function CreateSpinner() {
	
	// private variables
	let spinnerDiv, firstFrame, lastFrame, dragX, isRotating, currentFrame, pixelsPerFrame, numLoaded;
	let progress, progressBackground;
	
	// initialization function - the only public function
	function init(divId, pattern, altText, startFrame, endFrame) {
		
		console.log("CreateSpinner init called");

	    let that = this;

	    spinnerDiv = document.getElementById(divId);
	    firstFrame = startFrame;
	    lastFrame = endFrame;
	    dragX = 0;
	    isRotating = false;
	    numLoaded = 0;
	    currentFrame = firstFrame;
	    
	    // do this first in case spinnerDiv.offsetWidth is affected
	    createImages(pattern, altText);
	    
	    pixelsPerFrame = spinnerDiv.offsetWidth / ((lastFrame-firstFrame+1) / 2);
	    
	    createAndShowProgress();
	    
		// bind mouse and touch listeners
	    // see mouse and touch event handlers - bottom of file
	    spinnerDiv.onmousedown = mDown.bind(that);
		document.onmouseup = mtUp.bind(that);
		spinnerDiv.onmousemove = mMove.bind(that);
		
		spinnerDiv.ontouchstart = tStart.bind(that);
		document.ontouchend = mtUp.bind(that);
		spinnerDiv.ontouchmove = tMove.bind(that);
		
	}
	

	
	/***************** private functions *******************/
	
	// create the progress bar and make it visible
	function createAndShowProgress() {
		
		progressBackground = document.createElement("div");
		progressBackground.className = "progress-background";
		
	    progress = document.createElement("progress");
	    progress.className = "progress";
	    progress.max = lastFrame - firstFrame + 1;
	    progress.value = 0;
	    progressBackground.appendChild(progress);
	    
	    spinnerDiv.appendChild(progressBackground);
	}
	
	// create and load images into spinner div
	function createImages(pattern, altText) {
	    // create the images
	    for(let i=firstFrame; i<lastFrame+1; i++) {
	        let img = document.createElement("img");
	        img.alt = altText;
	        img.id = "img" + i;
	        img.className = "spinner-img";
	        img.onload = function(){
	        	loading();
	        }
	        if(i==firstFrame) {
	        	img.style.display = "block";
	        } else {
	        	img.style.display = "none";
	        }
	        spinnerDiv.appendChild(img);
	        
	        // do this last, this will cause the image to load
	        // that way img.onload will be called even if loaded from cache
	        img.src = pattern.replace("#", i);
	    }
	}

    // display progress, hide progress when complete
    function loading() {
    	numLoaded++;
    	progress.value = numLoaded;
    	if (numLoaded == (lastFrame - firstFrame + 1)) {
    		console.log("images loaded");
    		progressBackground.style.display = "none";
    	}
    }

    
    // respond to drag - called from event handlers
    function drag(x, delta) {
        
        if ((delta >= pixelsPerFrame)) {
        	
        	// console.log("left");

        	dragX = x;
        	
            let img3 = document.getElementById("img" + currentFrame);
        	img3.style.display = 'none';
            if(currentFrame == lastFrame){
            	currentFrame = firstFrame;
            } else {
            	currentFrame++;
            }
            let img4 = document.getElementById("img" + (currentFrame));
            img4.style.display = "block";

        } else if (-delta >= pixelsPerFrame) {
        	
        	// console.log("right");
        	
            dragX = x;
            let img = document.getElementById("img" + currentFrame);
            img.style.display = 'none';
            if(currentFrame == firstFrame){
            	currentFrame = lastFrame;
            } else {
            	currentFrame--;
            }
            let img2 = document.getElementById("img" + currentFrame);
            img2.style.display = "block";

        }  
  

    }
    
    
    
    // mouse and touch event handlers
    
    function mDown(event) {

    	event.preventDefault();
    	
    	isRotating = true;
    	dragX = event.screenX - (event.clientX-event.offsetX);
    };
    
    
    function mMove(event){
    	
    	if(isRotating == false)  return;
    	
        let x = event.offsetX;
        let delta = dragX - x;
        drag(x, delta);
    }
    
    
    function mtUp() {
    	isRotating = false; 
    }
    
    
    function tStart(event) {

    	event.preventDefault();
    	
        isRotating = true; 
    	let bodyRect = document.body.getBoundingClientRect();
    	let spinnerRect = spinnerDiv.getBoundingClientRect();
    	let offsetX = spinnerRect.left - bodyRect.left;
    	
    	dragX = event.touches.item(0).screenX - offsetX;
    	
    }
    
    
    function tMove(event){
    	
    	let bodyRect = document.body.getBoundingClientRect();
    	let spinnerRect = spinnerDiv.getBoundingClientRect();
    	let offsetX = spinnerRect.left - bodyRect.left;

        let x = event.touches.item(0).screenX - offsetX;
        let delta = dragX - x;
        
        drag(x, delta);
    	
    }
    
    

	
	return {init:init}

}