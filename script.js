function attack() {
  document.getElementById("enemyHp").textContent = "80";
  document.getElementById("result").textContent =
    "You used Attack Card. The enemy takes 20 damage.";
}

function defend() {
  document.getElementById("playerHp").textContent = "100";
  document.getElementById("result").textContent =
    "You used Defense Card. Incoming damage is reduced.";
}

function predict() {
  document.getElementById("enemyIntent").textContent = "Attack";
  document.getElementById("result").textContent =
    "You used Prediction Card. The enemy intent is revealed.";
}
