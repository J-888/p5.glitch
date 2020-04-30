'use strict';

/**
 * Precalculates info of each pixel
 *
 * @returns {Object[]} Array with precalculated info of each pixel
 */
p5.Image.prototype.loadPixelInfo = function () {
	let customPixels = Array(this.pixels.length/4);
	let pixelInd = 0;

	/*let pixel = { // custom color for massive performance improvements		
		levels: [ 0, 0, 0, 0 ],
	};*/

	for (let j = 0; j < this.pixels.length; j += 4) {
		/*let pixel = color(
			this.pixels[j],
			this.pixels[j + 1],
			this.pixels[j + 2],
			this.pixels[j + 3]
		);*/

		// custom color for massive performance improvements
		let pixel = {
			levels: [
				this.pixels[j],
				this.pixels[j + 1],
				this.pixels[j + 2],
				this.pixels[j + 3]
			]
		}

		/*pixel.levels[0] = this.pixels[j];
		pixel.levels[1] = this.pixels[j + 1];
		pixel.levels[2] = this.pixels[j + 2];
		pixel.levels[3] = this.pixels[j + 3];*/

		//pixel.originalIndex = pixelInd;

		//pixel.brightness = brightness(pixel);	// default brightness, much slower
		//pixel.brightness = luma709(pixel.levels[0], pixel.levels[1], pixel.levels[2]);
		//pixel.brightness = luma709OptimizedToCompare(pixel.levels[0], pixel.levels[1], pixel.levels[2]);
		//pixel.brightness = luma601(pixel.levels[0], pixel.levels[1], pixel.levels[2]);
		//pixel.brightness = luma601OptimizedToCompare(pixel.levels[0], pixel.levels[1], pixel.levels[2]);
		//pixel.brightness = aproximationA(pixel.levels[0], pixel.levels[1], pixel.levels[2]);
		//pixel.brightness = aproximationAOptimizedToCompare(pixel.levels[0], pixel.levels[1], pixel.levels[2]);
		//pixel.brightness = aproximationB(pixel.levels[0], pixel.levels[1], pixel.levels[2]);
		pixel.brightness = aproximationBOptimizedToCompare(pixel.levels[0], pixel.levels[1], pixel.levels[2]);

		//pixel.hue = hue(pixel);

		customPixels[pixelInd++] = pixel;
	}

	return customPixels;
};

function makeCustomColor(r, g, b, a) {
	return {
		levels: [r, g, b, a]
	};
}

/* benchmarks at https://jsperf.com/luminance */

function luma709(r, g, b) {
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function luma709OptimizedToCompare(r, g, b) {
	return 2126 * r + 7152 * g + 722 * b;
}

function luma601(r, g, b) {
	return 0.299 * r + 0.587 * g + 0.114 * b;
}

function luma601OptimizedToCompare(r, g, b) {
	return 299 * r + 587 * g + 114 * b;
}

function aproximationA(r, g, b) {
	return (r + r + g + g + g + b) / 6;
}

function aproximationAOptimizedToCompare(r, g, b) {
	return r + r + g + g + g + b;
}

function aproximationB(r, g, b) {
	return (r + r + r + g + g + g + g + b) >> 3;
}

function aproximationBOptimizedToCompare(r, g, b) {
	return r + r + r + g + g + g + g + b;
}

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



p5.prototype.partialHorizontalSort = function (pixelInfo, start, end) {
	let sortedPart = pixelInfo
		.slice(start, end)
		.sort((a, b) => a.brightness - b.brightness);
	for (let i = 0; i < sortedPart.length; ++i) {
		pixelInfo[start + i] = sortedPart[i];
	}
	return pixelInfo;
}

p5.prototype.singleRowSort = function (image, pixelInfo, row) {
	let start = row * image.width;
	let end = start + image.width;
	return partialHorizontalSort(pixelInfo, start, end);
};

p5.prototype.allRowSort = function (image, pixelInfo) {
	let start = 0;
	let end = image.width;
	for (let row = 0; row < image.height; ++row) {
		/*customPixels = partialHorizontalSort(customPixels, start, end);
		start = end;
		end += image.width;*/

		customPixels = singleRowSort(image, customPixels, row);
	}

	return pixelInfo;
};

function roundUpToBase(x, base) {
	return Math.ceil(x / base) * base;
}

p5.prototype.allRowSortOverThreshold = function (image, pixelInfo, threshold) {
	for (let start = 0; start < pixelInfo.length; ++start) {
		let currentPixel = pixelInfo[start];
		if (currentPixel.brightness > threshold) {
			let underThreshold = true;
			let rowEnd = roundUpToBase(start + 1, image.width);
			for (
				let end = start + 1;
				underThreshold && end < pixelInfo.length && end < rowEnd;
				++end
			) {
				currentPixel = pixelInfo[end];
				if (currentPixel.brightness < threshold) {
					/*let sorted = partialHorizontalSort(pixelInfo, start, end);

					for (let i = 0; i < sorted.length; ++i) {
						pixelInfo[start + i] = sorted[i];
					}*/

					pixelInfo = partialHorizontalSort(pixelInfo, start, end);

					underThreshold = false;
					start = end + 1;
				}
			}
		}
	}

	return pixelInfo;
};

/*function rotateRight (array, n) {
	array.unshift.apply( array, array.splice( n, array.length ) );
	return array;
};

function insert(array1, array2, index) {
	array1.splice.apply(array1, [index, 0].concat(array2));
	return array1;
};*/

function spliceAndInsert(array, spliceIndex, insertIndex, n) {
	let wrapped = array.splice(spliceIndex, n);
	array.splice.apply(array, [insertIndex, 0].concat(wrapped));
	return array;
};

/*
ABCDE
FGHIJ - I at inxed 8
KLMNÑ

ABCDE
FGH   -> spliced IJ
KLMNÑ

ABCDE
IJFGH   
KLMNÑ
*/

function horizontalWrapRight (image, pixelInfo, rowStart, rowEnd, xOffset) {
	for (let currentRow = rowStart; currentRow < image.height && currentRow < rowEnd; ++currentRow) {
			let spliceIndex = (currentRow+1) * image.width - xOffset;
			let insertIndex = currentRow * image.width;
			pixelInfo = spliceAndInsert(pixelInfo, spliceIndex, insertIndex, xOffset);
	}

	return pixelInfo;
};

function horizontalWrapLeft (image, pixelInfo, rowStart, rowEnd, xOffset) {
	for (let currentRow = rowStart; currentRow < image.height && currentRow < rowEnd; ++currentRow) {
			let spliceIndex = currentRow * image.width + xOffset;
			let insertIndex = (currentRow + 1) * image.width - 1;
			pixelInfo = spliceAndInsert(pixelInfo, spliceIndex, insertIndex, xOffset);
	}

	return pixelInfo;
};

function mod(n, m) {
	return ((n % m) + m) % m;
};

p5.prototype.horizontalWrap = function (image, pixelInfo, rowStart, rowEnd, xOffset) { // helper function
	xOffset = mod(xOffset, image.width);
	if (xOffset == 0) { // no wrap
		console.log("noWrap");
		return pixelInfo;
	}
	else if (xOffset <= image.width / 2) { // left wrap requires less operations
		console.log('right wrap: ' + xOffset);
		return horizontalWrapRight(image, pixelInfo, rowStart, rowEnd, xOffset);
	}
	else { // left wrap requires less operations
		return horizontalWrapLeft(image, pixelInfo, rowStart, rowEnd, image.width - xOffset);
	}
};
