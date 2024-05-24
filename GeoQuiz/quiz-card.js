const apiUrlQuestions = "http://localhost:3000/questions";

const NUM_QUESTIONS = 5;
let currentQuestionIndex = 0;
let questions = [];

function getSelectedDifficulty() {
  return localStorage.getItem("selectedDifficulty");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function fetchQuestions() {
  const difficulty = getSelectedDifficulty();
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${apiUrlQuestions}?difficulty=${difficulty}`);

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (Array.isArray(response) && response.length > 0) {
          questions = response;
          questions = shuffleArray(questions).slice(0, NUM_QUESTIONS);
          loadQuestion(questions[currentQuestionIndex]);
        } else {
          console.error("Date incorecte primite de la server:", response);
        }
      } catch (error) {
        console.error("Eroare la parsarea răspunsului JSON:", error);
      }
    } else {
      console.error("Eroare la încărcarea întrebărilor:", xhr.status);
    }
  };

  xhr.send();
}

function loadQuestion(questionData) {
  const questionElement = document.getElementById("question");
  const option1Element = document.getElementById("option1");
  const option2Element = document.getElementById("option2");
  const option3Element = document.getElementById("option3");
  const option4Element = document.getElementById("option4");

  questionElement.textContent = questionData.question.text;
  option1Element.textContent = questionData.incorrectAnswers[0];
  option2Element.textContent = questionData.incorrectAnswers[1];
  option3Element.textContent = questionData.incorrectAnswers[2];
  option4Element.textContent = questionData.correctAnswer;

  document
    .querySelectorAll('input[name="option"]')
    .forEach((input) => (input.checked = false));
}

function submitAnswer() {
  const selectedOption = document.querySelector('input[name="option"]:checked');

  if (!selectedOption) {
    alert("Te rog să selectezi un răspuns!");
    return;
  }

  const selectedAnswer = selectedOption.value;
  const correctAnswerElement = document.getElementById("option4");
  const correctAnswer = correctAnswerElement.textContent.trim();
  const quizCardElement = document.querySelector(".quiz-card");

  if (selectedAnswer === "option4") {
    correctAnswerElement.classList.add("correct-answer");
    quizCardElement.classList.add("correct-answer");
    quizCardElement.classList.add("animate__animated", "animate__pulse");
    quizCardElement.addEventListener(
      "animationend",
      () => {
        quizCardElement.classList.remove(
          "animate__animated",
          "animate__pulse",
          "correct-answer"
        );
      },
      { once: true }
    );
    setTimeout(
      () => correctAnswerElement.classList.remove("correct-answer"),
      500
    );
    incrementScore(5);
  } else {
    selectedOption.nextElementSibling.classList.add("wrong-answer");
    quizCardElement.classList.add("wrong-answer");
    quizCardElement.classList.add("animate__animated", "animate__tada");
    quizCardElement.addEventListener(
      "animationend",
      () => {
        quizCardElement.classList.remove(
          "animate__animated",
          "animate__tada",
          "wrong-answer"
        );
      },
      { once: true }
    );
    setTimeout(
      () => selectedOption.nextElementSibling.classList.remove("wrong-answer"),
      500
    );
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion(questions[currentQuestionIndex]);
  } else {
    const scoreSummaryElement = document.getElementById("score-summary");
    const scoreElement = document.getElementById("score");
    scoreSummaryElement.textContent = `Felicitari! Scor final: ${parseInt(
      scoreElement.textContent.split(" ")[1]
    )}`;

    document.getElementById("submitBtn").style.display = "none";
    document.getElementById("reloadBtn").style.display = "block";
  }
}

function incrementScore(points) {
  const scoreElement = document.getElementById("score");
  let currentScore = parseInt(scoreElement.textContent.split(" ")[1]);
  currentScore += points;
  scoreElement.textContent = `Score: ${currentScore}`;

  localStorage.setItem("userScore", currentScore);
}

function startNewQuiz() {
  window.location.reload();
}

document.addEventListener("DOMContentLoaded", fetchQuestions);

function updateScoreInDatabase() {
  const username = localStorage.getItem("username");
  const userScore = localStorage.getItem("userScore");

  if (!username) {
    console.error("Utilizatorul curent nu este setat în localStorage!");
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.open("PUT", `http://localhost:3000/users/${username}`, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("Scorul a fost actualizat cu succes în baza de date!");
    } else {
      console.error("Eroare la actualizarea scorului:", xhr.statusText);
    }
  };

  xhr.onerror = function () {
    console.error("Eroare la conexiune!");
  };

  xhr.send(JSON.stringify({ score: userScore }));
}

updateScoreInDatabase();

function reloadPage() {
  location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username");
  const navbarRight = document.querySelector(".navbar-right");
  const scoreSpan = document.querySelector(".score");

  if (username) {
    const signInButton = document.getElementById("signin");
    if (signInButton) {
      signInButton.style.display = "none";

      scoreSpan.style.display = "inline-block";

      let userScore = localStorage.getItem("userScore");

      scoreSpan.textContent = `Score: ${userScore}`;
      console.log(`Score: ${userScore}`);

      signInButton.insertAdjacentHTML(
        "beforebegin",
        `<span id="userNavItem" class="nav-link">Welcome, ${username}</span>`
      );

      const signUpButton = document.querySelector(
        ".user-info a[href='SignUp-Form.html']"
      );
      if (signUpButton) {
        signUpButton.textContent = "Logout";
        signUpButton.setAttribute("href", "#");
        signUpButton.onclick = function () {
          localStorage.removeItem("username");
          localStorage.removeItem("userScore");
          location.reload();
        };
      }
    }
  }
});
