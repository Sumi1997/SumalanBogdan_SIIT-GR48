const apiUrlQuestions = "http://localhost:3000/users";

function updateContent(langData) {
  console.log("Lang data:::", langData);
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = langData[key];
  });
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

function chooseDifficulty() {
  var difficultySection = document.getElementById("difficultySection");
  difficultySection.style.display = "block";
}

function setDifficultyAndRedirect(difficulty) {
  localStorage.setItem("selectedDifficulty", difficulty);
  window.location.href = "quiz-card.html";
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

  const playButton = document.querySelector(".hero-text button");
  const difficultySection = document.getElementById("difficultySection");
  const easyButton = document.getElementById("easyButton");
  const mediumButton = document.getElementById("mediumButton");
  const hardButton = document.getElementById("hardButton");

  playButton.addEventListener("click", function () {
    difficultySection.style.display = "block";
    playButton.style.display = "none";
  });

  easyButton.addEventListener("click", function () {
    setDifficultyAndRedirect("easy");
  });

  mediumButton.addEventListener("click", function () {
    setDifficultyAndRedirect("medium");
  });

  hardButton.addEventListener("click", function () {
    setDifficultyAndRedirect("hard");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("toggle");
  const changeTheme = document.getElementById("changeTheme");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) changeTheme.setAttribute("href", savedTheme);
  toggle.checked = savedTheme === "mainpage-light.css";
  toggle.addEventListener("change", function () {
    if (toggle.checked) {
      changeTheme.setAttribute("href", "mainpage-light.css");
      localStorage.setItem("theme", "mainpage-light.css");
    } else {
      changeTheme.setAttribute("href", "mainpage.css");
      localStorage.setItem("theme", "mainpage.css");
    }
  });
});
