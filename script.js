const presetText = "The quick brown fox jumps over the lazy dog.";
const textContainer = document.getElementById("text-container");
const inputField = document.getElementById("input-field");
const keyboard = document.getElementById("keyboard");

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

inputField.addEventListener("input", () => {
  const userInput = inputField.value;
  [...presetText].forEach((char, index) => {
    const span = document.getElementById(`char-${index}`);
    if (index < userInput.length) {
      span.textContent = userInput[index];
      span.classList.toggle("wrong", userInput[index] !== char);
    } else {
      span.textContent = char;
      span.classList.remove("wrong");
    }
  });

  document
    .querySelectorAll(".key")
    .forEach((key) => key.classList.remove("pressed"));
  const lastKey = userInput[userInput.length - 1];
  const pressedKey = document.getElementById(`key-${lastKey}`);
  if (pressedKey) {
    pressedKey.classList.add("pressed");
    setTimeout(() => pressedKey.classList.remove("pressed"), 200);
  }
});

renderText();
renderKeyboard();
