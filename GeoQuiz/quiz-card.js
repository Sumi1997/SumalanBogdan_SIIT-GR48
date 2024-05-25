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
  console.log("Language preference set to:", lang);
}

async function changeLanguage(lang) {
  console.log("selected language::", lang);
  setLanguagePreference(lang);

  const langData = await fetchLanguageData(lang);
  updateContent(langData);
}

changeLanguage("ro");

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
  questionElement.textContent = questionData.question.text;

  const answersElement = document.getElementById("answersContainer");
  answersElement.innerText = "";
  const shuffledAnswers = shuffleArray(questionData.possibleAnswers);
  currentCorrectAnswer = questionData.correctAnswer;
  console.log(shuffledAnswers, "shuffled qqqqq");

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

    scoreSummaryElement.textContent = `Felicitari! Scor final: ${currentScore}`;

    document.getElementById("submitBtn").style.display = "none";
    // document.getElementById("reloadBtn").style.display = "block";
    updateScoreInDatabase();
  }
}

function incrementScore(points) {
  const scoreElement = document.getElementById("score");

  currentScore += points;
  scoreElement.textContent = `Score: ${currentScore}`;
}

// function startNewQuiz() {
//   window.location.reload();
// }

document.addEventListener("DOMContentLoaded", fetchQuestions);

function updateScoreInDatabase() {
  const userId = localStorage.getItem("userId");
  const xhrPatch = new XMLHttpRequest();
  xhrPatch.open("PATCH", `http://localhost:3000/users/${userId}`, true);
  xhrPatch.setRequestHeader("Content-Type", "application/json");
  xhrPatch.onload = function () {
    if (xhrPatch.status === 200) {
      console.log("Scorul a fost actualizat cu succes în baza de date!");
    } else {
      console.error("Eroare la actualizarea scorului:", xhrPatch.statusText);
    }
  };
  xhrPatch.onerror = function () {
    console.error("Eroare la conexiune!");
  };

  // Actualizează scorul în localStorage
  let previousScore = localStorage.getItem("userScore");
  const newScore = +previousScore + currentScore;
  localStorage.setItem("userScore", newScore);
  xhrPatch.send(JSON.stringify({ score: newScore }));

  // const username = localStorage.getItem("username");
  // const userId = localStorage.getItem("userId");

  // if (!username) {
  //   console.error("Utilizatorul curent nu este setat în localStorage!");
  //   return;
  // }

  // const xhrGet = new XMLHttpRequest();
  // xhrGet.open("GET", `http://localhost:3000/users/${userId}`, true);
  // xhrGet.onload = function () {
  //   if (xhrGet.status === 200) {
  //     const user = JSON.parse(xhrGet.responseText);
  //     console.log(user, "userrrrrrrrrr");
  //     const previousScore = user.score;
  //     const newScore = previousScore + currentScore;

  //   } else {
  //     console.error(
  //       "Eroare la obținerea scorului existent:",
  //       xhrGet.statusText
  //     );
  //   }
  // };
  // xhrGet.onerror = function () {
  //   console.error("Eroare la conexiune la obținerea scorului!");
  // };
  // xhrGet.send();
}

function reloadPage() {
  location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("toggle");
  const quizCardTheme = document.getElementById("quizCardTheme");

  const savedToggleState = localStorage.getItem("toggleState");
  toggle.checked = savedToggleState === "true"; // Convertim string-ul la boolean

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
