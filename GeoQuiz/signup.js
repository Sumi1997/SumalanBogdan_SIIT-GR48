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

    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrlUsers);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 201) {
          console.log("Utilizatorul a fost adăugat cu succes!");
          window.location.href = "LogIn-Form.html";
        } else {
          console.error("Eroare la adăugarea utilizatorului:", xhr.status);
          console.error("Răspuns:", xhr.responseText);
        }
      }
    };

    xhr.send(JSON.stringify(newUser));
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("toggle");
  const signupTheme = document.getElementById("signupTheme");

  const savedToggleState = localStorage.getItem("toggleState");
  toggle.checked = savedToggleState === "true"; // Convertim string-ul la boolean

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
