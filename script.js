let playerHp = 10;
let enemyHp = 10;
let playerStagger = 3;
let enemyStagger = 3;
let playerPrediction = 3;
let distance = 2;

let enemyCommands = ["Attack", "Dodge", "Move Forward", "Move Backward"];
let enemyColors = ["Red", "Blue", "Green"];

let currentEnemyCommand = randomEnemyCommand();
let currentEnemyColor = randomEnemyColor();

function randomEnemyCommand() {
  return enemyCommands[Math.floor(Math.random() * enemyCommands.length)];
}

function randomEnemyColor() {
  return enemyColors[Math.floor(Math.random() * enemyColors.length)];
}

function counterCheck(playerColor, enemyColor) {
  if (playerColor === "Red" && enemyColor === "Blue") return "player";
  if (playerColor === "Blue" && enemyColor === "Green") return "player";
  if (playerColor === "Green" && enemyColor === "Red") return "player";

  if (enemyColor === "Red" && playerColor === "Blue") return "enemy";
  if (enemyColor === "Blue" && playerColor === "Green") return "enemy";
  if (enemyColor === "Green" && playerColor === "Red") return "enemy";

  return "none";
}

function predictEnemy() {
  if (playerPrediction <= 0) {
    document.getElementById("result").textContent = "No Prediction Points left.";
    return;
  }

  playerPrediction--;

  document.getElementById("enemyCommand").textContent = currentEnemyCommand;
  document.getElementById("enemyColor").textContent = currentEnemyColor;
  document.getElementById("playerPrediction").textContent = playerPrediction;

  document.getElementById("result").textContent =
    "Prediction used. Enemy command and color are revealed and locked.";
}

function resolveTurn() {
  let playerCommand = document.getElementById("playerCommand").value;
  let playerColor = document.getElementById("playerColor").value;

  let counterResult = counterCheck(playerColor, currentEnemyColor);
  let log = `You chose ${playerCommand} with ${playerColor}. Enemy chose ${currentEnemyCommand} with ${currentEnemyColor}. `;

  if (counterResult === "player") {
    log += "Your color countered the enemy. Enemy command canceled. ";

    if (playerCommand === "Attack" && distance <= 3) {
      enemyHp -= 1;
      log += "Your attack hits. Enemy loses 1 HP.";
    } else if (playerCommand === "Move Forward") {
      distance = Math.max(0, distance - 1);
      log += "You move forward.";
    } else if (playerCommand === "Move Backward") {
      distance += 1;
      log += "You move backward.";
    } else if (playerCommand === "Dodge") {
      log += "You dodge successfully.";
    }

  } else if (counterResult === "enemy") {
    log += "Enemy color countered you. Your command canceled. ";

    if (currentEnemyCommand === "Attack" && distance <= 3) {
      playerHp -= 1;
      log += "Enemy attack hits. You lose 1 HP.";
    } else {
      log += "Enemy command resolves.";
    }

  } else {
    log += "No color counter. Both commands resolve. ";

    if (playerCommand === "Attack" && distance <= 3) {
      enemyHp -= 1;
      log += "Your attack hits. ";
    }

    if (currentEnemyCommand === "Attack" && distance <= 3 && playerCommand !== "Dodge") {
      playerHp -= 1;
      log += "Enemy attack hits. ";
    }

    if (playerCommand === "Dodge") {
      log += "You dodged this turn. ";
    }

    if (playerCommand === "Move Forward") {
      distance = Math.max(0, distance - 1);
      log += "You move forward. ";
    }

    if (playerCommand === "Move Backward") {
      distance += 1;
      log += "You move backward. ";
    }
  }

  if (enemyHp <= 0 && playerHp <= 0) {
    log += " Both characters reached 0 HP. Draw.";
  } else if (enemyHp <= 0) {
    log += " Enemy defeated. You win.";
  } else if (playerHp <= 0) {
    log += " You reached 0 HP. You lose.";
  }

  updateUI(log);

  currentEnemyCommand = randomEnemyCommand();
  currentEnemyColor = randomEnemyColor();

  document.getElementById("enemyCommand").textContent = "Unknown";
  document.getElementById("enemyColor").textContent = "Unknown";
}

function updateUI(log) {
  document.getElementById("playerHp").textContent = playerHp;
  document.getElementById("enemyHp").textContent = enemyHp;
  document.getElementById("playerStagger").textContent = playerStagger;
  document.getElementById("enemyStagger").textContent = enemyStagger;
  document.getElementById("distance").textContent = distance;
  document.getElementById("result").textContent = log;
}

function resetGame() {
  playerHp = 10;
  enemyHp = 10;
  playerStagger = 3;
  enemyStagger = 3;
  playerPrediction = 3;
  distance = 2;

  currentEnemyCommand = randomEnemyCommand();
  currentEnemyColor = randomEnemyColor();

  document.getElementById("enemyCommand").textContent = "Unknown";
  document.getElementById("enemyColor").textContent = "Unknown";

  updateUI("Game reset. Choose a command and resolve the turn.");
}
