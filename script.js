const defaultQuestions = [
  "How do you see us attending church long-term? Together every week? Separately sometimes?",
  "Would you expect me to fully participate in Mass, or just respectfully attend?",
  "How would you feel if I didn’t pray to Mary or the saints?",
  "What would spiritual life in our home look like day to day?",
  "Would we pray together? And if so, how?",
  "How do you see Scripture being used in our home — personally interpreted or guided mainly by the Church?",
  "How would we raise our kids spiritually?",
  "Would you expect them to be baptized Catholic?",
  "Would they go through First Communion and Confirmation?",
  "How would you feel if I also wanted to teach them my non-denominational beliefs?",
  "How do you see us respecting each other’s convictions if they stay different?",
  "Would you ever hope I eventually convert?",
  "Would you feel disappointed long-term if I stayed non-denominational?",
  "When you make big spiritual decisions, how do you see including me in that process?",
  "Do you feel comfortable talking to me about your doubts, questions, or changes?",
  "What does partnership mean to you when it comes to faith decisions?",
  "When you picture your future wife and family, what does faith look like in that vision?",
  "Do you see us as spiritually unified, or peacefully different?",
  "If we stay different in denomination, how do you think that affects marriage long-term?",
  "If I never became Catholic and stayed firm in my beliefs, would you still feel fully at peace building a life with me?"
];

let questions = JSON.parse(localStorage.getItem("questions")) || defaultQuestions;
let answers = JSON.parse(localStorage.getItem("answers")) || {};
let currentIndex = 0;

const questionText = document.getElementById("questionText");
const questionCount = document.getElementById("questionCount");
const answerInput = document.getElementById("answerInput");

function renderQuestion() {
  questionText.textContent = questions[currentIndex];
  questionCount.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  answerInput.value = answers[currentIndex] || "";
}

function saveAnswer() {
  answers[currentIndex] = answerInput.value;
  localStorage.setItem("answers", JSON.stringify(answers));
}

document.getElementById("nextBtn").onclick = () => {
  saveAnswer();
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
};

document.getElementById("prevBtn").onclick = () => {
  saveAnswer();
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
};

document.getElementById("addQuestionBtn").onclick = () => {
  const newQ = document.getElementById("newQuestion").value.trim();
  if (!newQ) return;
  questions.push(newQ);
  localStorage.setItem("questions", JSON.stringify(questions));
  document.getElementById("newQuestion").value = "";
};

document.getElementById("revealBtn").onclick = () => {
  const grid = document.getElementById("notesGrid");
  grid.innerHTML = "";

  questions.forEach((q, i) => {
    if (answers[i]) {
      const note = document.createElement("div");
      note.className = "note";
      note.innerHTML = `<strong>${q}</strong><br><br>${answers[i]}`;
      grid.appendChild(note);
    }
  });

  document.getElementById("notesBoard").classList.remove("hidden");
};

renderQuestion();

document.getElementById("resetBtn").onclick = () => {
  if (!confirm("Clear this answer?")) return;

  // Remove only this answer
  delete answers[currentIndex];
  localStorage.setItem("answers", JSON.stringify(answers));

  // Clear textarea visually
  answerInput.value = "";
};
