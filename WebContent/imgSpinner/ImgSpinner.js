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
	
	
	// initialization function - the only public function
	function init(divId, pattern, firstImgNum, lastImgNum, altText, directionAndSpeed) {
		
		console.log("CreateSpinner init called");

	    // let that = this;

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
		// document.onmouseup = mtUp.bind(this);
	    document.addEventListener("mouseup", mtUp, false);
		spinnerDiv.onmousemove = mMove.bind(this);
		
		spinnerDiv.ontouchstart = tStart.bind(this);
		// document.ontouchend = mtUp.bind(this);
		document.addEventListener("touchend", mtUp, false);
		spinnerDiv.ontouchmove = tMove.bind(this);
		
		console.log(imgIdString);
		
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
    		console.log(imgIdString + ": images loaded");
    		progressBackground.style.display = "none";
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
    	
    	console.log(imgIdString + ": moveImage, increment: " + increment);
    	
        let img = document.getElementById(imgIdString + currentFrame);
    	img.style.display = 'none';
    	
    	console.log(imgIdString + ": moveImage, img.id: " + imgIdString + currentFrame);
    	
    	if ((currentFrame == lastFrame) && increment==1 ){
    		currentFrame = firstFrame;
    	} else if((currentFrame == firstFrame) && (increment==-1)){
    		currentFrame = lastFrame;
    	} else {
    		currentFrame = currentFrame + increment;
    	}
    	
        let img2 = document.getElementById(imgIdString + currentFrame);
        img2.style.display = "block";
        
        console.log(imgIdString + ": moveImage, img2.id: " + imgIdString + currentFrame);
    	
    }
    
    
    
    // called from mtUp()
    function provideInertia(){
    	
    	let lag = thisXTime - lastXTime;	// lag in ms from last mouse move to mouse up
    	if(lag > 100) return;
    	
    	let imgInertia = thisX-lastX;		// how much inertia the imgSpinner has left
    	let nextDuration;					// duration of the next loop
    	let initialInertiaLimit = 1;		// imgInertia initial cutoff
    	let inertiaLimit = 4;				// imgInertia rotation cutoff
    	let inertiaReductionRatio = 1.4;	// how fast speed is reduced imgInertia/inertiaReductionRatio

    	// continue if enough initial inertia
    	if (imgInertia>initialInertiaLimit || imgInertia<-initialInertiaLimit) setTimeout(continueInertia, nextDuration);
    	
    	
    	function continueInertia(){	

    		// move to the next image
    		if (imgInertia > 0) {
    			moveImage(-1);
    		} else if (imgInertia < 0) {
    			moveImage(1);
    		}
    		
    		// set inertia and duration
    		imgInertia = imgInertia/inertiaReductionRatio;
    		setDuration();
    		
    		// continue inertia if it is above inertiaLimit
    		if (imgInertia > inertiaLimit || imgInertia < -inertiaLimit) {
    			setTimeout(continueInertia, nextDuration);
    		}
    		
    	}
    	
    	function setDuration(){
    		nextDuration = Math.abs(500/imgInertia);
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
    	
    	console.log(imgIdString + ": mMove, isRotating: " + isRotating);
    	
        drag(event.offsetX);
    }
    
    
    
    function mtUp() {
    	
    	console.log(imgIdString + ": mtUp");
    	
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
    
    

	
	return {init:init}

}