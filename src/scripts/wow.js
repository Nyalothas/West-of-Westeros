var WestOfWesteros = {

	init: function () {

		var

			/**
			 * Location size displayed on canvas
			 */
			dotSize

			/**
			 * Color of the location displayed on canvas
			 */
			, dotColor

			/**
			 * Minimum interval value
			 */
			, minVal

			/**
			 * Maximum interval value
			 */
			, maxVal

			, canvas

			, ctx

			, textarea

			/**
			 * Returns the matching element by id
			 */
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

			/**
			 * Tries to parse a string
			 * @param { string } jsonString string to parse
			 * @returns { object | boolean } returns the parsed object or false if it fails
			 */
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

			/**
			 * Calculates the distance between two sets of points
			 * @param { number } x1 x coordinate of the first point
			 * @param { number } y1 y coordinate of the first point
			 * @param { number } x2 x coordinate of the second point
			 * @param { number } y2 y coordinate of the second point
			 */
			, computeDistanceBetweenPoints = function (x1, y1, x2, y2) {
				return Math.sqrt((Math.pow(x2 - x1, 2)) + (Math.pow(y2 - y1, 2)))
			}

			/**
			 * Returns a random generated number
			 * @param { number } min minimum value
			 * @param { number } max maximum value
			 * @returns { number } generated number
			 */
			, generateRandomNumber = function (min = minVal, max = maxVal) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			}

			/**
			 * Returns a random 2D array of maximum 100 elements
			 * @returns { array } generated array
			 */
			, generateRandom2DArray = function () {
				let generatedArray = [];

				let arraySize = generateRandomNumber(1, 100);

				for (let i = 0; i < arraySize; i++) {
					let x = generateRandomNumber();
					let y = generateRandomNumber();
					generatedArray.push([x, y]);
				}

				return generatedArray;
			}

			/**
			 * Swaps two elements in an array
			 * @param { Array } arr 1D numeric array
			 * @param { number } indexA 1D numeric array
			 * @param { number } indexB 1D numeric array
			 */
			, swapArrayElements = function (arr, indexA, indexB) {
				let temp = arr[indexA];
				arr[indexA] = arr[indexB];
				arr[indexB] = temp;
			}

			/**
			 * Compute most optimized path?🤔
			 * Aparrently this is called a greedy algorithm😲
			 * And it also has a name - 'Nearest Neighbour'🤯
			 * We created an algorithm that exists - I see this as an absolute win
			 * No - this will generate a path, but it won't be the most optimized one(or maybe...we get lucky)
			 * @param { Array } pathArray 2D numeric array
			 * @returns { number } optimized distance
			 */
			, computeOptimizedPath = function (pathArray) {
				let pathArrayLen = pathArray.length;
				let optimizedDistance = 0;

				for (let i = 0; i < pathArrayLen; i++) {
					let smallestDistance = 9007199254740991;
					let x1 = pathArray[i][0];
					let y1 = pathArray[i][1];

					let nextIndex = i + 1;
					let pointIndex = nextIndex;

					for (let j = nextIndex; j < pathArrayLen; j++) {
						let x2 = pathArray[j][0];
						let y2 = pathArray[j][1];

						let distance = computeDistanceBetweenPoints(x1, y1, x2, y2);
						if (distance < smallestDistance) {
							pointIndex = j;
							smallestDistance = distance;
							optimizedDistance = +distance;
						}
					}

					// Switch the next index with the best computed point distance
					if (nextIndex !== pointIndex) {
						swapArrayElements(pathArray, nextIndex, pointIndex);
					}
				}

				return optimizedDistance;
			}

			/**
			 * Sets event listeners
			 */
			, registerEventListeners = function () {
				getElementById('btnCompute').addEventListener('click', compute);

				getElementById('btnGenerate').addEventListener('click', () => {
					textarea.value = JSON.stringify(generateRandom2DArray());
				});
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

			, compute = function () {
				let pathArray = tryParseJSON(textarea.value);

				if (!pathArray) {
					return;
				}

				ini = performance.now();

				clearCanvas(ctx, mapSize, mapSize);

				let optimizedDistance = computeOptimizedPath(pathArray);

				drawCoordinates(ctx, pathArray);
				drawPath(ctx, pathArray);

				end = performance.now();

				console.log('optimizedDistance', optimizedDistance);
				console.log('finalPath', pathArray);
				console.log((end - ini) + ' ms');
			}

			/**
			 * Sets some initial settings
			 */
			, initializeSettings = function () {
				dotSize = 2;
				mapSize = 500;
				minVal = 0;
				maxVal = mapSize;
				dotColor = 'white';

				canvas = getAndInitializeCanvas('foreground', mapSize, mapSize);
				ctx = getCanvas2DContext(canvas);
				createGradient(ctx, mapSize);

				textarea = getElementById('coordinates');
			}

			/**
			* Initializes and starts the application
			*/
			, initialize = function () {

				initializeSettings();

				registerEventListeners();
			}

		return {
			init: initialize()
		}
	}
}

WestOfWesteros.init();

// TD: Display stuff on second column
// foreground canvas dispaly stuff
// try another algorithm for computation