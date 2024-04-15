const pick = ["rock", "paper", "scissors"];

let result;

const win = "You win!";
const lose = "You lose!";

let userScore = 0;
let computerScore = 0;

function play(playerPick) {
  let computerPick = pick[Math.floor(Math.random() * pick.length)];
  if (playerPick === computerPick) {
    result = "It's a tie!";
    textColor(result, playerPick, computerPick, "tie-color");
  } else if (
    (playerPick === "rock" && computerPick === "scissors") ||
    (playerPick === "paper" && computerPick === "rock") ||
    (playerPick === "scissors" && computerPick === "paper")
  ) {
    result = win;
    userScore++;
    textColor(result, playerPick, computerPick, "win-color");
  } else {
    result = lose;
    computerScore++;
    textColor(result, playerPick, computerPick, "lose-color");
  }

  document.getElementById("user-score").value = userScore;
  document.getElementById("computer-score").value = computerScore;
}

function textColor(result, playerPick, computerPick, colorClass) {
  const resultElement = document.getElementById("result");
  resultElement.innerHTML = `
      <p>You chose: ${playerPick}</p>
      <p>Computer chose: ${computerPick}</p>
      <p class=${colorClass}>${result}</p>`;
}
