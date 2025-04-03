
// JavaScript Code for SAR Typing Test
const textSamples = {
    easy: "The quick brown fox jumps over the lazy dog.",
    medium: "Typing tests are a fun way to measure your speed and accuracy. Practice makes perfect.",
    hard: "Complex sentences, including punctuation, numbers (1234567890) and symbols (!@#$%^&*) will truly test your typing abilities in a modern context."
};

let referenceText = "";
let startTime = null;
let timerInterval = null;
let topWPM = 0;
let slowestWPM = Infinity;
let previousTime = null;
let previousCorrectChars = 0;

// Elements
const currentTimeEl = document.getElementById("currentTime");
const currentDateEl = document.getElementById("currentDate");
const textDisplay = document.getElementById("textDisplay");
const userInput = document.getElementById("userInput");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const topSpeedEl = document.getElementById("topSpeed");
const currentSpeedEl = document.getElementById("currentSpeed");
const slowestSpeedEl = document.getElementById("slowestSpeed");
const difficultySelect = document.getElementById("difficulty");
const fontSizeSlider = document.getElementById("fontSize");
const virtualKeyboard = document.getElementById("virtualKeyboard");
const resultsModal = document.getElementById("resultsModal");
const resultsSummary = document.getElementById("resultsSummary");
const restartBtn = document.getElementById("restartBtn");
const keySound = document.getElementById("keySound");
const errorSound = document.getElementById("errorSound");

// Virtual Keyboard Layout (QWERTY)
const keyboardLayout = [
    ['`','1','2','3','4','5','6','7','8','9','0','-','=', 'Backspace'],
    ['Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
    ['Caps','a','s','d','f','g','h','j','k','l',';','\'','Enter'],
    ['Shift','z','x','c','v','b','n','m',',','.','/','Shift'],
    ['Space']
];

// Update Time and Date
function updateTimeAndDate() {
    const now = new Date();
    currentTimeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    const day = String(now.getDate()).padStart(2, '0');
    const weekday = now.toLocaleDateString('en-US', { weekday: 'short' });
    const month = now.toLocaleDateString('en-US', { month: 'short' });
    const year = now.getFullYear();
    currentDateEl.textContent = `${day}-${weekday}-${month}-${year}`;
}
setInterval(updateTimeAndDate, 1000);
updateTimeAndDate();

// Set Reference Text based on Difficulty
function setReferenceText() {
    referenceText = textSamples[difficultySelect.value];
    textDisplay.innerHTML = "";
    referenceText.split("").forEach(char => {
    const span = document.createElement("span");
    span.textContent = char;
    textDisplay.appendChild(span);
    });
    userInput.value = "";
    resetMetrics();
}

// Reset Metrics
function resetMetrics() {
    startTime = null;
    clearInterval(timerInterval);
    topWPM = 0;
    slowestWPM = Infinity;
    previousTime = null;
    previousCorrectChars = 0;
    updateProgress(0);
    topSpeedEl.textContent = "0";
    currentSpeedEl.textContent = "0";
    slowestSpeedEl.textContent = "0";
}

// Update progress bar and speeds
function updateProgress(correctCount) {
    const total = referenceText.length;
    const progress = (correctCount / total) * 100;
    progressFill.style.width = progress + "%";
    progressPercent.textContent = Math.floor(progress) + "%";
}

// Calculate WPM (using standard 5 characters per word)
function calculateWPM(charCount, elapsedSeconds) {
    return elapsedSeconds > 0 ? Math.round((charCount / 5) / (elapsedSeconds / 60)) : 0;
}

// Handle User Input
userInput.addEventListener("input", (e) => {
    if (!startTime) {
    // Start the timer on the first key press
    startTime = new Date();
    previousTime = startTime;
    timerInterval = setInterval(updateSpeedMetrics, 1000);
    }
    
    // Play key sound
    keySound.currentTime = 0;
    keySound.play();

    const inputText = userInput.value;
    const spans = textDisplay.querySelectorAll("span");
    let correctCount = 0;
    let allCorrect = true;
    for (let i = 0; i < spans.length; i++) {
    const char = inputText[i];
    if (char == null) {
        spans[i].classList.remove("correct", "incorrect");
        allCorrect = false;
    } else if (char === spans[i].textContent) {
        spans[i].classList.add("correct");
        spans[i].classList.remove("incorrect");
        correctCount++;
    } else {
        spans[i].classList.add("incorrect");
        spans[i].classList.remove("correct");
        allCorrect = false;
        // Play error sound on mistake
        errorSound.currentTime = 0;
        errorSound.play();
    }
    }
    updateProgress(correctCount);
    
    if (allCorrect && inputText.length === referenceText.length) {
    clearInterval(timerInterval);
    showResults();
    }
});

// Update Speed Metrics (WPM)
function updateSpeedMetrics() {
    const now = new Date();
    const elapsedTime = (now - startTime) / 1000; // seconds
    const correctChars = textDisplay.querySelectorAll("span.correct").length;
    const currentWPM = calculateWPM(correctChars, elapsedTime);
    currentSpeedEl.textContent = currentWPM;

    if (currentWPM > topWPM) {
    topWPM = currentWPM;
    topSpeedEl.textContent = topWPM;
    }
    if (currentWPM < slowestWPM && correctChars > 0) {
    slowestWPM = currentWPM;
    slowestSpeedEl.textContent = slowestWPM;
    }
}

// Virtual Keyboard: Generate keys and add animation on physical key press
function generateVirtualKeyboard() {
    virtualKeyboard.innerHTML = "";
    keyboardLayout.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");
    row.forEach(keyVal => {
        const keyDiv = document.createElement("div");
        keyDiv.classList.add("key");
        keyDiv.textContent = keyVal;
        keyDiv.dataset.key = keyVal.toLowerCase();
        rowDiv.appendChild(keyDiv);
    });
    virtualKeyboard.appendChild(rowDiv);
    });
}
generateVirtualKeyboard();

// Animate Virtual Key on Physical Key Press
document.addEventListener("keydown", (e) => {
    // Map some keys for display consistency (e.g., space, shift, etc.)
    let key = e.key.toLowerCase();
    if (key === " ") key = "space";
    // Find matching key in virtual keyboard
    const keys = document.querySelectorAll(".key");
    keys.forEach(k => {
    if (k.dataset.key === key || (k.textContent.toLowerCase() === key)) {
        k.classList.add("active");
        setTimeout(() => k.classList.remove("active"), 100);
    }
    });
});

// Controls: Difficulty change and Font Size adjustment
difficultySelect.addEventListener("change", setReferenceText);
fontSizeSlider.addEventListener("input", (e) => {
    textDisplay.style.fontSize = e.target.value + "px";
    userInput.style.fontSize = e.target.value + "px";
});

// Show Results in Modal
function showResults() {
    const now = new Date();
    const elapsedTime = (now - startTime) / 1000; // seconds
    const totalChars = referenceText.length;
    const accuracy = Math.round((textDisplay.querySelectorAll("span.correct").length / totalChars) * 100);
    const overallWPM = calculateWPM(textDisplay.querySelectorAll("span.correct").length, elapsedTime);
    resultsSummary.innerHTML = `
    Time: ${elapsedTime.toFixed(1)} seconds<br/>
    Accuracy: ${accuracy}%<br/>
    Overall WPM: ${overallWPM}
    `;
    resultsModal.style.display = "flex";
}

// Restart Test
restartBtn.addEventListener("click", () => {
    resultsModal.style.display = "none";
    setReferenceText();
});

// Initialize the test
setReferenceText();
