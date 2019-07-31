var WestOfWesteros = {

	init: function () {

		var

			dotSize = 2

			, minVal = 0

			, maxVal = 500

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
				let destinations = coordinatesArray.length - 1;

				for (let i = 0; i < destinations; i++) {
					let start = coordinatesArray[i];
					let end = coordinatesArray[i + 1];
					drawLine(ctx, start, end);
				}
			}

			, computeDistanceBetweenPoints = function (x1, y1, x2, y2) {
				return Math.sqrt((Math.pow(x2 - x1, 2)) + (Math.pow(y2 - y1, 2)))
			}

			, generateRandomNumber = function (min = minVal, max = maxVal) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			}

			, generateRandomBiArray = function () {
				let generatedArray = [];

				let arraySize = generateRandomNumber(1, 100);

				for (let i = 0; i < arraySize; i++) {
					let x = generateRandomNumber();
					let y = generateRandomNumber();
					generatedArray.push([x, y]);
				}

				return generatedArray;
			}

			, drawCoordinates = function (coordinatesArray) {
				let destinations = coordinatesArray.length;

				for (let i = 0; i < destinations; i++) {
					let x = coordinatesArray[i][0];
					let y = coordinatesArray[i][1];
					createRectangle(ctx, x, y);
				}
			}

			, swapArrayElements = function (arr, indexA, indexB) {
				let temp = arr[indexA];
				arr[indexA] = arr[indexB];
				arr[indexB] = temp;
			}

			, compute = function () {
				let pathArray = tryParseJSON(textarea.value);

				if (!pathArray) {
					return;
				}
				ini = performance.now();

				ctx.clearRect(0, 0, canvas.width, canvas.height);

				let pathArrayLen = pathArray.length;
				/* 				let distances = [];
								for (let i = 0; i < pathArrayLen; i++) {
									let x1 = pathArray[i][0];
									let x2 = pathArray[i + 1][0];
									let y1 = pathArray[i][1];
									let y2 = pathArray[i + 1][1];
									distances.push({
										distance: computeDistanceBetweenPoints(x1, y1, x2, y2),
										c1: pathArray[i],
										c2: pathArray[i + 1]
									});
								} */

				let smallestDistance = 9999;
				for (let i = 0; i < pathArrayLen; i++) {
					let x1 = pathArray[i][0];
					let y1 = pathArray[i][1];

					let coord = i;

					for (let j = i + 1; j < pathArrayLen; j++) {
						let x2 = pathArray[j][0];
						let y2 = pathArray[j][1];

						let d = computeDistanceBetweenPoints(x1, y1, x2, y2);
						if (d < smallestDistance) {
							coord = j;
							smallestDistance = d;
						}
					}

					// switch places in pathArray second place with coord
					if (i !== coord - 1) {
						swapArrayElements(pathArray, coord, i);
						console.log(`${coord} , ${i} : ${smallestDistance}`);
					}

				}

				//d2.sort((d1, d2) => d1.distance - d2.distance);

				//console.log(d2);

				console.log(pathArray);

				drawCoordinates(pathArray);

				// final step
				drawPath(pathArray);

				end = performance.now();

				console.log((end - ini) + " ms");
			}

			, registerComputeEvent = function () {
				let btnCompute = getElementById('btnCompute');
				btnCompute.addEventListener('click', compute);
			}

			/**
			 * Gets the canvas DOM reference and sets it's size
			 * @param {string} name the id of the canvas
			 */
			, getAndInitializeCanvas = function (name) {
				let canvas = getElementById(name);

				canvas.width = 500;
				canvas.height = 500;

				return canvas;
			}

			/**
			* Returns the 2d context of a canvas
			* @param { object } canvas
			*/
			, getCanvas2DContext = function (canvas) {
				return canvas.getContext('2d');
			}

			, initialize = function () {

				canvas = getAndInitializeCanvas('foreground');
				ctx = getCanvas2DContext(canvas);

				createGradient();

				registerComputeEvent();

				getElementById('btnGenerate').addEventListener('click', () => {
					textarea.value = JSON.stringify(generateRandomBiArray());
				});
			}

		return {
			init: initialize()
		}
	}
}

WestOfWesteros.init();