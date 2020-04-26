let img;
let sorted;
let customPixels = [];

function preload() {
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


	//customPixels.sort((a, b) => a.brightness - b.brightness);
	allRowSort();

	//sorted.refreshImageContent(sorted, customPixels);
	sorted.refreshImageContent(customPixels);

	background(0);
	image(img, 0, 0);
	image(sorted, 0, img.height);
}

function allRowSort(){
	for (let row = 0; row < img.height; ++row) {
		let start = row * img.width;
		let end = start + img.width;
		customPixels = partialHorizontalSort(customPixels, start, end);
	}
}
