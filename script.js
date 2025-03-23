const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");

let currentPlayer = "X"; // Human is X, AI is O
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winningConditions = [
	[0, 1, 2], // Top row
	[3, 4, 5], // Middle row
	[6, 7, 8], // Bottom row
	[0, 3, 6], // Left column
	[1, 4, 7], // Middle column
	[2, 5, 8], // Right column
	[0, 4, 8], // Diagonal
	[2, 4, 6], // Diagonal
];

// Handle cell click
function handleCellClick(event) {
	const clickedCell = event.target;
	const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

	if (gameState[clickedCellIndex] !== "" || !gameActive) {
		return;
	}

	// Human makes a move
	gameState[clickedCellIndex] = currentPlayer;
	clickedCell.textContent = currentPlayer;

	checkForWinner();

	// Switch to AI's turn if the game is still active
	if (gameActive && currentPlayer === "X") {
		currentPlayer = "O";
		statusText.textContent = "AI is thinking...";
		setTimeout(() => {
			aiMove();
			checkForWinner();
		}, 500); // Add a small delay for realism
	}
}

// AI makes a move using the Minimax algorithm
function aiMove() {
	let bestScore = -Infinity;
	let bestMove;

	for (let i = 0; i < gameState.length; i++) {
		if (gameState[i] === "") {
			gameState[i] = "O"; // AI is O
			let score = minimax(gameState, 0, false);
			gameState[i] = ""; // Undo the move
			if (score > bestScore) {
				bestScore = score;
				bestMove = i;
			}
		}
	}

	gameState[bestMove] = "O";
	cells[bestMove].textContent = "O";
	currentPlayer = "X"; // Switch back to human
	statusText.textContent = "Player X's turn";
}

// Minimax algorithm
function minimax(board, depth, isMaximizing) {
	const scores = {
		X: -1,
		O: 1,
		tie: 0,
	};

	const result = checkWinner(board);
	if (result !== null) {
		return scores[result];
	}

	if (isMaximizing) {
		let bestScore = -Infinity;
		for (let i = 0; i < board.length; i++) {
			if (board[i] === "") {
				board[i] = "O";
				let score = minimax(board, depth + 1, false);
				board[i] = "";
				bestScore = Math.max(score, bestScore);
			}
		}
		return bestScore;
	} else {
		let bestScore = Infinity;
		for (let i = 0; i < board.length; i++) {
			if (board[i] === "") {
				board[i] = "X";
				let score = minimax(board, depth + 1, true);
				board[i] = "";
				bestScore = Math.min(score, bestScore);
			}
		}
		return bestScore;
	}
}

// Check for a winner or tie
function checkForWinner() {
	const result = checkWinner(gameState);
	if (result === "X") {
		statusText.textContent = "Player X wins! 🎉";
		gameActive = false;
	} else if (result === "O") {
		statusText.textContent = "AI wins! 🤖";
		gameActive = false;
	} else if (!gameState.includes("")) {
		statusText.textContent = "It's a tie! 🤝";
		gameActive = false;
	}
}

// Check if there's a winner
function checkWinner(board) {
	for (let i = 0; i < winningConditions.length; i++) {
		const [a, b, c] = winningConditions[i];
		if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
			return board[a]; // Return the winning player (X or O)
		}
	}
	if (!board.includes("")) {
		return "tie"; // Return tie if the board is full
	}
	return null; // No winner yet
}

// Reset the game
function resetGame() {
	gameState = ["", "", "", "", "", "", "", "", ""];
	gameActive = true;
	currentPlayer = "X";
	statusText.textContent = "Player X's turn";
	cells.forEach((cell) => (cell.textContent = ""));
}

// Event listeners
cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);
