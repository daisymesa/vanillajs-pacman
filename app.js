document.addEventListener("DOMContentLoaded", () => {
	const grid = document.querySelector(".grid");
	const showScore = document.getElementById("score");
	const width = 28; // 28 * 28 = 784 squares
	let score = 0;
	let totalDots = 0;

	// GAME MAP LEGEND
	// 0 = dot
	// 1 = wall
	// 2 = ghost-home
	// 3 = power-pellet

	// prettier-ignore
	const map = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,0,1,1,1,2,2,1,1,1,0,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,0,1,2,2,2,2,2,2,1,0,1,1,0,1,1,1,1,1,1,
    0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,
    1,1,1,1,1,1,0,1,1,0,1,2,2,2,2,2,2,1,0,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
]

	// ------------------- 1. GAME MAP SET UP -------------------
	// empty array to add all the game squares
	const squares = [];

	// draw the grid and render it
	const createMap = () => {
		for (let i = 0; i < map.length; i++) {
			const square = document.createElement("div"); // create squares
			grid.appendChild(square); // put squares in grid
			squares.push(square); // push created squares into a new empty array

			// add map to the board after function is executed
			if (map[i] === 0) {
				squares[i].classList.add("dot");
				totalDots++; // tally up total dots
			} else if (map[i] === 1) {
				squares[i].classList.add("wall");
			} else if (map[i] === 2) {
				squares[i].classList.add("ghost-home");
			} else if (map[i] === 3) {
				squares[i].classList.add("power-pellet");
			}
		}
	};

	createMap();

	// ------------------- 2. PAC MAN SET UP -------------------
	// starting position of pacman
	let pacIdx = 490;
	squares[pacIdx].classList.add("pac-man");

	// move pac-man
	const movePacman = (e) => {
		squares[pacIdx].classList.remove("pac-man");
		direction = e.key;

		// DIRECTIONS
		// left: index - 1
		// right: index + 1
		// up: width - 1
		// down:

		// prettier-ignore
		switch (direction) {
			// LEFT ARROW KEYCODE
			case "ArrowLeft":
				if (
					pacIdx % width !== 0 &&
					!squares[pacIdx - 1].classList.contains("wall") &&
					!squares[pacIdx - 1].classList.contains("ghost-home")
				)
					pacIdx -= 1;
				// check if pacman is in the the left exit
				if (pacIdx - 1 === 363) {
					pacIdx = 391;
				}
				break;

			// UP ARROW KEYCODE
			case "ArrowUp":
				if (
					pacIdx - width >= 0 &&
					!squares[pacIdx - width].classList.contains("wall") &&
					!squares[pacIdx - width].classList.contains("ghost-home")
				)
					pacIdx -= width;
				break;

			// RIGHT ARROW KEYCODE
			case "ArrowRight":
				if (
					(pacIdx % width) < (width - 1) &&
					!squares[pacIdx + 1].classList.contains("wall") &&
					!squares[pacIdx + 1].classList.contains("ghost-home")
				)
					pacIdx += 1;
				// check if pacman is in the right exit
				if (pacIdx + 1 === 392) {
					pacIdx = 364;
				}
				break;

			// DOWN ARROW KEYCODE
			case "ArrowDown":
				if (
					pacIdx + width < width * width &&
					!squares[pacIdx + width].classList.contains("wall") &&
					!squares[pacIdx + width].classList.contains("ghost-home")
				)
					pacIdx += width;
				break;
		}

		squares[pacIdx].classList.add("pac-man");

		ateDot();
		atePellet();
		gameOver();
		gameWin();
	};

	document.addEventListener("keyup", movePacman);

	// what happens if pacman eats a dot
	const ateDot = () => {
		if (squares[pacIdx].classList.contains("dot")) {
			score += 10;
			totalDots--;
			squares[pacIdx].classList.remove("dot");
			showScore.innerHTML = score;
		}
	};

	// what happens when you eat a power pellet
	const atePellet = () => {
		if (squares[pacIdx].classList.contains("power-pellet")) {
			score += 50;
			ghosts.forEach((ghost) => (ghost.isScared = true));
			// ghosts are scared for 10 secs
			setTimeout(unScaredGhosts, 10000);
			// remove power pellet class so square looks empty
			squares[pacIdx].classList.remove("power-pellet");
		}
	};

	// ------------------- 3. GHOSTS SET UP -------------------
	// create Ghost template
	class Ghost {
		constructor(className, startIdx, speed) {
			this.className = className;
			this.startIdx = startIdx;
			this.speed = speed;
			this.ghostIdx = startIdx;
			this.timerId = NaN;
			this.isScared = false;
		}
	}

	// create four ghosts
	ghosts = [
		// className, startIdx, speed
		new Ghost("blinky", 347, 150),
		new Ghost("pinky", 348, 250),
		new Ghost("inky", 349, 250),
		new Ghost("clyde", 350, 400),
	];

	// add ghosts onto map
	ghosts.forEach((ghost) => {
		console.log(ghost.className);
		squares[ghost.ghostIdx].classList.add(ghost.className);
		squares[ghost.ghostIdx].classList.add("ghost");
	});

	// write function to move the ghosts
	const moveGhost = (ghost) => {
		const directions = [-1, +1, width, -width]; // possible directions ghost can travel

		let direction =
			directions[Math.floor(Math.random() * directions.length)]; // select a random direction
		console.log(direction);

		// ghost will use its unique timer id to perform items below repeatedly
		ghost.timerId = setInterval(function () {
			// if the next square your ghost is going to go in does NOT contain a wall + a ghost:
			//// you can go there, remove ghost classNames from old square,
			//// change the ghost's curr index to the new square, add ghost classNames to new square
			// else find a new direction to try!
			// prettier-ignore
			if (
                !squares[ghost.ghostIdx + direction].classList.contains("ghost") &&
                !squares[ghost.ghostIdx + direction].classList.contains("wall")
			) {
                squares[ghost.ghostIdx].classList.remove(ghost.className); 
                squares[ghost.ghostIdx].classList.remove("ghost", "scared-ghost");
				ghost.ghostIdx += direction;
				squares[ghost.ghostIdx].classList.add(ghost.className, "ghost");
			} else {
				direction =
					directions[Math.floor(Math.random() * directions.length)];
			}

			// if ghost is scared is true, change class name/styles
			if (ghost.isScared) {
				squares[ghost.ghostIdx].classList.add("scared-ghost");
			}

			// if ghost is scared and pacman eats it, remove ghost classes from square
			// move ghost back to the ghosts' home
			if (
				ghost.isScared &&
				squares[ghost.ghostIdx].classList.contains("pac-man")
			) {
				squares[ghost.ghostIdx].classList.remove(
					ghost.className,
					"ghost",
					"scared-ghost"
				);
				ghost.ghostIdx = ghost.startIdx;
				score += 200;
				squares[ghost.ghost].classList.add(ghost.className, "ghost");
			}
			gameOver();
		}, ghost.speed); // repeat at the unique speed for each ghost
	};

	// move ghosts randomly
	ghosts.forEach((ghost) => moveGhost(ghost));

	// make the ghosts stop appearing blue when no longer scared
	const unScaredGhosts = () => {
		ghosts.forEach((ghost) => (ghost.isScared = false));
	};

	// ------------------- 4. GAME OVER / WIN -------------------
	// check for a game over
	function gameOver() {
		if (
			squares[pacIdx].classList.contains("ghost") &&
			!squares[pacIdx].classList.contains("scared-ghost")
		) {
			ghosts.forEach((ghost) => clearInterval(ghost.timerId)); // ghosts stop moving
			document.removeEventListener("keyup", movePacman); // pacman can't move anymore
			squares[pacIdx].classList.remove("pac-man"); // remove pacman from board
			showScore.innerHTML = "GAME OVER!"; // change score display to game over
		}
	}

	// check for a win
	function gameWin() {
		if (totalDots === 0) {
			ghosts.forEach((ghost) => clearInterval(ghost.timerId));
			document.removeEventListener("keyup", movePacman);
			showScore.innerHTML = "YOU WON!";
		}
	}
});
