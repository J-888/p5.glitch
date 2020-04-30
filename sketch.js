let img;
let sorted;
let pixelInfo = [];

function preload() {	
	//img = loadImage('data/10x10Split.png');
	img = loadImage('data/16x32Split.png');
	//img = loadImage('data/100x200Split.png');
	//img = loadImage('data/400x800Split.png');
	//img = loadImage('data/quarterrgb.png');
	//img = loadImage('data/allrgb.png');
	//img = loadImage('data/example.jpg');
}

function setup() {
	createCanvas(img.width, img.height * 2);

	sorted = createImage(img.width, img.height);
	sorted = img.get();
	sorted.loadPixels();

	//pixelInfo = loadPixelInfo(sorted);
	pixelInfo = sorted.loadPixelInfo();

	//pixelInfo.sort((a, b) => a.brightness - b.brightness);

	//pixelInfo = allRowSort(sorted, pixelInfo);

	//pixelInfo = allRowSortOverThreshold(sorted, pixelInfo, 600);

	//pixelInfo = horizontalWrap(sorted, pixelInfo, 400, 600, -50);

	pixelInfo = interlacing(sorted, pixelInfo, 2);

	//sorted.refreshImageContent(sorted, pixelInfo);
	sorted.refreshImageContent(pixelInfo);

	background(0);
	image(img, 0, 0);
	image(sorted, 0, img.height);
}
