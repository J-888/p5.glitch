let img;
let sorted;
let customPixels = [];

function preload() {
	img = loadImage('data/example.jpg');
}

function setup() {
	createCanvas(img.width * 2, img.height);

	sorted = createImage(img.width, img.height);
	sorted = img.get();
	sorted.loadPixels();

	loadPixelInfo(sorted);

	customPixels.sort((a, b) => a.brightness - b.brightness);

	updatePixelPosition(sorted);
	sorted.updatePixels();

	background(0);
	image(img, 0, 0);
	image(sorted, img.width, 0);
}

function loadPixelInfo(image) {
	for (let j = 0; j < image.pixels.length; j += 4) {
		let pixel = color(
			image.pixels[j],
			image.pixels[j + 1],
			image.pixels[j + 2],
			image.pixels[j + 3]
		);

		pixel.originalIndex = j;
		pixel.brightness = brightness(pixel);
		pixel.hue = hue(pixel);

		customPixels.push(pixel);
	}
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
