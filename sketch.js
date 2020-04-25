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

	customPixels = loadPixelInfo(sorted);
	//customPixels = sorted.loadPixelInfo();

	customPixels.sort((a, b) => a.brightness - b.brightness);

	updatePixelPosition(sorted);
	sorted.updatePixels();

	background(0);
	image(img, 0, 0);
	image(sorted, 0, img.height);
}

function updatePixelPosition(image) {
	for (let i = 0; i < customPixels.length; ++i) {
		let updatedPixel = customPixels[i];
		let levels = updatedPixel.levels;
		let pos = 4 * i;
		image.pixels[pos] = levels[0];
		image.pixels[pos + 1] = levels[1];
		image.pixels[pos + 2] = levels[2];
		image.pixels[pos + 3] = levels[3];
	}
}
