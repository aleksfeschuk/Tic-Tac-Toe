document.addEventListener("DOMContentLoaded", createBoard);

const gameBoard = document.querySelector("#gameboard");
const infoDisplay = document.querySelector("#info");
const startButton = document.querySelector("#startGame");
const restartButton = document.querySelector("#restartGame");
const player1Input = document.querySelector("#player1");
const player2Input = document.querySelector("#player2");
const vsComputerCheckbox = document.querySelector("#vsComputer");
const difficultySelect = document.querySelector("#difficulty");
const modalMessage = document.querySelector("#modal-message");

const startCells = ['', '', '','', '', '', '', '', ''];
let boardState = [...startCells];  //Copy of the array for tracking moves

let playerSymbol = "circle";
let currentPlayer = playerSymbol;
let players = {circle: 'Player 1', cross: 'Player 2'};
let gameActive = true;


const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], //horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6] // diagonal
]

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

function startGame() {
    const player1 = player1Input.value.trim() || "Player 1";
    const player2 = player2Input.value.trim() || "Player 2";

    players = {circle: player1, cross: vsComputerCheckbox.checked ? "Computer" : player2};

    gameActive = true;
    
    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';

    infoDisplay.textContent = `${players[currentPlayer]}'s turn`;
    createBoard();

    if(vsComputerCheckbox.checked && currentPlayer === "cross") {
        setTimeout(computerMove, 1000);
    }
}


function createBoard() { //This function creates the game board 
    gameBoard.innerHTML = ""; // Clean the playing field before creating it
    boardState = [...startCells]; // Update the status of the game

    startCells.forEach((_, index) => {
        cellElement = document.createElement('div');
        cellElement.classList.add('square');
        cellElement.dataset.index = index;
        cellElement.addEventListener("click", handleClick, { once: true });
        gameBoard.append(cellElement);
    });
}


function handleClick(e) { // This function is called when you click on a cell and implements the basic logic of the game.
    if(!gameActive) return;

    const cell = e.target;
    const index = cell.dataset.index;

    placeSymbol(cell, index);

    if (gameActive && vsComputerCheckbox.checked && currentPlayer === "cross") {
        setTimeout(computerMove, 1000);
    }
}

function placeSymbol(cell, index) {
    if (boardState[index] !== "") return;

    const symbol = document.createElement('div');

    if (currentPlayer === "circle") {
        symbol.classList.add('circle');
        boardState[index] = 'circle';
        currentPlayer = 'cross';
    } else {
        symbol.classList.add('cross');
        boardState[index] = 'cross';
        currentPlayer = 'circle';
    }

    cell.append(symbol);
    checkWinner();

    if (gameActive) {
        infoDisplay.textContent = `${players[currentPlayer]}'s turn`;
    }
}

function computerMove() {
    if (!gameActive) return; // add new rows
    let bestMove;
    const difficulty = difficultySelect.value;

    if (difficulty === "easy") {
        const emptyCells = boardState.map((val, index) => val === "" ? index : -1).filter(index => index !== -1);
        bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else if (difficulty === "medium") {
        bestMove = Math.random() < 0.5 ? minimax(boardState, "cross").index : getRandomMove();
    } else {
        bestMove = minimax(boardState, "cross").index;
    }

    // Implementation of the logic for selecting a move for a computer depending on the selected level of difficulty^^


    if(bestMove !== undefined) {
        const cell = document.querySelector(`[data-index="${bestMove}"]`);
        setTimeout(() => {
            placeSymbol(cell, bestMove);
        }, 1000)
    }
}


// we look for a random move for the computer when it plays on an easy or medium difficulty level
function getRandomMove() {
    const emptyCells = boardState
        .map((val, index) => val === "" ? index : -1)
        .filter(index => index !== -1);
    return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : undefined;
}



function minimax(board, player) { //writing artificial intelligence in the game
    
    const newBoard = [...board];
    const emptyCells = newBoard.map((value, index) => value === "" ? index : -1).filter(index => index !== -1);
    const opponent = player === "cross" ? 'circle' : 'cross';

    if (checkWin(newBoard, 'cross')) return {score: 10};
    if (checkWin(newBoard, 'circle')) return {score: -10};
    if (emptyCells.length === 0) return { score: 0};

    let bestMove = {score: player === 'cross' ? -Infinity : Infinity, index: null};

    for (let index of emptyCells) {
        newBoard[index] = player;

        let result = minimax(newBoard, opponent);
        let moveScore = result.score;

        newBoard[index] = '';

        if (player === 'cross') {
            if (moveScore > bestMove.score) {
                bestMove.score = moveScore;
                bestMove.index = index;
            } 
        } else {
            if (moveScore < bestMove.score) {
                bestMove.score = moveScore;
                bestMove.index = index;
            }
        }
    }

    return bestMove;
}


function checkWin(board, player) {
    return winningCombinations.some(combination =>
        combination.every(index => board[index] === player)
    );
}

function checkWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            gameActive = false;
            updateResult('win');
            return;
        }
    }

    if(!boardState.includes("")) {
        gameActive = false;
        updateResult('draw');
    }
}



function restartGame() {
    gameActive = true;

    currentPlayer = currentPlayer === "circle" ? "cross" : "circle";

    createBoard();
    infoDisplay.textContent = `${players[currentPlayer]}'s turn`;

    document.getElementById('result').style.display = 'none';

    if (vsComputerCheckbox.checked && currentPlayer === "cross") {
        setTimeout(computerMove, 500);
    }
}

function updateResult(result) {
    const modal = document.getElementById('modal');
    const modalMessage = document.querySelector("#modal-message"); // show the result;

    if (!modal || !modalMessage) {
        console.log("Modal or ModalMessage not found!");
        return
    }


    if (result === 'win') {
        modalMessage.textContent = `${players[currentPlayer]} Wins!`;
    } else if (result === 'lose') {
        const winner = currentPlayer === 'cross' ? 'circle' : 'cross';
        modalMessage.textContent = `${players[winner]} Wins!`;
    } else {
        modalMessage.textContent = "It's a Draw!";
    }

    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.querySelector("#modal");
    modal.style.display = "none";
}

document.querySelector(".close").addEventListener("click", closeModal);
