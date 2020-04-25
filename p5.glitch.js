'use strict';

p5.Image.prototype.loadPixelInfo = function () {
	let customPixels = [];
	for (let j = 0; j < this.pixels.length; j += 4) {
		let pixel = color(
			this.pixels[j],
			this.pixels[j + 1],
			this.pixels[j + 2],
			this.pixels[j + 3]
		);

		pixel.originalIndex = j;
		pixel.brightness = brightness(pixel);
		pixel.hue = hue(pixel);

		customPixels.push(pixel);
	}

	return customPixels;
};

p5.prototype.loadPixelInfo = function (image) {
	return image.loadPixelInfo();
};

//p5.prototype.registerMethod('loadPixelInfo', p5.prototype.loadPixelInfo1);
