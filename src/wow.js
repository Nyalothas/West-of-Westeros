var WestOfWesteros = {

	init: function () {

		var

			dotSize = 2

			, dotColor = 'white'

			, canvas

			, ctx

			, gradient

			, getElementById = function (id) {
				return document.getElementById(id);
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

			, createGradient = function () {
				gradient = ctx.createLinearGradient(0, 0, 500, 500);
				gradient.addColorStop("0", "magenta");
				gradient.addColorStop("0.5", "cyan");
				gradient.addColorStop("1.0", "red");
			}

			/**
			 * Draws a line between two sets of coordinates
			 */
			, drawLine = function (ctx, start, end) {
				ctx.strokeStyle = gradient;
				ctx.beginPath();
				ctx.moveTo(start[0], start[1]);
				ctx.lineTo(end[0], end[1]);
				ctx.stroke();
			}

			, textarea = getElementById('coordinates')

			, tryParseJSON = function (jsonString) {
				try {
					let o = JSON.parse(jsonString);

					// TD: implement additional checks for inner arrays
					if (o && Array.isArray(o) && o.length !== 0) {
						return o;
					}
				}
				catch (e) { }

				return false;
			}

			, drawPath = function (coordinatesArray) {
				let destinations = coordinatesArray.length;

				for (let i = 0, j = 1; i < destinations; i++ , j++) {
					let start = coordinatesArray[i];
					let end = coordinatesArray[j];
					if (!end) {
						end = start;
					}
					drawLine(ctx, start, end);
				}
			}

			, drawCoordinates = function (coordinatesArray) {
				let destinations = coordinatesArray.length;

				for (let i = 0; i < destinations; i++) {
					let x = coordinatesArray[i][0];
					let y = coordinatesArray[i][1];
					createRectangle(ctx, x, y);
				}
			}

			, compute = function () {
				let pathArray = tryParseJSON(textarea.value);

				if (!pathArray) {
					return;
				}

				ctx.clearRect(0, 0, canvas.width, canvas.height);

				console.log(pathArray);

				drawCoordinates(pathArray);

				// final step
				drawPath(pathArray);
			}

			, registerComputeEvent = function () {
				let btnCompute = getElementById('btnCompute');
				btnCompute.addEventListener('click', compute);
			}

			, initialize = function () {

				canvas = getElementById('foreground');
				ctx = canvas.getContext('2d');
			
				createGradient();

				registerComputeEvent();
			}

		return {
			init: initialize()
		}
	}
}

WestOfWesteros.init();