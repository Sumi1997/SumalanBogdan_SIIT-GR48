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
