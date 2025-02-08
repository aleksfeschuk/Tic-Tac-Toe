document.addEventListener("DOMContentLoaded", createBoard);

const gameBoard = document.querySelector("#gameboard");
const infoDisplay = document.querySelector("#info");
const startButton = document.querySelector("#startGame");
const restartButton = document.querySelector("#restartGame");
const player1Input = document.querySelector("#player1");
const player2Input = document.querySelector("#player2");
const vsComputerCheckbox = document.querySelector("#vsComputer");

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



