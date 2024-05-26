document.addEventListener("DOMContentLoaded", function () {
  const apiUrlUsers = "http://localhost:3000/users";

  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const xml = new XMLHttpRequest();
    xml.open("GET", apiUrlUsers, true);
    xml.onreadystatechange = function () {
      if (xml.readyState === XMLHttpRequest.DONE) {
        if (xml.status === 200) {
          const data = JSON.parse(xml.responseText);
          const authenticated = data.some(function (user) {
            return user.username === username && user.password === password;
          });

          if (authenticated) {
            const userData = data.find((user) => user.username === username);
            localStorage.setItem("username", username);
            localStorage.setItem("userId", userData.id);
            localStorage.setItem("userScore", userData.score);
            window.location.href = "mainpage.html";
          } else {
            const signupSection = document.getElementById("signupSection");
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "Incorrect credentials. Try again!";
            signupSection.innerHTML = "";
            signupSection.appendChild(errorMessage);
          }
        } else {
          console.error("Request failed:", xml.status);
        }
      }
    };
    xml.send();
  });
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
  const response = await fetch(`languages/${lang}.json`);
  if (response.ok) {
    const langData = await response.json();
    return langData;
  } else {
    console.error("Error at loaded language data", response.status);
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

changeLanguage("en");

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("toggle");
  const loginTheme = document.getElementById("loginTheme");

  const savedToggleState = localStorage.getItem("toggleState");
  toggle.checked = savedToggleState === "true";

  if (toggle.checked) {
    loginTheme.setAttribute("href", "login-styles-light.css");
  } else {
    loginTheme.setAttribute("href", "login-styles.css");
  }

  toggle.addEventListener("change", function () {
    if (toggle.checked) {
      loginTheme.setAttribute("href", "login-styles-light.css");
      localStorage.setItem("logintheme", "login-styles-light.css");
    } else {
      loginTheme.setAttribute("href", "login-styles.css");
      localStorage.setItem("loginTheme", "login-styles.css");
    }

    localStorage.setItem("toggleState", toggle.checked);
  });
});

function toggleMenu() {
  var element = document.getElementById("navbarRight");
  if (element.classList.contains("active")) {
    element.classList.remove("active");
  } else {
    element.classList.add("active");
  }
}
