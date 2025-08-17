let raetselData = [];
let currentIndex = 0;

const landing = document.getElementById("landing");
const startButton = document.getElementById("start-button");
const raetselContainer = document.getElementById("raetsel-container");

const titelElem = document.getElementById("raetsel-titel");
const beschreibungElem = document.querySelector(".beschreibung");
const frageElem = document.querySelector(".frage");
const input = document.getElementById("answer");
const feedback = document.getElementById("feedback");
const submit = document.getElementById("submit");

// Landing -> Rätsel starten
startButton.addEventListener("click", () => {
  landing.className = "hidden";
  raetselContainer.classList.remove("hidden");
  loadRätsel(currentIndex);
});

// JSON laden
fetch("raetsel.json")
  .then(res => res.json())
  .then(data => {
    raetselData = data;
  })
  .catch(err => {
    alert("Fehler beim Laden der Rätseldaten: " + err);
  });

// Rätsel laden
function loadRätsel(index) {
  const raetsel = raetselData[index];
  if (!raetsel) {
    // titelElem.textContent = "Glückwunsch!";
    // beschreibungElem.textContent = "Ihr habt alle Rätsel gelöst.";
    // frageElem.textContent = "";
    // input.style.display = "none";
    // submit.style.display = "none";
    // feedback.textContent = "";
    raetselContainer.className = "hidden";
    endpage.className = "banner style3 orient-center content-align-center image-position-center fullscreen onload-image-fade-in onload-content-fade-right";
    return;
  }
  titelElem.textContent = `Rätsel Nummer ${raetsel.nummer}`; // dynamisch
  beschreibungElem.textContent = raetsel.beschreibung;
  frageElem.textContent = raetsel.frage;
  input.value = "";
  input.dataset.answer = raetsel.antwort;
  feedback.textContent = "";

  // vorherige Klassen entfernen
  input.classList.remove("correct", "wrong", "shake");

}

// Antwort prüfen
function checkAnswer() {
  const userAnswer = input.value.trim();
  const correctAnswer = input.dataset.answer;

  // vorherige Klassen entfernen
  input.classList.remove("correct", "wrong", "shake");

  if (userAnswer === correctAnswer) {
    feedback.textContent = "Richtig! Weiter zum nächsten Rätsel...";
    feedback.className = "feedback correct";
    input.classList.add("correct");
    setTimeout(() => {
      currentIndex++;
      loadRätsel(currentIndex);
    }, 1000);
  } else {
    feedback.textContent = "Falsch, versuch's nochmal.";
    feedback.className = "feedback wrong";

    input.classList.add("wrong");
    input.classList.add("shake");
    input.addEventListener("animationend", () => {
      input.classList.remove("shake");
    }, { once: true });
  }
}

submit.addEventListener("click", checkAnswer);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") checkAnswer();
});
