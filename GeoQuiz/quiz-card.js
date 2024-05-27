const apiUrlQuestions = "http://localhost:3000/questions";

const NUM_QUESTIONS = 5;
let currentQuestionIndex = 0;
let currentCorrectAnswer = "";
let questions = [];
let currentScore = 0;

window.addEventListener("beforeunload", function (event) {
  event.preventDefault();
  event.returnValue = "";
});

function updateContent(langData) {
  if (langData && Object.keys(langData).length) {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      element.textContent = langData[key];
    });
  }
}

async function fetchLanguageData(lang) {
  console.log(lang, "lang in fetchLangData");
  const response = await fetch(`languages/${lang}.json`);
  if (response.ok) {
    const langData = await response.json();
    console.log(langData, "res.okk");
    return langData;
  } else {
    console.error("Eroare la încărcarea datelor de limbă:", response.status);
  }
}

function setLanguagePreference(lang) {
  localStorage.setItem("language", lang);
}

async function changeLanguage(lang) {
  setLanguagePreference(lang);

  const langData = await fetchLanguageData(lang);
  updateContent(langData);
}

document.addEventListener("DOMContentLoaded", function () {
  const savedLanguage = localStorage.getItem("language");
  if (savedLanguage) {
    changeLanguage(savedLanguage);
  } else {
    changeLanguage("en");
  }
});
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
  const xml = new XMLHttpRequest();
  xml.open("GET", `${apiUrlQuestions}?difficulty=${difficulty}`);

  xml.onload = function () {
    if (xml.status === 200) {
      try {
        const response = JSON.parse(xml.responseText);
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
      console.error("Eroare la încărcarea întrebărilor:", xml.status);
    }
  };

  xml.send();
}
function loadQuestion(questionData) {
  const questionElement = document.getElementById("question");
  questionElement.textContent = questionData.question.text;

  const answersElement = document.getElementById("answersContainer");
  answersElement.innerText = "";
  const shuffledAnswers = shuffleArray(questionData.possibleAnswers);
  currentCorrectAnswer = questionData.correctAnswer;

  shuffledAnswers.forEach((question, index) => {
    answersElement.insertAdjacentHTML(
      "afterbegin",
      `
      <label>
    <input type="radio" name="option" value="${question}">
    <span id="option${index}">${question}</span>
</label>
<br>
      `
    );
  });

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
  const quizCardElement = document.querySelector(".quiz-card");

  if (selectedAnswer === currentCorrectAnswer) {
    incrementScore(5);
    selectedOption.classList.add("correct-answer");
    quizCardElement.classList.add("correct-answer");
    quizCardElement.classList.add("animate_animated", "animate_pulse");
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
      () =>
        selectedOption.nextElementSibling.classList.remove("correct-answer"),
      500
    );
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
    const currentLanguage = localStorage.getItem("language");

    if (currentLanguage === "ro") {
      scoreSummaryElement.textContent = `Felicitări! Scor final: ${currentScore}`;
    } else {
      scoreSummaryElement.textContent = `Congratulations! Final Score: ${currentScore}`;
    }
    document.getElementById("submitBtn").style.display = "none";
    updateScoreInDatabase();
  }
}

function incrementScore(points) {
  const scoreElement = document.getElementById("score");
  const currentLanguage = localStorage.getItem("language");

  currentScore += points;
  if (currentLanguage === "ro") {
    scoreElement.textContent = `Scor: ${currentScore}`;
  } else {
    scoreElement.textContent = `Score: ${currentScore}`;
  }
}

// function startNewQuiz() {
//   window.location.reload();
// }

document.addEventListener("DOMContentLoaded", fetchQuestions);

function updateScoreInDatabase() {
  const userId = localStorage.getItem("userId");
  const xmlPatch = new XMLHttpRequest();
  xmlPatch.open("PATCH", `http://localhost:3000/users/${userId}`, true);
  xmlPatch.setRequestHeader("Content-Type", "application/json");
  xmlPatch.onload = function () {
    if (xmlPatch.status === 200) {
      console.log("Scorul a fost actualizat cu succes în baza de date!");
    } else {
      console.error("Eroare la actualizarea scorului:", xmlPatch.statusText);
    }
  };
  xmlPatch.onerror = function () {
    console.error("Eroare la conexiune!");
  };

  let previousScore = localStorage.getItem("userScore");
  const newScore = +previousScore + currentScore;
  localStorage.setItem("userScore", newScore);
  xmlPatch.send(JSON.stringify({ score: newScore }));
}

function reloadPage() {
  location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("toggle");
  const quizCardTheme = document.getElementById("quizCardTheme");

  const savedToggleState = localStorage.getItem("toggleState");
  toggle.checked = savedToggleState === "true";

  if (toggle.checked) {
    quizCardTheme.setAttribute("href", "quiz-card-light.css");
  } else {
    quizCardTheme.setAttribute("href", "quiz-card.css");
  }

  toggle.addEventListener("change", function () {
    if (toggle.checked) {
      quizCardTheme.setAttribute("href", "quiz-card-light.css");
      localStorage.setItem("quizCardTheme", "quiz-card-light.css");
    } else {
      quizCardTheme.setAttribute("href", "quiz-card.css");
      localStorage.setItem("quizCardTheme", "quiz-card.css");
    }

    localStorage.setItem("toggleState", toggle.checked);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username");
  const scoreSpan = document.querySelector(".score");

  const userNameElement = document.getElementById("userName");
  userNameElement.innerText = username;

  const scoreValue = document.querySelector(".score-value");
  let userScore = localStorage.getItem("userScore");
  scoreValue.textContent = userScore;
});

function toggleMenu() {
  var element = document.getElementById("navbarRight");
  if (element.classList.contains("active")) {
    element.classList.remove("active");
  } else {
    element.classList.add("active");
  }
}
