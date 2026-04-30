//try and limit one type of command to one color, and try and add the combo system! Good luck bro :D

let playerHp = 10;
let enemyHp = 10;
let playerStagger = 3;
let enemyStagger = 3;
let prediction = 3;
let distance = 2;
let turnResolved = false;
let reset = false;

let redComboPlayer = 0;
let playerCharge = false
let blueComboPlayer = 0;
let greenComboPlayer = 0;

let redComboEnemy = 0;
let enemyCharge = false;
let blueComboEnemy = 0;
let greenComboEnemy = 0;

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

const blueHand = [  
  { color: "Red", command: "Attack" },
  { color: "Red", command: "Attack" },
  { color: "Blue", command: "Attack" },
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

const greenHand = [  
  { color: "Red", command: "Attack" },
  { color: "Blue", command: "Attack" },
  { color: "Blue", command: "Attack" },
  { color: "Blue", command: "Attack" },
  { color: "Green", command: "Attack" },
  { color: "Green", command: "Attack" },
  { color: "Green", command: "Attack" }
];

let selectedHand = startingHand;

let colorCommands = {
  Red: "Attack",
  Blue: "Attack",
  Green: "Attack"
};

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
      revealed: false
    });
  }
}

function renderPlayerHand() {
  const hand = document.getElementById("playerHand");
  const hands = [startingHand, blueHand, greenHand];
  hand.innerHTML = "";

  if (reset) {
    playerCards = [];
    selectedHand = hands[Math.floor(Math.random() * hands.length)];
    selectedHand.forEach(card => playerCards.push({ ...card }));
    reset = false;
  }

  playerCards.forEach(card => {
    card.command = colorCommands[card.color];
  });

  if (queuedCards.length === 0) {
    playerCards = [];
    selectedHand.forEach(card => playerCards.push({ ...card }));
    redComboPlayer = 0;
    blueComboPlayer = 0;
    greenComboPlayer = 0;
    redComboEnemy = 0;
    blueComboEnemy = 0;
    greenComboEnemy = 0;
  }

  playerCards.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = `card ${card.color.toLowerCase()}`;

    if (selectedCard === index) {
      div.classList.add("selected");
    }

    const command = colorCommands[card.color];
    div.innerHTML = `

      <p><strong>${command}</strong></p>
    `;

    div.onclick = function () {
      selectedCard = index;
      
      const selectedCardDiv = document.getElementById("selectedCard");
      selectedCardDiv.innerHTML = ""; // Clear previous content
      
      if (command === "Attack") {
        const img = document.createElement("img");
        img.src = "attack_command.png";
        img.style.maxWidth = "10%";
        img.style.height = "auto";
        selectedCardDiv.appendChild(img);
      } else if (command === "Dodge") {
        const img = document.createElement("img");
        img.src = "dodge_command.png";
        img.style.maxWidth = "10%";
        img.style.height = "auto";
        selectedCardDiv.appendChild(img);
        } else if (command === "Move Forward" || command === "Move Backward") {
          const img = document.createElement("img");
          img.src = "move_command.png";
          img.style.maxWidth = "10%";
          img.style.height = "auto";
          selectedCardDiv.appendChild(img);
        }
        else {
        selectedCardDiv.textContent = `${card.color} ${command} selected.`;
      }
      
      renderPlayerHand();
    };

    hand.appendChild(div);
    return selectedHand;
  });
}

function renderColorCommands() {
  const commandsContainer = document.getElementById("colorCommands");
  commandsContainer.innerHTML = ""; // Clear existing content
  
  const container = document.createElement("div");
  container.className = "color-commands";
  container.style.marginBottom = "20px";

  colors.forEach(color => {
    const label = document.createElement("label");
    label.style.marginRight = "20px";
    label.innerHTML = `
      ${color}: 
      <select id="command-${color}" onchange="updateColorCommand('${color}')">
        <option value="Attack" ${colorCommands[color] === "Attack" ? "selected" : ""}>Attack</option>
        <option value="Dodge" ${colorCommands[color] === "Dodge" ? "selected" : ""}>Dodge</option>
        <option value="Move Forward" ${colorCommands[color] === "Move Forward" ? "selected" : ""}>Move Forward</option>
        <option value="Move Backward" ${colorCommands[color] === "Move Backward" ? "selected" : ""}>Move Backward</option>
      </select>
    `;
    container.appendChild(label);
  });

  if (turnResolved) {
    container.style.display = "none";
    document.getElementsByClassName("command-hint")[0].textContent = "All commands are set.";
  }
  else {
    container.style.display = "block";
    document.getElementsByClassName("command-hint")[0].textContent = "Select a command for each card.";

  }

  commandsContainer.appendChild(container);
}

