const imgFolder = "match_imgs/";
const availableImages = [
    "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg",
    "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg"
];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
let timeLimit = 0;
let timeLeft = 0;
let totalPairs = 0;
let matchedPairs = 0;
let timerInterval;

const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time-left");
const scoresList = document.getElementById("scores-list");

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startBtn").addEventListener("click", startGame);
});

function startGame() {
    const pairs = parseInt(document.getElementById("pairs").value);
    const difficulty = parseInt(document.getElementById("difficulty").value);
    totalPairs = pairs;
    matchedPairs = 0;
    score = 0;

    // Set game time
    timeLimit = pairs === 8 ? 120 : pairs === 10 ? 150 : 180;
    timeLeft = timeLimit;

    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;

    const selectedImages = shuffle(availableImages).slice(0, pairs);
    const imageSet = shuffle([...selectedImages, ...selectedImages]);

    board.innerHTML = "";
    imageSet.forEach((img, index) => {
        const card = createCard(img, index);
        board.appendChild(card);
    });

    document.querySelectorAll(".card").forEach(card => {
        card.classList.add("flipped");
    });

    setTimeout(() => {
        document.querySelectorAll(".card").forEach(card => card.classList.remove("flipped"));
        startTimer();
    }, difficulty * 1000);
}

function createCard(image, index) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = image;
    card.innerHTML = `<span>${index + 1}</span>`;
    card.addEventListener("click", () => handleCardClick(card));
    return card;
}

function handleCardClick(card) {
    if (lockBoard || card.classList.contains("matched") || card.classList.contains("flipped")) return;

    card.classList.add("flipped");
    card.innerHTML = `<img src="${imgFolder + card.dataset.image}" alt="pic" />`;

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    lockBoard = true;

    if (firstCard.dataset.image === secondCard.dataset.image) {
        score += 10;
        matchedPairs++;
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        resetCards();

        if (matchedPairs === totalPairs) {
            endGame(true);
        }
    } else {
        score -= 5;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.innerHTML = `<span>?</span>`;
            secondCard.innerHTML = `<span>?</span>`;
            resetCards();
        }, 800);
    }

    scoreDisplay.textContent = score;
}

function resetCards() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(false);
        }
    }, 1000);
}

function endGame(won) {
    clearInterval(timerInterval);
    if (!won) {
        score -= Math.max(0, timeLimit - timeLeft);
    }

    setTimeout(() => {
        const name = prompt("🎉 Game over! Enter your name:");
        if (name) {
            saveScore(name, score);
            displayLeaderboard();
        }
    }, 300);
}

function saveScore(name, score) {
    const scores = JSON.parse(localStorage.getItem("memoryLeaderboard") || "[]");
    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score);
    const top5 = scores.slice(0, 5);
    localStorage.setItem("memoryLeaderboard", JSON.stringify(top5));
}

function displayLeaderboard() {
    const scores = JSON.parse(localStorage.getItem("memoryLeaderboard") || "[]");
    scoresList.innerHTML = "";
    scores.forEach(entry => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${entry.name}</span><span>${entry.score} pts</span>`;
        scoresList.appendChild(li);
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
