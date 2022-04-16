var startButton = document.getElementById("start-btn");
var containerDiv = document.getElementById("container");

var timerDisplay = document.getElementById("timer");
var timeleft = 60;

var questionDiv = document.getElementById("question");
var answersDiv = document.getElementById("answer-btns");

var scoreDisplay = document.getElementById("score-display");

var hiScoreOl = document.getElementById("hiscore-list");
var scoreDiv = document.getElementById("scores");
var restartButton = document.getElementById("restart");
restartButton.addEventListener("click", reloadQuiz);

const questionsArray = [
    {
        question: "Which is most commonly used to style webpages?",
        answers: [
            {text: "HTML", correct: false},
            {text: "Python", correct: false},
            {text: "CSS", correct: true},
            {text: "Java", correct: false},
        ]
    },
    {
        question: "What is an int in Javascript?",
        answers: [
            {text: "An interval", correct: false},
            {text: "An integer", correct: true},
            {text: "An interim value", correct: false},
            {text: "None of the above", correct: false},
        ]
    },
    {
        question: "Which is the correct way to declare a function in Javascript?",
        answers: [
            {text: "function functionName() { (function code goes here) }", correct: false},
            {text: "var functionName = function() { (function code goes here) }", correct: false},
            {text: "Both are correct", correct: true},
            {text: "Neither are correct", correct: false},
        ]
    },
    {
        question: "Which of the following HTML tags is not valid?",
        answers: [
            {text: "<tc>", correct: true},
            {text: "<tr>", correct: false},
            {text: "<td>", correct: false},
            {text: "<th>", correct: false},
        ]
    },
    {
        question: "Which HTML tag is used for links?",
        answers: [
            {text: "<href>", correct: false},
            {text: "<img>", correct: false},
            {text: "<h3>", correct: false},
            {text: "<a>", correct: true},
        ]
    }
];

var shuffledQuestions, currentQuestionIndex;

startButton.addEventListener("click", startQuiz);

function reloadQuiz() {
    location.reload();
}

function startQuiz() {
    startButton.classList.add("hidden");
    containerDiv.classList.remove("hidden");
    scoreDiv.classList.add("hidden");
    viewScores.classList.remove("hidden");

    shuffledQuestions = questionsArray.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
  
    var quizTimer = setInterval(function(){
        if ((timeleft <= 0) && (currentQuestionIndex < 5)) {
            clearInterval(quizTimer);
            endQuiz();
        }
        else if ((timeleft <= 0) || (currentQuestionIndex == 5)) {
            clearInterval(quizTimer);
        }
        
          timerDisplay.innerHTML = timeleft;

        timeleft -= 1;
      }, 1000); 
        
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionDiv.innerText = question.question;
    question.answers.forEach(answer => {
        var button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add("answer");
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answersDiv.appendChild(button);
        var lineBreak = document.createElement("br");
        answersDiv.appendChild(lineBreak);
    });
    currentQuestionIndex += 1;
}

function resetState() {
    while (answersDiv.firstChild) {
        answersDiv.removeChild(answersDiv.firstChild);
    }
}

function selectAnswer(e) {
    var selectedAnswer = e.target;
    var correct = selectedAnswer.dataset.correct;
    if (!correct) {
        timeleft -= 10;
    }
    if (currentQuestionIndex <= 4) {
        setNextQuestion();
    }
    else {
        currentQuestionIndex = 5;
        endQuiz();
    }
}

function endQuiz() {
    const score = timeleft;
    containerDiv.classList.add("hidden");
    timerDisplay.classList.add("hidden");

    scoreDisplay.classList.remove("hidden");
    scoreDisplay.innerText = "Final Score: " + score;
    setHighScore(score);

    startButton.classList.remove("hidden");
    restartButton.classList.remove("hidden");
}


var highScoreList = JSON.parse(localStorage.getItem("highScores")) || [];
var maxScores = 10;

function setHighScore(s) {
    playerName = window.prompt("Your score is " + s + ". Please enter your name");
    if (!playerName) {
        window.alert("please enter your name");
        setHighScore(s);
    }
    var scoreObj = {
        score: s,
        username: playerName
    };
    highScoreList.push(scoreObj);
    highScoreList.sort( (a,b) => b.score - a.score);
    highScoreList.splice(maxScores);

    localStorage.setItem("highScores", JSON.stringify(highScoreList));
    startButton.classList.remove("hidden");
}

function showHighScores() {

    startButton.classList.remove("hidden");
    scoreDiv.classList.remove("hidden");
    scoreDisplay.classList.add("hidden");

    viewScores.classList.add("hidden");

    scoreDiv.innerHTML = "Top 10 Scores";

    if (highScoreList.length > 0) {
        for (let i = 0; i < highScoreList.length; i++) {
            var playername = String(highScoreList[i].username);
            var playerscore = String(highScoreList[i].score);
            var hiscore = document.createElement("p");
            hiscore.classList.add("hiscores");
            scoreDiv.appendChild(hiscore);
            hiscore.innerText = playername + ": " + playerscore;
            
            console.log(playername, playerscore);
        }

        console.log(highScoreList);
    }
    else {
        scoreDiv.innerHTML = "No scores yet";
    }
}

var viewScores = document.getElementById("view-scores");
viewScores.addEventListener("click", showHighScores);


