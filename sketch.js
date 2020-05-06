let img;
let sorted;
let pixelInfo = [];

function preload() {	
	
	//img = loadImage('data/10x10Split.png');
	//img = loadImage('data/5x10Split.png');
	//img = loadImage('data/100x200Split.png');
	//img = loadImage('data/16x32Split.png');
	//img = loadImage('data/100x200Split.png');
	//img = loadImage('data/400x800Split.png');
	//img = loadImage('data/quarterrgb.png');
	//img = loadImage('data/allrgb.png');
	img = loadImage('data/example.jpg');
}

function setup() {
	const margin = 0;
	createCanvas(img.width, img.height * 2 + margin);

	sorted = createImage(img.width, img.height);
	sorted = img.get();
	sorted.loadPixels();

	//pixelInfo = loadPixelInfo(sorted);
	pixelInfo = sorted.loadPixelInfo();

	//pixelInfo.sort((a, b) => a.brightness - b.brightness);
	
	//pixelInfo = singleRowSort(sorted, pixelInfo, 2);	
	//pixelInfo = singleColumnSort(sorted, pixelInfo, 0);

	//pixelInfo = allRowSort(sorted, pixelInfo);
	pixelInfo = allColumnSort(sorted, pixelInfo);

	//pixelInfo = allRowSortOverThreshold(sorted, pixelInfo, 600);

	//pixelInfo = horizontalWrap(sorted, pixelInfo, 400, 600, -50);

	//pixelInfo = interlacing(sorted, pixelInfo, 4);

	//sorted.refreshImageContent(sorted, pixelInfo);
	sorted.refreshImageContent(pixelInfo);

	//sorted.save('photo', 'jpg');

	background(0);
	image(img, 0, 0);
	image(sorted, 0, img.height + margin);

	/* BUTTONS */	
	const downloadBtn = createButton('Download');
	downloadBtn.position(img.width + margin, 20);
	downloadBtn.style('font-size', '25px');
	downloadBtn.mousePressed(downloadResults);
}

function downloadResults(){
	sorted.save('photo' + '_' + getDateString(), 'jpg');
}

function getDateString(){
	return new Date()
		.toISOString()
		.slice(0,19)
		.replace('T', '_')
		.replace(/\:/g, '-');
}
