const dateTag = document.getElementById("date");

let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

const footer = document.querySelector("footer");
const footerText = document.createElement("p");
footerText.textContent = `Copyright (c) ${year} Author. All Rights Reserved.`
footer.prepend(footerText);

dateTag.textContent = `Date: ${month}/${day}/${year}`;

const subjects = ["Math", "Science", "History"];
const today = date.toDateString();

let savedDate = localStorage.getItem("quizDate");
let subjectOfTheDay = localStorage.getItem("quizSubject");
const topic = document.getElementById("topic");

if(savedDate != today) {
  const randomIndex = Math.floor(Math.random() * subjects.length);
  subjectOfTheDay = subjects[randomIndex];

  localStorage.setItem("quizDate", today);
  localStorage.setItem("quizSubject", subjectOfTheDay);
}

topic.textContent = `Today's Topic: ${subjectOfTheDay}`;

let questions = [];
let currentQuestionIndex = 0;

async function loadQuestions() {
  const response = await fetch(`${subjectOfTheDay.toLowerCase()}.json`);
  const data = await response.json();
  questions = shuffle(data);
}

function shuffle(array) {
  for(let i = array.length-1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const btn = document.getElementById("startBtn");
const quizContainer = document.getElementById("quiz");
let score = 0;
const nextBtn = document.getElementById("next");
let currentQuestion = null;
const correct = document.getElementById("correctNum");
const incorrect = document.getElementById("incorrectNum");

nextBtn.addEventListener("click", () => {
  let selected;
  if(currentQuestion.type === "multiple-choice") {
    selected = document.querySelector('input[name="mcq"]:checked');
    if(!selected) {
      alert("Plase select an answer");
      return;
    }
    selected = selected.value;
  } else if(currentQuestion.type === "input") {
    const input = document.querySelector("input");
    selected = input.value;
  }
  if(selected.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase()) {
    ++score;
    correct.textContent = Number(correct.textContent) + 1;
  } else {
    incorrect.textContent = Number(incorrect.textContent) + 1;
  }

  quiz.classList.add("fade-out");

  setTimeout(() => {
    nextQuestion();

    quiz.classList.remove("fade-out");
    quiz.classList.add("fade-in");

    setTimeout(() => {
      quiz.classList.remove("fade-in");
    }, 300);
  }, 300);
});

function showQuestion() {
  currentQuestion = questions[currentQuestionIndex];
  quizContainer.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = currentQuestion.question;
  quizContainer.appendChild(title);

  if(currentQuestion.type === "multiple-choice") {
    const fieldset = document.createElement("fieldset");
    currentQuestion.options.forEach((option, index) => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "mcq";
      radio.value = option;

      label.appendChild(radio);
      label.appendChild(document.createTextNode(option));

      fieldset.appendChild(label);
      fieldset.appendChild(document.createElement("br"));
    });
    quizContainer.appendChild(fieldset);
  } else if(currentQuestion.type === "input") {
    const input = document.createElement("input");
    input.className = "textA";
    input.name = "answer";
    input.id = "answer";

    quizContainer.appendChild(input);
  }
}

function nextQuestion() {
  currentQuestionIndex++;
  if(currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    quizContainer.textContent = "Quiz Complete!";
    control.style.display = "none";

    setTimeout(() => {
      quitBtn.click();
    }, 1000);
  }
}

const startDiv = document.getElementById("start");
const control = document.getElementById("control");
const scoreDiv = document.getElementById("score");

btn.addEventListener("click", async () => {
  console.log("clicked");
  startDiv.style.display = "none";
  quizContainer.style.display = "flex";
  image.style.display = "none";
  scoreDiv.style.display = "flex";
  control.style.display = "flex";
  await loadQuestions();
  currentQuestionIndex = 0;
  showQuestion();
});


const quitBtn = document.getElementById("quit");
const image = document.getElementById("image");

quitBtn.addEventListener("click", () => {
  quizContainer.replaceChildren();
  quizContainer.style.display = "none";
  scoreDiv.style.display = "none";
  image.style.display = "flex";
  currentQuestionIndex = 0;
  score = 0;
  correctNum.textContent = "0";
  incorrectNum.textContent = "0";
  startDiv.style.display = "flex";
  control.style.display = "none";
});
