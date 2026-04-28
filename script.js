let playerHp = 10;
let enemyHp = 10;
let playerStagger = 3;
let enemyStagger = 3;
let prediction = 3;
let distance = 2;

let selectedCard = null;

let playerCards = [
  { color: "Red", command: "Attack" },
  { color: "Red", command: "Attack" },
  { color: "Red", command: "Attack" },
  { color: "Blue", command: "Attack" },
  { color: "Blue", command: "Attack" },
  { color: "Green", command: "Attack" },
  { color: "Green", command: "Attack" }
];

const startingHand = [  
  { color: "Red", command: "Attack" },
  { color: "Red", command: "Attack" },
  { color: "Red", command: "Attack" },
  { color: "Blue", command: "Attack" },
  { color: "Blue", command: "Attack" },
  { color: "Green", command: "Attack" },
  { color: "Green", command: "Attack" }
];

let queuedCards = [];


let enemyPlan = [];

const colors = ["Red", "Blue", "Green"];
const commands = ["Attack", "Dodge", "Move Forward", "Move Backward"];

function createEnemyPlan() {

  enemyPlan = [];

  for (let i = 0; i < 5; i++) {
    enemyPlan.push({
      color: colors[Math.floor(Math.random() * colors.length)],
      command: commands[Math.floor(Math.random() * commands.length)],
      revealed: true
    });
  }
}

function renderPlayerHand() {
  const hand = document.getElementById("playerHand");
  hand.innerHTML = "";

  if (queuedCards.length === 0) {
    playerCards = [];
    startingHand.forEach(card => playerCards.push({ ...card }));
  }

  playerCards.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = `card ${card.color.toLowerCase()}`;

    if (selectedCard === index) {
      div.classList.add("selected");
    }

    div.innerHTML = `
      <h3>${card.color} Card</h3>

      <select class="command-select" id="command-${index}" onclick="event.stopPropagation()">
        <option value="Attack">Attack</option>
        <option value="Dodge">Dodge</option>
        <option value="Move Forward">Move Forward</option>
        <option value="Move Backward">Move Backward</option>
      </select>

      <p>Click card to select</p>
    `;

    div.onclick = function () {
      selectedCard = index;

      const chosenCommand = document.getElementById(`command-${index}`).value;
      playerCards[index].command = chosenCommand;

      document.getElementById("selectedCard").textContent =
        `${card.color} ${chosenCommand} selected.`;

      renderPlayerHand();
    };

    hand.appendChild(div);
  });
}

function queueCard() {
  if (selectedCard === null) {
    writeLog("Select a card to queue first.");
    return;
  }

  if (queuedCards.length >= 5) {
    writeLog("You have queued 5 cards. Resolve the turn.");
    return;
  }
  queuedCards.push(playerCards[selectedCard]);
  playerCards.splice(selectedCard, 1);
  selectedCard = null;

  renderPlayerHand();
  renderQueuedCards();
}

function renderQueuedCards() {
  const queue = document.getElementById("queuedCards");
  queue.innerHTML = "";

  queuedCards.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = `card ${card.color.toLowerCase()}`;
    div.innerHTML = `
      <h3>${card.color} Card</h3>
      <p>${card.command}</p>
    `;
    queue.appendChild(div);
  });
}

function resetPlayerHand() {
  playerCards.length = 0;
  startingHand.forEach(card => playerCards.push({ ...card }));
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
  if (document.getElementById("resolveTurn").textContent === "Resolve Turn") {
    if (queuedCards.length < 5) {
      writeLog("Please queue 5 cards to resolve the turn.");
      return;
    }
  }

  const player = queuedCards[0];

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
  queuedCards.shift();

  if (enemyPlan.length === 0) {
    createEnemyPlan();
    log += " Enemy plan refreshed.";
  }

  selectedCard = null;

  updateUI();
  renderPlayerHand();
  renderQueuedCards();
  renderEnemySlots();
  writeLog(log);
  changeResolveButton();
}

function changeResolveButton() {
  const turnButton = document.getElementById("resolveTurn");
  if (queuedCards.length === 0) {
    turnButton.textContent = "Resolve Turn";
  } else {
    turnButton.textContent = "Continue Round";
  }
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
    distance = Math.min(5, distance + 1);
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

  playerCards.forEach(card => {
    card.command = undefined;
  });

  createEnemyPlan();
  updateUI();
  renderPlayerHand();
  renderEnemySlots();

  document.getElementById("selectedCard").textContent = "No card selected.";
  writeLog("Game reset. Select a color card and assign a command.");
}

createEnemyPlan();
renderPlayerHand();
renderEnemySlots();
updateUI();
