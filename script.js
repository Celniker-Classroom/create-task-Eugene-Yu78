// variables
let answer = 0;
let rand1 = 0;
let rand2 = 0;
let scores = [];
let totalRounds = 0;
let roundStartMs = 0;
let score = 0;
let giveups = 0;
let wrong = 0;
let maxValue = 0; 
let timer; 

// level selection
function levelSelect() {
    let maxValueElement = document.getElementById("maxValue");
    let guess = parseInt(maxValueElement.value);
    if (isNaN(guess) || guess <= 0) {
        document.getElementById("msg").textContent = "Please enter a valid positive number.";
        return;
    } else {
        maxValue = guess; 
        document.getElementById("msg").textContent = "Solve as many questions as possible in 1 minute!!!";
    }
    let radios = document.getElementsByName("level");
    if (radios[0].checked) {
        addition();
    } else if (radios[1].checked) {
        subtraction();
    } else if (radios[2].checked) {
        multiplication();
    } else if (radios[3].checked) {
        division();
    }
    // Start timer
    roundStartMs = Date.now();
    timer = setTimeout(() => {
        document.getElementById("msg").textContent = `Time's up! Score: ${score}, Incorrect/Giveups: ${wrong}/${giveups}`;
        document.getElementById("enterBtn").disabled = true;
        document.getElementById("giveUpBtn").disabled = true;
        document.getElementById("playBtn").disabled = false;
        let levelRadios = document.getElementsByName("level");
        for (let i = 0; i < levelRadios.length; i++) {
            levelRadios[i].disabled = false;
        }
    }, 60000);
}

// levels functions
function addition() {
    rand1 = Math.floor(Math.random() * maxValue) + 1;
    rand2 = Math.floor(Math.random() * maxValue) + 1;
    answer = rand1 + rand2;
    document.getElementById("question").textContent = rand1 + " + " + rand2 + " =";
}

function subtraction() {
    rand1 = Math.floor(Math.random() * maxValue) + 1;
    rand2 = Math.floor(Math.random() * maxValue) + 1;
    if (rand1 < rand2) [rand1, rand2] = [rand2, rand1]; // Ensure positive result
    answer = rand1 - rand2;
    document.getElementById("question").textContent = rand1 + " - " + rand2 + " =";
}

function multiplication() {
    rand1 = Math.floor(Math.random() * maxValue) + 1;
    rand2 = Math.floor(Math.random() * maxValue) + 1;
    answer = rand1 * rand2;
    document.getElementById("question").textContent = rand1 + " × " + rand2 + " =";
}

function division() {
    rand2 = Math.floor(Math.random() * maxValue) + 1;
    answer = Math.floor(Math.random() * maxValue) + 1;
    rand1 = rand2 * answer; // Ensure integer division
    document.getElementById("question").textContent = rand1 + " ÷ " + rand2 + " =";
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
        wrong++
        document.getElementById("msg").textContent = `Wrong! Answer was ${answer}. Next question.`;
    }
    input.value = "";
    levelSelect(); // Generate next question
});

// give up
document.getElementById("giveUpBtn").addEventListener("click", function() {
    giveups++;
    totalRounds++;
    document.getElementById("msg").textContent = `Gave up! Answer was ${answer}. Next question.`;
    document.getElementById("guess").value = "";
    levelSelect();
});

// play
document.getElementById("playBtn").addEventListener("click", function() {
    document.getElementById("guess").value = "";
    document.getElementById("enterBtn").disabled = false;
    document.getElementById("giveUpBtn").disabled = false;
    document.getElementById("playBtn").disabled = true;
    let levelRadios = document.getElementsByName("level");
    for (let i = 0; i < levelRadios.length; i++) {
        levelRadios[i].disabled = true;
    }
    levelSelect();
});
