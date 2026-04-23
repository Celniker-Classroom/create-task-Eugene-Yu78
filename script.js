// variables
let answer = 0;
let rand1 = 0;
let rand2 = 0;
let scores = [];
let totalGames = 0;
let totalScore = 0;
let totalRounds = 0;
let score = 0;
let giveups = 0;
let wrong = 0;
let maxValue = 0;
let gameTimer = null;
let countdownTimer = null;
let secondsLeft = 0;

function startGame() {
    let maxValueElement = document.getElementById("maxValue");
    let guess = parseInt(maxValueElement.value);
    if (isNaN(guess) || guess <= 0) {
        document.getElementById("msg").textContent = "Please enter a valid positive number.";
        return;
    }
    maxValue = guess;
    score = 0;
    giveups = 0;
    wrong = 0;
    totalRounds = 0;
    secondsLeft = 60;
    document.getElementById("msg").textContent = "Solve as many questions as possible in 1 minute!!!";
    document.getElementById("enterBtn").disabled = false;
    document.getElementById("giveUpBtn").disabled = false;
    document.getElementById("playBtn").disabled = true;
    let levelRadios = document.getElementsByName("level");
    for (let i = 0; i < levelRadios.length; i++) {
        levelRadios[i].disabled = true;
    }
    // Github ai help with the timer. I asked it how to make a countdown timer.
    if (gameTimer) {
        clearTimeout(gameTimer);
    }
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }
    gameTimer = setTimeout(endGame, 60000);
    countdownTimer = setInterval(() => {
        secondsLeft -= 1;
        document.getElementById("timeRemaining").textContent = `Time Remaining: ${secondsLeft}s`;
        if (secondsLeft <= 0) {
            clearInterval(countdownTimer);
        }
    }, 1000);
    document.getElementById("timeRemaining").textContent = `Time Remaining: ${secondsLeft}s`;
    updateStats();
    generateQuestion();
}
function endGame() {
    if (gameTimer) {
        clearTimeout(gameTimer);
        gameTimer = null;
    }
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
    totalGames += 1;
    totalScore += score;
    updateLeaderboard();
    document.getElementById("msg").textContent = `Time's up! Score: ${score}, Incorrect: ${wrong}, Gave up: ${giveups}`;
    document.getElementById("enterBtn").disabled = true;
    document.getElementById("giveUpBtn").disabled = true;
    document.getElementById("playBtn").disabled = false;

    let levelRadios = document.getElementsByName("level");
    for (let i = 0; i < levelRadios.length; i++) {
        levelRadios[i].disabled = false;
    }
    updateStats();
}
function generateQuestion() {
    let radios = document.getElementsByName("level");
    if (radios[0].checked) {
        addition();
    } else if (radios[1].checked) {
        subtraction();
    } else if (radios[2].checked) {
        multiplication();
    } else if (radios[3].checked) {
        division();
    } else {
        addition();
    }
}
function addition() {
    rand1 = Math.floor(Math.random() * maxValue) + 1;
    rand2 = Math.floor(Math.random() * maxValue) + 1;
    answer = rand1 + rand2;
    document.getElementById("question").textContent = `Question: ${rand1} + ${rand2} =`;
}
function subtraction() {
    rand1 = Math.floor(Math.random() * maxValue) + 1;
    rand2 = Math.floor(Math.random() * maxValue) + 1;
    if (rand1 < rand2) [rand1, rand2] = [rand2, rand1];
    answer = rand1 - rand2;
    document.getElementById("question").textContent = `Question: ${rand1} - ${rand2} =`;
}
function multiplication() {
    rand1 = Math.floor(Math.random() * maxValue) + 1;
    rand2 = Math.floor(Math.random() * maxValue) + 1;
    answer = rand1 * rand2;
    document.getElementById("question").textContent = `Question: ${rand1} × ${rand2} =`;
}
function division() {
    rand2 = Math.floor(Math.random() * maxValue) + 1;
    answer = Math.floor(Math.random() * maxValue) + 1;
    rand1 = rand2 * answer;
    if (rand1 > maxValue) {
        division();
        return;
    }
    document.getElementById("question").textContent = `Question: ${rand1} ÷ ${rand2} =`;
}
function updateLeaderboard() {
    scores.push(score);
    scores.sort((a, b) => b - a);
    //github ai help with this part, i asked it how to push the top 3 scores to the leaderboard
    if (scores.length > 3) {
        scores = scores.slice(0, 3);
    }
    const leaderboardItems = document.querySelectorAll("[data-leaderboard-item]");
    leaderboardItems.forEach((item, index) => {
        item.textContent = scores[index] !== undefined ? scores[index] : "—";
    });
}
function updateStats() {
    const avg = totalGames > 0 ? (totalScore / totalGames).toFixed(2) : "0";
    document.getElementById("avgScore").textContent = `Average Score: ${avg}`;
    document.getElementById("totalRounds").textContent = `Total Rounds: ${totalRounds}`;
    document.getElementById("wrong").textContent = `Incorrect Answers: ${wrong}`;
}
// guess
document.getElementById("enterBtn").addEventListener("click", function() {
    let input = document.getElementById("guess");
    let guess = parseInt(input.value);
    if (isNaN(guess)) {
        document.getElementById("msg").textContent = "Please enter a valid number.";
        return;
    }
    totalRounds++;
    if (guess === answer) {
        score++;
        document.getElementById("msg").textContent = "Correct! Next question.";
    } else {
        wrong++;
        document.getElementById("msg").textContent = `Wrong! Answer was ${answer}. Next question.`;
    }
    input.value = "";
    generateQuestion();
    updateStats();
});
// give up
document.getElementById("giveUpBtn").addEventListener("click", function() {
    giveups++;
    totalRounds++;
    document.getElementById("msg").textContent = `Gave up! Answer was ${answer}. Next question.`;
    document.getElementById("guess").value = "";
    generateQuestion();
    updateStats();
});
// play
document.getElementById("playBtn").addEventListener("click", function() {
    document.getElementById("guess").value = "";
    startGame();
});
