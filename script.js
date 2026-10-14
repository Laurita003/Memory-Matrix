// Spielvariablen
const board = document.getElementById("board");
const startButton = document.getElementById("start");
const levelDisplay = document.getElementById("level");
const bestDisplay = document.getElementById("best");
const message = document.getElementById("message");

let sequence = [];
let playerSequence = [];
let level = 0;
let isPlaying = false;
let bestScore = Number(localStorage.getItem("memoryBest")) || 0;

// Spielfeld erstellen
for (let i = 0; i < 9; i++) {
  const tile = document.createElement("button");
  tile.classList.add("tile");
  tile.type = "button";
  tile.setAttribute("aria-label", `Feld ${i + 1}`);
  tile.disabled = true;
  tile.addEventListener("click", () => handleTileClick(i));
  board.appendChild(tile);
}

const tiles = document.querySelectorAll(".tile");

bestDisplay.textContent = bestScore;

// Spiel starten
startButton.addEventListener("click", startGame);

function startGame() {
  sequence = [];
  level = 0;
  levelDisplay.textContent = level;
  startButton.disabled = true;
  nextRound();
}

// Neue Runde beginnen
function nextRound() {
  playerSequence = [];
  isPlaying = false;

  tiles.forEach((tile) => {
    tile.disabled = true;
    tile.classList.remove("active");
  });

  const nextTile = Math.floor(Math.random() * tiles.length);
  sequence.push(nextTile);

  message.textContent = "Merke dir die leuchtenden Felder!";
  showSequence();
}

// Reihenfolge anzeigen
async function showSequence() {
  for (const index of sequence) {
    tiles[index].classList.add("active");
    await wait(600);
    tiles[index].classList.remove("active");
    await wait(250);
  }

  isPlaying = true;
  tiles.forEach((tile) => {
    tile.disabled = false;
  });

  message.textContent = "Jetzt bist du dran!";
}

// Feld anklicken
function handleTileClick(index) {
  if (!isPlaying) return;

  tiles[index].classList.add("active");
  setTimeout(() => tiles[index].classList.remove("active"), 200);

  playerSequence.push(index);

  const currentStep = playerSequence.length - 1;

  if (playerSequence[currentStep] !== sequence[currentStep]) {
    endGame();
    return;
  }

  if (playerSequence.length === sequence.length) {
    isPlaying = false;
    level++;
    levelDisplay.textContent = level;

    if (level > bestScore) {
      bestScore = level;
      bestDisplay.textContent = bestScore;
      localStorage.setItem("memoryBest", bestScore);
    }

    message.textContent = "Sehr gut! Die nächste Runde kommt...";
    tiles.forEach((tile) => {
      tile.disabled = true;
    });

    setTimeout(nextRound, 1000);
  }
}

// Spiel beenden
function endGame() {
  isPlaying = false;
  tiles.forEach((tile) => {
    tile.disabled = true;
  });

  message.textContent = `Spiel vorbei! Du hast Runde ${level + 1} nicht geschafft.`;
  startButton.disabled = false;
  startButton.textContent = "Nochmal spielen";
}

// Wartezeit
function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}