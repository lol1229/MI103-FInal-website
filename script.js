let playerHp = 10;
let enemyHp = 10;
let playerStagger = 3;
let enemyStagger = 3;
let prediction = 3;
let distance = 2;

let selectedCard = null;

const playerCards = [
  { color: "Red", command: "Attack" },
  { color: "Blue", command: "Dodge" },
  { color: "Green", command: "Move Forward" },
  { color: "Red", command: "Move Backward" },
  { color: "Blue", command: "Attack" },
  { color: "Green", command: "Dodge" },
  { color: "Red", command: "Attack" }
];

let enemyPlan = [];

function createEnemyPlan() {
  const colors = ["Red", "Blue", "Green"];
  const commands = ["Attack", "Dodge", "Move Forward", "Move Backward"];

  enemyPlan = [];

  for (let i = 0; i < 5; i++) {
    enemyPlan.push({
      color: colors[Math.floor(Math.random() * colors.length)],
      command: commands[Math.floor(Math.random() * commands.length)],
      revealed: false
    });
  }
}

function renderPlayerHand() {
  const hand = document.getElementById("playerHand");
  hand.innerHTML = "";

  playerCards.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = `card ${card.color.toLowerCase()}`;

    if (selectedCard === index) {
      div.classList.add("selected");
    }

    div.innerHTML = `
      <h3>${card.color}</h3>
      <p><strong>${card.command}</strong></p>
      <p>Click to select</p>
    `;

    div.onclick = function () {
      selectedCard = index;
      document.getElementById("selectedCard").textContent =
        `${card.color} ${card.command} selected.`;
      renderPlayerHand();
    };

    hand.appendChild(div);
  });
}

function renderEnemySlots() {
  const slots = document.getElementById("enemySlots");
  slots.innerHTML = "";

  enemyPlan.forEach((card, index) => {
    const div = document.createElement("div");

    if (card.revealed) {
      div.className = `card ${card.color.toLowerCase()}`;
      div.innerHTML = `
        <h3>Slot ${index + 1}</h3>
        <p><strong>${card.color}</strong></p>
        <p>${card.command}</p>
      `;
    } else {
      div.className = "card hidden";
      div.textContent = "?";
    }

    slots.appendChild(div);
  });
}

function usePrediction() {
  if (prediction <= 0) {
    writeLog("You have no Prediction Points left.");
    return;
  }

  const hiddenIndex = enemyPlan.findIndex(card => !card.revealed);

  if (hiddenIndex === -1) {
    writeLog("All enemy segments are already revealed.");
    return;
  }

  enemyPlan[hiddenIndex].revealed = true;
  prediction--;

  updateUI();
  renderEnemySlots();

  writeLog(
    `Prediction used. Enemy Slot ${hiddenIndex + 1} revealed: ` +
    `${enemyPlan[hiddenIndex].color} ${enemyPlan[hiddenIndex].command}.`
  );
}

function resolveTurn() {
  if (selectedCard === null) {
    writeLog("Choose one card from your hand first.");
    return;
  }

  const player = playerCards[selectedCard];
  const enemy = enemyPlan[0];

  let log = `You played ${player.color} ${player.command}. `;
  log += `Enemy played ${enemy.color} ${enemy.command}. `;

  const result = checkCounter(player.color, enemy.color);

  if (result === "player") {
    log += "Your color countered the enemy. Enemy command is canceled. ";
    applyCommand(player, "player");
  } else if (result === "enemy") {
    log += "Enemy color countered you. Your command is canceled. ";
    applyCommand(enemy, "enemy");
  } else {
    log += "No color counter. Both commands resolve. ";
    applyCommand(player, "player");
    applyCommand(enemy, "enemy");
  }

  if (enemyHp <= 0 && playerHp <= 0) {
    log += "Both players reached 0 HP. Draw.";
  } else if (enemyHp <= 0) {
    log += "Enemy defeated. You win.";
  } else if (playerHp <= 0) {
    log += "You reached 0 HP. You lose.";
  }

  enemyPlan.shift();

  if (enemyPlan.length === 0) {
    createEnemyPlan();
    log += " Enemy plan refreshed.";
  }

  selectedCard = null;

  updateUI();
  renderPlayerHand();
  renderEnemySlots();
  writeLog(log);
}

function checkCounter(playerColor, enemyColor) {
  if (playerColor === "Red" && enemyColor === "Blue") return "player";
  if (playerColor === "Blue" && enemyColor === "Green") return "player";
  if (playerColor === "Green" && enemyColor === "Red") return "player";

  if (enemyColor === "Red" && playerColor === "Blue") return "enemy";
  if (enemyColor === "Blue" && playerColor === "Green") return "enemy";
  if (enemyColor === "Green" && playerColor === "Red") return "enemy";

  return "none";
}

function applyCommand(card, owner) {
  if (card.command === "Attack") {
    if (distance <= 3) {
      if (owner === "player") {
        enemyHp--;
      } else {
        playerHp--;
      }
    }
  }

  if (card.command === "Dodge") {
    if (owner === "player") {
      distance = Math.min(5, distance + 1);
    } else {
      distance = Math.min(5, distance + 1);
    }
  }

  if (card.command === "Move Forward") {
    distance = Math.max(0, distance - 1);
  }

  if (card.command === "Move Backward") {
    distance = Math.min(5, distance + 1);
  }
}

function updateUI() {
  document.getElementById("playerHp").textContent = playerHp;
  document.getElementById("enemyHp").textContent = enemyHp;
  document.getElementById("playerStagger").textContent = playerStagger;
  document.getElementById("enemyStagger").textContent = enemyStagger;
  document.getElementById("prediction").textContent = prediction;
  document.getElementById("distance").textContent = distance;
}

function writeLog(text) {
  document.getElementById("log").textContent = text;
}

function resetGame() {
  playerHp = 10;
  enemyHp = 10;
  playerStagger = 3;
  enemyStagger = 3;
  prediction = 3;
  distance = 2;
  selectedCard = null;

  createEnemyPlan();
  updateUI();
  renderPlayerHand();
  renderEnemySlots();

  document.getElementById("selectedCard").textContent = "No card selected.";
  writeLog("Game reset. Select a card to begin.");
}

createEnemyPlan();
renderPlayerHand();
renderEnemySlots();
updateUI();
