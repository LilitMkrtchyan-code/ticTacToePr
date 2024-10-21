const gameInput = document.querySelector("#quantity");
const addBtn = document.querySelector("#add-button");
const gameBoard = document.querySelector("#game-board");
const restartBtn = document.querySelector("#restart-button");
const popup = document.querySelector("#popup");
const statusText = document.querySelector("#status-text");
const newGameBtn = document.querySelector("#new-game");
const popupImage = document.querySelector("#popup-image");
const winSound = document.querySelector('#win-sound');
const drawSound = document.getElementById('draw-sound');

let options = [];
let currentPlayer = "X";
let gameActive = false;

initializeGame();

function initializeGame() {
  addBtn.addEventListener("click", changeRowsAndColumns);
  restartBtn.addEventListener("click", restartGame);
  gameActive = true;
  createCells(3);
}

function createCells(quantity) {
  gameBoard.innerHTML = "";
  options = Array(quantity ** 2).fill("");

  // const cellSize = Math.floor(480 / quantity);
  const cellGap = Math.floor(25 / quantity);

  gameBoard.style.gridTemplateRows = `repeat(${quantity}, 1fr)`;
  gameBoard.style.gridTemplateColumns = `repeat(${quantity}, 1fr)`;
  gameBoard.style.gap = `${cellGap}px`;

  for (let i = 0; i < quantity ** 2; i++) {
    const cell = document.createElement("div");
    cell.setAttribute("data-index", i);
    cell.classList.add("cell");
    cell.addEventListener("click", cellClicked);
    cell.style.fontSize = `${Math.floor(320 / quantity)}px`;
    gameBoard.append(cell);
  }
}

function cellClicked() {
  const cellIndex = this.getAttribute("data-index");
  if (options[cellIndex] !== "" || !gameActive) {
    return;
  }
  updateCell(this, cellIndex);
  checkWinner(Math.sqrt(options.length));
}

function updateCell(cell, index) {
  options[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.style.color = currentPlayer === "X" ? "#007BFF" : "#FF5733";
}

function changePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function checkWinner(quantity) {
  const winConditions = [];

  for (let i = 0; i < quantity; i++) {
    let row = [];
    for (let j = 0; j < quantity; j++) {
      row.push(i * quantity + j);
    }
    winConditions.push(row);
  }

  for (j = 0; j < quantity; j++) {
    let column = [];
    for (let i = 0; i < quantity; i++) {
      column.push(i * quantity + j);
    }
    winConditions.push(column);
  }

  let diag1 = [];
  let diag2 = [];
  for (let i = 0; i < quantity; i++) {
    diag1.push(i * quantity + i);
    diag2.push(i * quantity + (quantity - 1 - i));
  }
  winConditions.push(diag1);
  winConditions.push(diag2);

  let roundMon = false;

  for (let condition of winConditions) {
    const cells = condition.map((index) => options[index]);
    if (cells.every((cell) => cell !== "" && cell === cells[0])) {
      roundMon = true;
      break;
    }
  }

  if (roundMon) {
    statusText.textContent = `${currentPlayer}'s wins!`;
    popupImage.setAttribute("src", "images/winner.png");
    popup.classList.remove("hide");
    winSound.play();
    gameActive = false;
  } else if (!options.includes("")) {
    statusText.textContent = `It's a Draw!`;
    popupImage.setAttribute("src", "images/smile.png");
    popup.classList.remove("hide");
    drawSound.play();
    gameActive = false;
  } else {
    changePlayer();
  }
}

newGameBtn.addEventListener("click", function () {
  popup.classList.add("hide");
  restartGame();
});

function changeRowsAndColumns(event) {
  event.preventDefault();
  const inputValue = parseInt(gameInput.value);
  if (inputValue >= 3 && inputValue <= 20) {
    createCells(inputValue);
  } else {
    alert("Please enter a number between 3 and 20");
  }
}

function restartGame() {
  gameInput.value = 3;
  currentPlayer = "X";
  gameActive = true;
  options = [];
  winSound.pause();
  winSound.currentTime = 0;
  drawSound.pause();
  drawSound.currentTime = 0;
  createCells(3);
}
