let answer = 0;
let guessCount = 0;
let range = 0;
const scores = [];
let startTime = 0;
let times = [];
let timerInterval = null;

const date = document.getElementById('date');
const currentTime = document.getElementById('currentTime');

const msg = document.getElementById("msg");
const guessInput = document.getElementById("guess");
const guessBtn = document.getElementById("guessBtn");
const giveUpBtn = document.getElementById("giveUpBtn");
const playBtn = document.getElementById("playBtn");

const wins = document.getElementById("wins");
const avgScore = document.getElementById("avgScore");
const fastest = document.getElementById("fastest");
const avgTime = document.getElementById("avgTime");

const e = document.getElementById("e");
const m = document.getElementById("m");
const h = document.getElementById("h");


let playerName = prompt("Enter your name:");
if (playerName) {
    playerName = playerName.charAt(0).toUpperCase() + playerName.slice(1).toLowerCase();
}

date.textContent = time();
setInterval(() => {
    date.textContent = time() + " | " + now();
}, 1000);

function time(){
    let d = new Date();
    let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    let day = d.getDate();

    if (day % 10 == 1 && day != 11) day += "st";
    else if (day % 10 == 2 && day != 12) day += "nd";
    else if (day % 10 == 3 && day != 13) day += "rd";
    else day += "th";

    return months[d.getMonth()] + " " + day + ", " + d.getFullYear();
}

function now(){
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    let ampm = h >= 12 ? "p.m." : "a.m.";

    if (h > 12) h -= 12;
    if (h == 0) h = 12;
    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;

    return h + ":" + m + ":" + s + " " + ampm;
}

function updateLevel(){
    let levels = document.getElementsByName("level");
    for (let i = 0; i < levels.length; i++){
        if (levels[i].checked){
            range = parseInt(levels[i].value);
        }
    }
}
updateLevel();

playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);

for (let i = 0; i < document.getElementsByName("level").length; i++){
    document.getElementsByName("level")[i].addEventListener("change", updateLevel);
}

document.getElementById("maxvalue").style.display = "none";
let other = document.getElementById("o")

other.addEventListener("click",otherFunc);
function otherFunc(){
    maxvalue.style.display = "block"
}

e.addEventListener("click",hideOther);
m.addEventListener("click",hideOther);
h.addEventListener("click",hideOther);
function hideOther(){
    maxvalue.style.display = "none";
}

function play(){
    updateLevel();
    startElapsedTimer();
    let levels = document.getElementsByName("level");
    for (let i = 0; i < levels.length; i++){
        levels[i].disabled = true;
    }
    if (other.checked){
        range = parseInt(maxvalue.value);
    }
    actualrange=range;
    answer = Math.floor(Math.random() * range) + 1;
    guessCount = 0;

    startTime = new Date().getTime();

    msg.textContent = playerName + ", guess a number 1-" + range;

    guessBtn.disabled = false;
    giveUpBtn.disabled = false;
    playBtn.disabled = true;
}

function makeGuess(){
    let guess = parseInt(guessInput.value);

    if (isNaN(guess) || guess < 1 || guess > range){
        msg.textContent = "Invalid input";
        return;
    }

    guessCount++;

    if (guess == answer){
        msg.textContent = "Correct! " + playerName + " got it in " + guessCount + " tries.";

        updateScore(guessCount);

        let endTime = new Date().getTime();
        times.push((endTime - startTime) / 1000);
        updateTimers();
        clearInterval(timerInterval);
        reset();
    }
    else if (guess < answer){
        let diff = Math.abs(guess - answer);

        if (diff <= 2) msg.textContent = "Too low - Hot";
        else if (diff <= 5) msg.textContent = "Too low - Warm";
        else msg.textContent = "Too low - Cold";
    }
    else {
        let diff = Math.abs(guess - answer);

        if (diff <= 2) msg.textContent = "Too high - Hot";
        else if (diff <= 5) msg.textContent = "Too high - Warm";
        else msg.textContent = "Too high - Cold";
    }
}

function updateScore(score){
    scores.push(score);

    wins.textContent = "Total wins: " + scores.length;

    let sum = 0;
    for (let i = 0; i < scores.length; i++){
        sum += scores[i];
    }

    avgScore.textContent = "Average Score: " + (sum / scores.length).toFixed(1);

    scores.sort((a,b) => a-b);

    let lb = document.getElementsByName("leaderboard");
    for (let i = 0; i < lb.length; i++){
        lb[i].textContent = scores[i] ?? "--";
    }
}


function updateTimers(){
    let sum = 0;
    let fastestTime = Math.min(...times);

    for (let i = 0; i < times.length; i++){
        sum += times[i];
    }

    fastest.textContent = "Fastest Game: " + fastestTime.toFixed(2);
    avgTime.textContent = "Average Time: " + (sum / times.length).toFixed(2);
}

function startElapsedTimer(){
    timerInterval = setInterval(() => {
        let now = new Date().getTime();
        let elapsed = (now - startTime) / 1000;

        document.getElementById("gameClock").textContent =
            "Elapsed time: " + elapsed.toFixed(2) + " seconds";
    }, 100);
}

function giveUp(){
    msg.textContent = playerName + " gave up! Answer was " + answer;

    let endTime = new Date().getTime();
    times.push((endTime - startTime) / 1000);
    reset();
}

function reset(){
    clearInterval(timerInterval);
    guessInput.value = "";

    guessBtn.disabled = true;
    giveUpBtn.disabled = true;
    playBtn.disabled = false;
    e.disabled = false;
    h.disabled = false;
    m.disabled = false;
    other.disabled = false;
    maxvalue.style.display = "none";
    maxvalue.value = "";
    e.checked = true;
}