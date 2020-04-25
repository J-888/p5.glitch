'use strict';

/**
 * Precalculates info of each pixel
 *
 * @returns {Object[]} Array with precalculated info of each pixel
 */
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

/**
 * Precalculates info of each pixel
 *
 * @param {p5.Image} image target image
 * @returns {Object[]} Array with precalculated info of each pixel
 */
p5.prototype.loadPixelInfo = function (image) {
	return image.loadPixelInfo();
};

/**
 * Applies the changes to a image
 *
 * @param {Object[]} pixelInfo Array with precalculated info of each pixel
 */
p5.Image.prototype.refreshImageContent = function (pixelInfo) {
	for (let i = 0; i < customPixels.length; ++i) {
		let updatedPixel = customPixels[i];
		let levels = updatedPixel.levels;
		let pos = 4 * i;
		this.pixels[pos] = levels[0];
		this.pixels[pos + 1] = levels[1];
		this.pixels[pos + 2] = levels[2];
		this.pixels[pos + 3] = levels[3];
	}

	this.updatePixels();
};

/**
 * Applies the changes to a image
 *
 * @param {p5.Image} image target image
 * @param {Object[]} pixelInfo Array with precalculated info of each pixel
 */
p5.prototype.refreshImageContent = function (image, pixelInfo) {
	image.refreshImageContent(pixelInfo);
};
