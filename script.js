const defaultQuestions = [
  "How do you see us attending church long-term? Together every week? Separately sometimes?",
  "Would you expect me to fully participate in Mass, or just respectfully attend? How would you feel if I never fully participated?",
  "How would you feel if I didn’t pray to Mary or the saints?",
  "I'm not sure I feel comfortable teaching kids to pray to Mary or saints, is that a must? What if we agreed to tell them what you do, and they can watch but not needing them to memorize it?",
  "How do you see Scripture being used in a hypothetical home ?",
  "How would we raise kids spiritually?",
  "How would you feel if I wanted their foundation to be non-denominational beliefs?",
  "Would you feel disappointed long-term if I stayed non-denominational?",
  "Do you feel comfortable talking to me about your doubts, questions, or changes?",
  "What does partnership mean to you when it comes to faith decisions?",
  "What would spiritual life in hypothetical home look like day to day? What about non-denom camps, Christmas plays, baby blessings, baptism?",
  "When you picture your future wife and family, what does faith look like in that vision? ",
  "If we stay different in denomination, how do you think that affects marriage long-term? What could we do to alleviate any negative effects?",
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

document.getElementById("downloadDocxBtn").onclick = () => {
  generateWordDoc();
};

async function generateWordDoc() {
  const { Document, Packer, Paragraph, HeadingLevel } = window.docx;

  let docChildren = [
    new Paragraph({
      text: "Faith & Daily Life Discussion Responses",
      heading: HeadingLevel.HEADING_1
    })
  ];

  questions.forEach((q, i) => {
    if (answers[i] && answers[i].trim() !== "") {
      docChildren.push(
        new Paragraph({
          text: `Q: ${q}`,
          heading: HeadingLevel.HEADING_2
        })
      );

      docChildren.push(
        new Paragraph({
          text: `A: ${answers[i]}`
        })
      );
    }
  });

  const doc = new Document({
    sections: [{ children: docChildren }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Faith_Discussion_Responses.docx");
}
