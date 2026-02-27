const defaultQuestions = [
  "How do you see us attending church long-term? Together every week? Separately sometimes?",
  "Would you expect me to fully participate in Mass, or just respectfully attend? How would you feel if I never fully participated?",
  "How would you feel if I didn’t pray to Mary or the saints?",
  "I'm not sure I feel comfortable teaching kids to pray to Mary or saints, is that a must? What if we agreed to tell them what you do, and they can watch but not needing them to memorize it?",
  "Would you feel disappointed long-term if I stayed non-denominational?",
  "When you picture your future wife and family, what does faith look like in that vision? ",
  "If we stay different in denomination, how do you think that affects marriage long-term? What could we do to alleviate any negative effects?",
  "If I never became Catholic and stayed firm in my beliefs, would you still feel fully at peace building a life with me?",
  "What does partnership mean to you when it comes to faith decisions?",
  "How do you see Scripture being used in a hypothetical home ?",
  "How would we describe what faith is?",
  "How would we describe why we believe different things?",
  "How would you feel if I wanted their foundation to be non-denominational beliefs?",
  "Do you feel comfortable talking to me about your doubts, questions, or changes?",
  "What would spiritual life in hypothetical home look like day to day? What about non-denom camps, Christmas plays, baby blessings, baptism?"

];

let questions = JSON.parse(localStorage.getItem("questions")) || defaultQuestions;
let answers = JSON.parse(localStorage.getItem("answers")) || {};
let currentIndex = 0;

const questionText = document.getElementById("questionText");
const questionCount = document.getElementById("questionCount");
const answerInput = document.getElementById("answerInput");

// Handle duplicate buttons safely
const nextBtns = document.querySelectorAll("#nextBtn");
const prevBtns = document.querySelectorAll("#prevBtn");

function renderQuestion() {
  questionText.textContent = questions[currentIndex];
  questionCount.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  answerInput.value = answers[currentIndex] || "";
}

function saveAnswer() {
  answers[currentIndex] = answerInput.value;
  localStorage.setItem("answers", JSON.stringify(answers));
}

nextBtns.forEach(btn => {
  btn.onclick = () => {
    saveAnswer();
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
    }
  };
});

prevBtns.forEach(btn => {
  btn.onclick = () => {
    saveAnswer();
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  };
});

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

document.getElementById("resetBtn").onclick = () => {
  delete answers[currentIndex];
  localStorage.setItem("answers", JSON.stringify(answers));
  answerInput.value = "";
};

renderQuestion();

// Download all answers as TXT
document.getElementById("downloadTxtBtn").onclick = () => {
  let content = "Faith & Daily Life Discussion Responses\n\n";

  questions.forEach((q, i) => {
    if (answers[i] && answers[i].trim() !== "") {
      content += `Question ${i + 1}:\n${q}\n\n`;
      content += `Answer:\n${answers[i]}\n`;
      content += "----------------------------------------\n\n";
    }
  });

  if (content.trim() === "Faith & Daily Life Discussion Responses") {
    alert("No answers to download yet!");
    return;
  }

  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "Faith_Discussion_Answers.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
