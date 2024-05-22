document.addEventListener("DOMContentLoaded", function () {
  const apiUrlUsers = "http://localhost:3000/users";

  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrlUsers, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          const authenticated = data.some(function (user) {
            return user.username === username && user.password === password;
          });

          if (authenticated) {
            const userData = data.find((user) => user.username === username);
            localStorage.setItem("username", username);
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
          console.error("Request failed:", xhr.status);
        }
      }
    };
    xhr.send();
  });

  const username = localStorage.getItem("username");
  const navbarRight = document.querySelector(".navbar-right");
  const scoreSpan = document.querySelector(".score");

  if (username) {
    const signInButton = document.getElementById("signin");
    if (signInButton) {
      signInButton.style.display = "none";
      scoreSpan.style.display = "inline-block";

      let userScore = localStorage.getItem("userScore");
      console.log("User score from localStorage:", userScore);
      scoreSpan.textContent = `Score: ${userScore}`;

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
