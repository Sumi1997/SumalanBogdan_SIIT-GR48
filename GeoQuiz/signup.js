const apiUrlUsers = "http://localhost:3000/users";

document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const newUser = {
      username: username,
      email: email,
      password: password,
      score: 0,
      usertype: "user",
    };

    const xml = new XMLHttpRequest();
    xml.open("POST", apiUrlUsers);
    xml.setRequestHeader("Content-Type", "application/json");

    xml.onreadystatechange = function () {
      if (xml.readyState === XMLHttpRequest.DONE) {
        if (xml.status === 201) {
          console.log("Utilizatorul a fost adăugat cu succes!");
          window.location.href = "LogIn-Form.html";
        } else {
          console.error("Eroare la adăugarea utilizatorului:", xml.status);
          console.error("Răspuns:", xml.responseText);
        }
      }
    };

    xml.send(JSON.stringify(newUser));
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

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("toggle");
  const signupTheme = document.getElementById("signupTheme");

  const savedToggleState = localStorage.getItem("toggleState");
  toggle.checked = savedToggleState === "true";

  if (toggle.checked) {
    signupTheme.setAttribute("href", "signup-styles-light.css");
  } else {
    signupTheme.setAttribute("href", "signup-styles.css");
  }

  toggle.addEventListener("change", function () {
    if (toggle.checked) {
      signupTheme.setAttribute("href", "signup-styles-light.css");
      localStorage.setItem("signupTheme", "signup-styles-light.css");
    } else {
      signupTheme.setAttribute("href", "signup-styles.css");
      localStorage.setItem("signupTheme", "signup-styles.css");
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