function updateColorCommand(color) {
  const newCommand = document.getElementById(`command-${color}`).value;
  colorCommands[color] = newCommand;
  
  playerCards.forEach(card => {
    if (card.color === color) {
      card.command = newCommand;
    }
  });

  renderPlayerHand();
  renderQueuedCards();
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

  if(document.getElementById("resolveTurn").textContent === "Continue Round") {
    writeLog("You must finish the current round first!");
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
      <p><strong>${colorCommands[card.color]}</strong></p>
    `;
    queue.appendChild(div);
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
        <p><strong>${card.command}</strong></p>
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

  let log = `You played ${player.color} ${colorCommands[player.color]}. `;
  log += `Enemy played ${enemy.color} ${enemy.command}. `;

  const result = checkCounter(player.color, enemy.color);

  if (result === "player") {
    log += "Your color countered the enemy. Enemy command is canceled.";
    log += " " + applyCommand(player, "player");
  } else if (result === "enemy") {
    log += "Enemy color countered you. Your command is canceled. ";
    log += " " + applyCommand(enemy, "enemy");
  } else if (result === "player-staggered") {
    log += "You have been staggered! Your command is canceled.";
    log += " " + applyCommand(enemy, "enemy");
  } else if (result === "enemy-staggered") {
    log += "The enemy has been staggered! Enemy command is canceled. ";
    log += " " + applyCommand(player, "player");
  } else {
    log += "No color counter. Both commands resolve. ";
    log += " " + applyCommand(player, "player");
    log += " " + applyCommand(enemy, "enemy");
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
  renderColorCommands();
  writeLog(log);
  changeResolveButton();
}

function changeResolveButton() {
  const turnButton = document.getElementById("resolveTurn");
  if (queuedCards.length === 0) {
    turnButton.textContent = "Resolve Turn";
    turnResolved = false;
    renderColorCommands();
  } else {
    turnButton.textContent = "Continue Round";
    turnResolved = true;
    renderColorCommands();
  }
}

function checkCounter(playerColor, enemyColor) {
  if (playerStagger <= 0) {
    playerStagger = 3;
    return "player-staggered";
  }
  if (enemyStagger <= 0) {
    enemyStagger = 3;
    return "enemy-staggered";
  }
  else {
    if (playerColor === "Red" && enemyColor === "Green") return "player";
    if (playerColor === "Green" && enemyColor === "Blue") return "player";
    if (playerColor === "Blue" && enemyColor === "Red") return "player";

    if (enemyColor === "Red" && playerColor === "Green") return "enemy";
    if (enemyColor === "Green" && playerColor === "Blue") return "enemy";
    if (enemyColor === "Blue" && playerColor === "Red") return "enemy";

    return "none";
  }
}

function applyCommand(card, owner) {
  let log = "";
  const enemy = enemyPlan[0];
  const player = queuedCards[0];
  
  if (owner === "player") {
    if (player.color === "Red") {
      redComboPlayer++;
      blueComboPlayer = 0;
      greenComboPlayer = 0;
      if (redComboPlayer >= 3) {
        playerCharge = true;
        log += "Red combo from the player! Next attack will be stronger.";
        redComboPlayer = 0;
      }
    } 
    else if (player.color === "Blue") {
      blueComboPlayer++;
      redComboPlayer = 0;
      greenComboPlayer = 0;
      if (blueComboPlayer >= 3) {
        playerStagger += 3;
        log += "Blue combo from the player! You gain 2 stagger.";
        blueComboPlayer = 0;
      }
    } 
    else if (player.color === "Green") {
      greenComboPlayer++;
      blueComboPlayer = 0;
      redComboPlayer = 0;
      if (greenComboPlayer >= 3) {
        prediction += 3;
        log += "Green combo from the player! You gain 2 predictions.";
        greenComboPlayer = 0;
      }
    }
  }

  if (owner === "enemy") {
    if (enemy.color === "Red") {
      redComboEnemy++;
      blueComboEnemy = 0;
      greenComboEnemy = 0;
      if (redComboEnemy >= 3) {
        enemyCharge = true;
        log += "Red combo from the enemy! Next attack will be stronger.";
        redComboEnemy = 0;
      }
    } 
    else if (enemy.color === "Blue") {
      blueComboEnemy++;
      redComboEnemy = 0;
      greenComboEnemy = 0;
      if (blueComboEnemy >= 3) {
        enemyStagger += 3;
        log += "Blue combo from the enemy! It gains 2 stagger.";
        blueComboEnemy = 0;
      }
    } 
    else if (enemy.color === "Green") {
      greenComboEnemy++;
      blueComboEnemy = 0;
      redComboEnemy = 0;
      if (greenComboEnemy >= 3) {
        log += "Green combo from the enemy! It gains 2 predictions(useless...)";
        greenComboEnemy = 0;
      }
    }
  }

  if (owner === "player") {
    if (colorCommands[card.color] === "Attack") {
      if (distance <= 3) {
        if (playerCharge === true) {
          enemyHp -= 3;
          playerCharge = false;
        } else {
          enemyHp--;
          enemyStagger--;
        }
      }
      playerCharge = false;
    }
  
    if (colorCommands[card.color] === "Dodge") {
      if (distance <= 3) {
        if (enemy.command === "Attack") {
          enemyStagger--;
        }
      }
      distance = Math.min(5, distance + 1);
    }
  }

  if (owner === "enemy") {
    if (card.command === "Attack") {
      if (distance <= 3) {
        if (enemyCharge === true) {
          playerHp -= 3;
          enemyCharge = false;
        } else {
          playerHp--;
          playerStagger--;
        }
      }
      enemyCharge = false;
    }

    if (card.command === "Dodge") {
      if (distance <= 3) {
        if (colorCommands[player.color] === "Attack") {
          playerStagger--;
        }
      }
      distance = Math.min(5, distance + 1);
    }
  }

  if (card.command === "Move Forward") {
    distance = Math.max(0, distance - 1);
  }
  if (card.command === "Move Backward") {
    distance = Math.min(5, distance + 1);
  }

  return log;
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
  turnResolved = false;

  colorCommands = {
    Red: "Attack",
    Blue: "Attack",
    Green: "Attack"
  };

  // Randomly select a hand from the three options

  reset = true;
  queuedCards = [];

  createEnemyPlan();
  updateUI();
  renderPlayerHand();
  renderEnemySlots();
  renderQueuedCards();
  document.getElementById("selectedCard").textContent = "No card selected.";

  writeLog("Game reset.");
}

createEnemyPlan();
renderPlayerHand();
renderEnemySlots();
updateUI();
renderColorCommands();
