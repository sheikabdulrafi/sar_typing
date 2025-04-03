const presetText = "The quick brown fox jumps over the lazy dog.";
const textContainer = document.getElementById("text-container");
const inputField = document.getElementById("input-field");
const keyboard = document.getElementById("keyboard");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");

let startTime = null;
let timeLeft = 60;
let timerInterval;
let isTestRunning = false;

function renderText() {
  textContainer.innerHTML = presetText
    .split("")
    .map((char, index) => `<span id='char-${index}'>${char}</span>`)
    .join("");
}

function renderKeyboard() {
  const keys = "abcdefghijklmnopqrstuvwxyz".split("").concat([" ", ".", ","]);
  keys.forEach((key) => {
    const keyElement = document.createElement("div");
    keyElement.classList.add("key");
    keyElement.textContent = key;
    keyElement.id = `key-${key}`;
    keyboard.appendChild(keyElement);
  });
}

// Start Typing Test
function startTest() {
  inputField.value = "";
  inputField.removeAttribute("disabled");
  inputField.focus();
  startButton.disabled = true;
  restartButton.disabled = false;
  timeLeft = 60;
  isTestRunning = true;
  startTime = new Date();
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  wpmDisplay.textContent = "WPM: 0";
  accuracyDisplay.textContent = "Accuracy: 100%";

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
      endTest();
    }
  }, 1000);
}

// End Typing Test
function endTest() {
  isTestRunning = false;
  inputField.setAttribute("disabled", "true");
  clearInterval(timerInterval);
}

// Typing Input Handling
inputField.addEventListener("input", () => {
  if (!isTestRunning) return;

  const userInput = inputField.value;
  const wordsTyped = userInput.split(" ").length;
  const timeElapsed = (new Date() - startTime) / 1000 / 60; // Time in minutes
  const wpm = Math.round(wordsTyped / timeElapsed || 0);
  wpmDisplay.textContent = `WPM: ${wpm}`;

  let correctChars = 0;
  let totalChars = userInput.length;

  [...presetText].forEach((char, index) => {
    const span = document.getElementById(`char-${index}`);
    if (index < userInput.length) {
      span.textContent = userInput[index];
      span.classList.toggle("wrong", userInput[index] !== char);
      if (userInput[index] === char) correctChars++;
    } else {
      span.textContent = char;
      span.classList.remove("wrong");
    }
  });

  const accuracy = totalChars
    ? Math.round((correctChars / totalChars) * 100)
    : 100;
  accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
});

// Restart Test
restartButton.addEventListener("click", () => {
  inputField.value = "";
  startTime = null;
  isTestRunning = false;
  clearInterval(timerInterval);
  timerDisplay.textContent = "Time: 60s";
  wpmDisplay.textContent = "WPM: 0";
  accuracyDisplay.textContent = "Accuracy: 100%";
  startButton.disabled = false;
  restartButton.disabled = true;
  inputField.setAttribute("disabled", "true");
  renderText();
});

// Initialize
renderText();
renderKeyboard();
startButton.addEventListener("click", startTest);
