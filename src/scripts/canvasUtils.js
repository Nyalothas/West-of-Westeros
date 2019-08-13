var CanvasUtils = CanvasUtils || {};

CanvasUtils = {

	init: function () {

		var


			/**
			 * Returns the matching element by id
			 * @param {string} id the id of the element
			 */
			getElementById = function (id) {
				return document.getElementById(id);
			}

			/**
			 * Gets the canvas DOM reference and sets it's size
			 * @param {string} name the id of the canvas
			 * @param {number} width the width of the canvas
			 * @param {number} height the height of the canvas
			 */
			, getAndInitializeCanvas = function (name, width, height) {
				let canvas = getElementById(name);

				canvas.width = width;
				canvas.height = height;

				return canvas;
			}

			/**
			* Returns the 2d context of a canvas
			* @param { object } canvas
			*/
			, getCanvas2DContext = function (canvas) {
				return canvas.getContext('2d');
			}

			/**
			 * Creates a gradient of a specific size and assigns it to the canvas context
			 * @param { object } ctx canvas 2d context
			 * @param { number } size width and height of the gradient
			 */
			, createGradient = function (ctx, size) {
				let gradient = ctx.createLinearGradient(0, 0, size, size);
				gradient.addColorStop('0', 'magenta');
				gradient.addColorStop('0.5', 'cyan');
				gradient.addColorStop('1.0', 'red');
				ctx.strokeStyle = gradient;
			}

			/**
			 * Clears the canvas
			 * @param { object } ctx canvas 2d context
			 * @param { number } width width of the canvas
			 * @param { number } height height of the canvas
			 */
			, clearCanvas = function (ctx, width, height) {
				ctx.clearRect(0, 0, width, height);
			}

			/**
			 * Draws a rectangle on the canvas at the specified coordinate
			 * @param { object } ctx canvas 2d context
			 * @param { number } x x coordinate
			 * @param { number } y y coordinate
			 * @param { string } color the color in which the rectangle will be drawn
			 * @param { number } size the size of the square
			 */
			, createRectangle = function (ctx, x, y, color = dotColor, size = dotSize) {
				ctx.fillStyle = color;
				ctx.fillRect(x, y, size, size);
			}

			/**
			 * Draws a line between two sets of coordinates
			 * @param { object } ctx canvas 2D context
			 * @param { array } start 1D numeric array
			 * @param { array } end 1D numeric array
			 */
			, drawLine = function (ctx, start, end) {
				ctx.beginPath();
				ctx.moveTo(start[0], start[1]);
				ctx.lineTo(end[0], end[1]);
				ctx.stroke();
			}

			/**
			 * Draws a circle on the canvas
			 * @param { object } ctx canvas 2D context
			 * @param { number } x x coordinate
			 * @param { number } y y coordinate
			 */
			, drawCircle = function (ctx, x, y) {
				ctx.beginPath();
				ctx.arc(x, y, 2, 0, 2 * Math.PI);
				ctx.stroke();
			}

			/**
			 * Draws a path between an array of points
			 * @param { object } ctx canvas 2D context
			 * @param { Array } pointsArray 1D numeric array
			 */
			, drawPath = function (ctx, pointsArray) {
				let destinations = pointsArray.length - 1;

				for (let i = 0; i < destinations; i++) {
					let start = pointsArray[i];
					let end = pointsArray[i + 1];
					drawLine(ctx, start, end);
				}
			}

			/**
			* Draws points on a canvas
			* @param { object } ctx canvas 2D context
			* @param { Array } arr 1D numeric array
			*/
			, drawCoordinates = function (ctx, arr) {
				let destinations = arr.length;
				ctx.fillStyle = dotColor;
				for (let i = 0; i < destinations; i++) {
					let x = arr[i][0];
					let y = arr[i][1];
					createRectangle(ctx, x, y);
				}
			}

		return {
			getAndInitializeCanvas: getAndInitializeCanvas,
			getCanvas2DContext: getCanvas2DContext
		}
	}
}

CanvasUtils = CanvasUtils.init();