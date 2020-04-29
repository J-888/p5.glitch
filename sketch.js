let img;
let sorted;
let customPixels = [];

function preload() {
	//img = loadImage('data/quarterrgb.png');
	//img = loadImage('data/allrgb.png');
	img = loadImage('data/example.jpg');
}

function setup() {
	createCanvas(img.width, img.height * 2);

	sorted = createImage(img.width, img.height);
	sorted = img.get();
	sorted.loadPixels();

	//customPixels = loadPixelInfo(sorted);
	customPixels = sorted.loadPixelInfo();

	//customPixels.sort((a, b) => a.brightness - b.brightness);

	//customPixels = allRowSort(sorted, customPixels);

	customPixels = allRowSortOverThreshold(sorted, customPixels, 600);

	//sorted.refreshImageContent(sorted, customPixels);
	sorted.refreshImageContent(customPixels);

	background(0);
	image(img, 0, 0);
	image(sorted, 0, img.height);
}
