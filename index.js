/* Grabs element from the Html */
const startButton = document.getElementById("startbutton");
const startSection = document.getElementById("Startgame");
const gameSection = document.getElementById("Game");
const board = document.getElementById("board");
const cells = document.querySelectorAll(".Cell");
const textDisplay = document.getElementById("text");
const scoreX = document.getElementById("ScoreX");
const scoreO = document.getElementById("ScoreO");
const scoreD = document.getElementById("ScoreD");
const restartBtn = document.getElementById("Restart");
const resetBtn = document.getElementById("Reset");
const singleBtn = document.getElementById("singleplayer");
const twoBtn = document.getElementById("Twoplayer");

let currentPlayer = "X";
let gameActive = false;
let gameMode = null; // "single" or "two"
let boardState = ["", "", "", "", "", "", "", "", ""];
let scores = { X: 0, O: 0, D: 0 };
/* The winning combinations */
const winningCombos = [
  [0, 1, 2], [3, 4, 5],[6, 7, 8],
  [0, 3, 6],[1, 4, 7],[2, 5, 8],
  [0, 4, 8],[2, 4, 6]
];
/* Event listener for the start button */
startButton.addEventListener("click", () => {
  startSection.style.display = "none";
  gameSection.classList.add("show");
});
/* Game mode event listener */
singleBtn.addEventListener("click", () => {
  gameMode = "single";
  startGame();
});
twoBtn.addEventListener("click", () => {
  gameMode = "two";
  startGame();
});
/* Event listener for restart and reset buttons */
restartBtn.addEventListener("click", restartRound);
resetBtn.addEventListener("click", resetAll);
/* Event listeners for each cell */
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handleCellClick(index));
});

/* displays game mode and starts the game by enabling clicking on cells */
function startGame() {
  textDisplay.textContent = `Mode: ${gameMode === "single" ? "Single Player" : "Two Player"}. Player X starts!`;
  gameActive = true;
  boardState = ["", "", "", "", "", "", "", "", ""];
  cells.forEach(cell => {
    cell.textContent = "";
    cell.style.pointerEvents = "auto";
  });
  currentPlayer = "X";
}
/* If cell is empty it marks with the current player's symbol */
function handleCellClick(index) {
if (!gameActive || boardState[index] !== "") return;

  boardState[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
/* It displays current winner and increases their score */
if (checkWinner(currentPlayer)) {
    textDisplay.textContent = `🎉 Player ${currentPlayer} wins!`;
    scores[currentPlayer]++;
    updateScoreboard();
    gameActive = false;
    highlightWinningCells(currentPlayer);
    return;
}
/* check for draw */
if (boardState.every(cell => cell !== "")) {
    textDisplay.textContent = "😐 It's a draw!";
    scores.D++;
    updateScoreboard();
    gameActive = false;
    return;
}
/* Switches turn */
currentPlayer = currentPlayer === "X" ? "O" : "X";
textDisplay.textContent = `Player ${currentPlayer}'s turn`;

if (gameMode === "single" && currentPlayer === "O" && gameActive) {
    setTimeout(aiMove, 600);
}
}
/* simulates the computer's move */
function aiMove() {
  let emptyIndices = boardState
    .map((val, i) => (val === "" ? i : null))
    .filter(i => i !== null);

if (emptyIndices.length === 0) return;

 const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
 handleCellClick(randomIndex);
}
/* Checks the winning combination */
function checkWinner(player) {
  return winningCombos.some(combo =>
    combo.every(index => boardState[index] === player)
 );
}

/* Highlights the winning cells */
function highlightWinningCells(player) {
  winningCombos.forEach(combo => {
    if (combo.every(index => boardState[index] === player)) {
      combo.forEach(index => {
        cells[index].style.boxShadow = "0 0 20px 4px rgba(168,85,247,0.7)";
        cells[index].style.color = "#a855f7";
      });
    }
  });
}
/* Updates scoreboard */
function updateScoreboard() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreD.textContent = scores.D;
}
/* Dark Mode */
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  // Switch button text depending on mode
  if (document.body.classList.contains("light-mode")) {
    themeToggle.textContent = "🌙 Dark Mode";
  } else {
    themeToggle.textContent = "🌞 Light Mode";
  }
});

/* Restarts the game by clearing the board but keeps the score */
function restartRound() {
  textDisplay.textContent = `New round! Player X starts.`;
  gameActive = true;
  boardState = ["", "", "", "", "", "", "", "", ""];
  cells.forEach(cell => {
    cell.textContent = "";
    cell.style.pointerEvents = "auto";
    cell.style.boxShadow = "none";
    cell.style.color = "#d8b4fe";
  });
  currentPlayer = "X";
}
/* Resets the score back to 0 and clear the board */
function resetAll() {
  scores = { X: 0, O: 0, D: 0 };
  updateScoreboard();
  restartRound();
  textDisplay.textContent = "Choose a mode to start";
  gameActive = false;
  gameMode = null;
}
