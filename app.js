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