
document.addEventListener("DOMContentLoaded", () => {
  // const container = document.querySelector(".content");
  // if (!content) return; // Falls wir auf einer Seite ohne Content Block sind

  const container = document.querySelector(".content");
  const input = document.getElementById("answer");
  const feedback = document.getElementById("feedback");
  const button = document.getElementById("submit");

  const correctAnswer = container.dataset.answer;
  const nextPage = container.dataset.next;

  function checkAnswer() {
    const userAnswer = input.value.trim();
    if (userAnswer === correctAnswer) {
      feedback.textContent = "Richtig! Weiter zum nächsten Rätsel...";
      feedback.className = "feedback correct";
      setTimeout(() => {
        if (nextPage) {
          window.location.href = nextPage;
        }
      }, 1500);
    } else {
      feedback.textContent = "Falsch, versuch's nochmal.";
      feedback.className = "feedback wrong";

      // Wackeleffekt
      input.classList.add("shake");
      input.addEventListener("animationend", () => {
        input.classList.remove("shake");
      }, { once: true });
    }
  }

  button.addEventListener("click", checkAnswer);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  });
});
