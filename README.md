# imgSpinner
 javascript player for qtvr like object movies
 
### Intro

Way back in the '90's, I created quite a bit of QTVR content including object movies. Recently going through some old harddrives, I found this work. I went looking for a way to display it, and for panoramas there is a good open source solution. However for object movies, all I could find were proprietarty products, or code that used libraries. I just wanted a simple pure javascript player, so I wrote this one.

I intend to continue to develop it as time allows. I also welcome contributions, feedback and feature requests from others.

I have included a working example with images in the codebase (example.html). This project is available under the MIT licence.

### Usage

First import the imgSpinner js and css files (use your own path).

 	<script type="text/javascript" src="imgSpinner/ImgSpinner.js"></script>
	<link rel="stylesheet" type="text/css" href="imgSpinner/ImgSpinner.css">
 
Then initialize the spinner after the page has loaded, for eg:

	CreateImgSpinner().init("spinner", "images/sm-jpgs/#.jpg", "Antique Table", 1, 47, 1);
	
The signature for the init function is:

	init(divId, pattern, firstImgNum, lastImgNum, altText, directionAndSpeed)
	
Where:

**divId** is the id of the div imgSpinner loads the images into

**pattern** is the numbering pattern for your images. # is replaced by the image number. Image numbers need to be conseutive but can start at any number.

**firstImgNum** is the number of the first image

**lastImgNum** is the number of the last image

**altText** is the alt text of the images

**directionAndSpeed** positve numbers are forward, negative numbers are reverse. 1 or -1 is the defaut speed. Larger numbers increse speed, smaller decrease speed.

You can find live examples [here](https:thelynk.ca/imgspinner/imgspinner.html).

