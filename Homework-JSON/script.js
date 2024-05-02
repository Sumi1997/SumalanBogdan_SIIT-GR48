const apiUrlQuestion = "http://localhost:3000/questions";

function loadQuestions() {
  const xmlHTTP = new XMLHttpRequest();

  xmlHTTP.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      const questions = JSON.parse(this.responseText);
      showQuestions(questions);
    }

    if (this.readyState === XMLHttpRequest.DONE && this.status === 500) {
      console.log("Server error");
    }
  };

  xmlHTTP.open("GET", apiUrlQuestion);
  xmlHTTP.send();
}

function loadQuestionsByDifficulty() {
  const xmlHTTP = new XMLHttpRequest();

  xmlHTTP.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      const questions = JSON.parse(this.responseText);
      showQuestions(questions);
    }

    if (this.readyState === XMLHttpRequest.DONE && this.status === 500) {
      console.log("Server error");
    }
  };

  xmlHTTP.open("GET", `${apiUrlQuestion}?difficulty=easy`);
  xmlHTTP.send();
}

function insertQuestion() {
  const category = document.getElementById("categoryInput").value;
  const correctAnswer = document.getElementById("correctAnswerInput").value;
  const incorrectAnswers = document
    .getElementById("incorrectAnswersInput")
    .value.split(",");
  const questionText = document.getElementById("questionTextInput").value;
  const difficulty = document.getElementById("difficultyInput").value;

  const newQuestion = new Question(
    category,
    correctAnswer,
    incorrectAnswers,
    { text: questionText },
    difficulty
  );

  const xmlHTTP = new XMLHttpRequest();

  xmlHTTP.open("POST", apiUrlQuestion);

  xmlHTTP.setRequestHeader("Content-Type", "application/json");
  xmlHTTP.send(JSON.stringify(newQuestion));
}

function showQuestions(questions) {
  for (let index = 0; index < questions.length; index++) {
    const paragraph = document.createElement("p");
    const textContent = document.createTextNode(questions[index].question.text);
    paragraph.appendChild(textContent);
    paragraph.style.color = "blue";
    if (index % 2 === 0) paragraph.style.color = "red";
    document.getElementById("containerId").appendChild(paragraph);
  }
}

class Question {
  category;
  correctAnswer;
  incorrectAnswers;
  question;
  difficulty;

  constructor(category, correctAnswer, incorrectAnswers, question, difficulty) {
    this.category = category;
    this.correctAnswer = correctAnswer;
    this.incorrectAnswers = incorrectAnswers;
    this.question = question;
    this.difficulty = difficulty;
  }
}
