// Part A - Guessing Game

let secretNumber;
let guessesLeft = 10;
let timer;
let seconds = 0;
let audioWin = new Audio("win.mp3");
let audioLose = new Audio("lose.mp3");
let audioWrong = new Audio("wrong.mp3");

function startNewGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    guessesLeft = 10;
    seconds = 0;
    document.getElementById("guesses-left").textContent = guessesLeft;
    document.getElementById("message").textContent = "New game started! Guess a number between 1 and 100.";
    document.getElementById("guess-input").value = "";
    clearInterval(timer);
    timer = setInterval(() => {
        seconds++;
    }, 1000);
}

function handleGuess() {
    const userGuess = Number(document.getElementById("guess-input").value);
    const message = document.getElementById("message");

    if (!userGuess || userGuess < 1 || userGuess > 100) {
        message.textContent = "Please enter a number between 1 and 100.";
        return;
    }

    guessesLeft--;
    document.getElementById("guesses-left").textContent = guessesLeft;

    if (userGuess === secretNumber) {
        audioWin.play();
        message.innerHTML = `Correct! You guessed it in ${10 - guessesLeft} tries and ${seconds} seconds. Starting new game...`;
        clearInterval(timer);
        setTimeout(startNewGame, 4000);
    } else if (guessesLeft === 0) {
        audioLose.play();
        message.innerHTML = `You lost! The number was ${secretNumber}. Starting new game...`;
        clearInterval(timer);
        setTimeout(startNewGame, 4000);
    } else if (userGuess < secretNumber) {
        audioWrong.play();
        message.textContent = "Too low! Try again.";
    } else {
        audioWrong.play();
        message.textContent = "Too high! Try again.";
    }

    document.getElementById("guess-input").value = "";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("guess-btn").addEventListener("click", handleGuess);
    startNewGame();
});
