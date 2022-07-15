# imgSpinner
 javascript player for qtvr like object movies
 
### Intro

Way back in the '90's, I created quite a bit of QTVR content including object movies. Recently going through some old harddrives, I found this work. I went looking for a way to display it, and for panoramas there is a good open source solution. However for object movies, all I could find were proprietarty products, or code that used large libraries like jquery. I just wanted a simple pure javascript player, so I wrote this one.

Currently it is feature poor, just enough to play my old qtvr object content, but I intend to continue to develop it as time allows. I also welcome contribution from others.

I have included a working example in the codebase (example.html).

### Usage

Firt import the imgSpinner js and css files.

 	<script type="text/javascript" src="imgSpinner/ImgSpinner.js"></script>
	<link rel="stylesheet" type="text/css" href="imgSpinner/ImgSpinner.css">
 
Then initialize the spinner after the page has loaded.

	CreateSpinner().init("spinner", "images/sm-jpgs/#.jpg", "Antique Table", 1, 47);
	
The arguments for the init function are:

	init(divId, pattern, altText, startFrame, endFrame)
	
Where:

**divId** is the id of the div imgSpinner loads the images into

**pattern** is the numbering pattern for your images. # is replaced by the image number.

**altText** is the alt text of the images

**startFrame** is the number of the first image

**endFrame** is the number of the last image

See `example.html` for a working example with images I shot way back then.

	