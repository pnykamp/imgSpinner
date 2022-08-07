/**
MIT License

Copyright (c) 2022 Paul Nykamp

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function CreateImgSpinner() {
	
	// private variables
	let spinnerDiv, firstFrame, lastFrame;
	let numLoaded, progress, progressBackground;
	let pixelsPerFrame, dirAndSp;
	let lastRotateImgX, isRotating, currentFrame;
	
	let imgIdString;		// provides unique prefix for img ids
	
	let lastX = 0;			// last onMouseMove
	let thisX = 0;			// this onMouseMove
	
	let lastXTime = 0;		// set onMouseMove
	let thisXTime = 0;		// set onMouseUp
	
	/***************** public functions *******************/
	
	// initialization function 
	function init(divId, pattern, firstImgNum, lastImgNum, altText, directionAndSpeed) {
		
		console.log("CreateSpinner init called");

	    spinnerDiv = document.getElementById(divId);
	    firstFrame = firstImgNum;
	    lastFrame = lastImgNum;
	    lastRotateImgX = 0;
	    isRotating = false;
	    numLoaded = 0;
	    currentFrame = firstFrame;
	    dirAndSp = directionAndSpeed;
	    imgIdString = divId + "IS";
	    
	    // do this first in case spinnerDiv.offsetWidth is affected
	    createImages(pattern, altText);
	    
	    pixelsPerFrame = spinnerDiv.offsetWidth / ((lastFrame-firstFrame+1) / 4);
	    
	    createAndShowProgress();
	    
		// bind mouse and touch listeners
	    // see mouse and touch event handlers - bottom of file
	    spinnerDiv.onmousedown = mDown.bind(this);
	    document.addEventListener("mouseup", mtUp, false);
		spinnerDiv.onmousemove = mMove.bind(this);
		
		spinnerDiv.ontouchstart = tStart.bind(this);
		document.addEventListener("touchend", mtUp, false);
		spinnerDiv.ontouchmove = tMove.bind(this);
		
	}
	
	function setDirectionAndSpeed(directionAndSpeed){
		dirAndSp = directionAndSpeed;
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
	    
	    for(let i=firstFrame; i<lastFrame+1; i++) {
	        let img = document.createElement("img");
	        img.alt = altText;
	        img.id = imgIdString + i;
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
    		progressBackground.style.display = "none";
    		console.log("Images loaded.");
    	}
    }

    
    // respond to drag - called from event handlers
    function drag(x) {
    
        lastX = thisX;
        thisX = x;
        
        lastXTime = thisXTime;
        thisXTime = new Date().getTime();
    	
    	let delta = lastRotateImgX - x;

        if ((delta*dirAndSp >= pixelsPerFrame)) {
        	lastRotateImgX = x;
        	moveImage(1);
        } else if (-delta*dirAndSp >= pixelsPerFrame) {
        	lastRotateImgX = x;
        	moveImage(-1);
        }  
    }
    
    // increment is 1 or -1
    function moveImage(increment){
    	
        let img = document.getElementById(imgIdString + currentFrame);
    	img.style.display = 'none';
    	
    	if ((currentFrame == lastFrame) && increment==1 ){
    		currentFrame = firstFrame;
    	} else if((currentFrame == firstFrame) && (increment==-1)){
    		currentFrame = lastFrame;
    	} else {
    		currentFrame = currentFrame + increment;
    	}
    	
        let img2 = document.getElementById(imgIdString + currentFrame);
        img2.style.display = "block";
    	
    }
    
    
    
    // called from mtUp()
    function provideInertia(){
    	
    	let lag = thisXTime - lastXTime;	// lag in ms from last mouse move to mouse up
    	if(lag > 100) return;
    	
    	let imgInertia = thisX-lastX;		// how much inertia the imgSpinner has left
    	let nextDuration;					// duration of the next loop
    	let initialInertiaLimit = 1;		// imgInertia initial cutoff
    	let inertiaLimit = 2.5;				// imgInertia rotation cutoff
    	let inertiaReductionRatio = 1.2;	// how fast speed is reduced imgInertia/inertiaReductionRatio
    	
    	// tie duration of next frame to dirAndSp - ie more inetia (less duration) for more speed
    	let durationMultiplier = 500 / (1 + Math.abs(dirAndSp)/6);

    	// continue if enough initial inertia
    	if (imgInertia>initialInertiaLimit || imgInertia<-initialInertiaLimit) setTimeout(continueInertia, 50);
    	
    	
    	function continueInertia(){	
    		
    		// move to the next image
    		if (thisX-lastX > 0) {
    			if(dirAndSp > 0) {
    				moveImage(-1);
    			} else if (dirAndSp < 0) {
    				moveImage(1);
    			}
    		} else if (thisX-lastX < 0) {
    			if(dirAndSp > 0) {
    				moveImage(1);
    			} else if (dirAndSp < 0) {
    				moveImage(-1);
    			}
    		}
    		
    		// set next inertia and duration
    		imgInertia = imgInertia/inertiaReductionRatio;
    		setDuration();
    		
    		// continue inertia if it is above inertiaLimit
    		if (imgInertia > inertiaLimit || imgInertia < -inertiaLimit) {
    			setTimeout(continueInertia, nextDuration);
    		}
    		
    	}
    	
    	function setDuration(){
    		nextDuration = Math.abs( durationMultiplier / imgInertia );
    	}
    	setDuration();
    	
    	
    }

    
    
    

    /***************** mouse and touch event handlers *******************/
    
    function mDown(event) {

    	// TODO: make comment about this line
    	event.preventDefault();
    	
    	isRotating = true;
    	lastRotateImgX = event.screenX - (event.clientX-event.offsetX);
    };
    
    
    function mMove(event){
    	
    	if(isRotating == false)  return;
    	
        drag(event.offsetX);
    }
    
    
    
    function mtUp() {
    	
    	isRotating = false;
    	thisXTime = new Date().getTime();
    	provideInertia();
    }
    
    
    function tStart(event) {

    	event.preventDefault();
    	
        isRotating = true; 
    	let bodyRect = document.body.getBoundingClientRect();
    	let spinnerRect = spinnerDiv.getBoundingClientRect();
    	let offsetX = spinnerRect.left - bodyRect.left;
    	
    	lastRotateImgX = event.touches.item(0).screenX - offsetX;
    	
    }
    
    
    function tMove(event){
    	
    	let bodyRect = document.body.getBoundingClientRect();
    	let spinnerRect = spinnerDiv.getBoundingClientRect();
    	let offsetX = spinnerRect.left - bodyRect.left;
        let x = event.touches.item(0).screenX - offsetX;
        
        drag(x);
        
    }
    
    

	
    return {
    	init : init,
    	setDirectionAndSpeed : setDirectionAndSpeed
    }

}