const pickPosibilities = ["Rock", "Paper", "Scissors"];

let computerPick =
  pickPosibilities[Math.floor(Math.random() * pickPosibilities.length)];
let userPick =
  pickPosibilities[Math.floor(Math.random() * pickPosibilities.length)];

//setInterval(play(), 1000);

function play(computerPick, userPick) {
  if (computerPick == "Rock" && userPick == "Paper") {
    return "Result: User wins!";
  } else if (computerPick == "Rock" && userPick == "Scissors") {
    return "Result: Computer wins!";
  } else if (computerPick == "Scissors" && userPick == "Rock") {
    return "Result: User wins!";
  } else if (computerPick == "Scissors" && userPick == "Paper") {
    return "Result: Computer wins!";
  } else if (computerPick == "Paper" && userPick == "Rock") {
    return "Result: Computer wins!";
  } else if (computerPick == "Paper" && userPick == "Scissors") {
    return "Result: User wins!";
  } else {
    return "Result: Tie!";
  }
}

console.log("Computer choice: ", computerPick);
console.log("User choice: ", userPick);
console.log(play(computerPick, userPick));
