/* Original Masari guessing game. Each question has three clues, four possible
   majors and one answer. JavaScript replaces the question content in the DOM,
   checks the clicked answer, updates the score, and enables Next.
   The player can restart after five questions. No external game script used. */
const questions = [
  { clues: 'Programming • Algorithms • Databases', answer: 'Computer Science' },
  { clues: 'Probability • Data Analysis • Surveys', answer: 'Statistics' },
  { clues: 'Roads • Bridges • Construction', answer: 'Civil Engineering' },
  { clues: 'Patient Care • Clinical Practice • Health', answer: 'Nursing' },
  { clues: 'Teaching • Classroom • Curriculum', answer: 'Education' }
];
const options = ['Computer Science', 'Statistics', 'Civil Engineering', 'Nursing', 'Education', 'Business Administration'];
let currentQuestion = 0;
let score = 0;
let answered = false;
function showGameQuestion() {
  answered = false;
  const q = questions[currentQuestion];
  document.getElementById('gameStep').textContent = 'Question ' + (currentQuestion + 1) + ' / ' + questions.length;
  document.getElementById('gameScore').textContent = 'Score: ' + score;
  document.getElementById('gameClues').textContent = q.clues;
  document.getElementById('gamePrompt').textContent = 'Which major matches these clues?';
  document.getElementById('gameFeedback').replaceChildren();
  document.getElementById('gameNext').classList.add('d-none');
  const choiceBox = document.getElementById('gameOptions');
  choiceBox.replaceChildren();
  // Include the correct option and three fixed distractors, then sort them.
  const choices = [q.answer].concat(options.filter(function (x) { return x !== q.answer; }).slice(0, 3)).sort();
  choices.forEach(function (label) {
    const wrap = document.createElement('div');
    wrap.className = 'col-sm-6';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-outline-primary w-100 py-3';
    button.textContent = label;
    button.addEventListener('click', function () { checkGameAnswer(label, button); });
    wrap.appendChild(button);
    choiceBox.appendChild(wrap);
  });
}
function checkGameAnswer(choice, selectedButton) {
  if (answered) return;
  answered = true;
  const correct = choice === questions[currentQuestion].answer;
  if (correct) score++;
  document.getElementById('gameScore').textContent = 'Score: ' + score;
  document.querySelectorAll('#gameOptions button').forEach(function (button) {
    button.disabled = true;
    if (button.textContent === questions[currentQuestion].answer) {
      button.className = 'btn btn-success w-100 py-3';
    } else if (button === selectedButton) {
      button.className = 'btn btn-danger w-100 py-3';
    }
  });
  const feedback = document.getElementById('gameFeedback');
  feedback.className = correct ? 'alert alert-success mt-3' : 'alert alert-warning mt-3';
  feedback.textContent = correct ? 'Correct answer! +1 point.' : 'The correct answer is ' + questions[currentQuestion].answer + '.';
  document.getElementById('gameNext').textContent = currentQuestion === questions.length - 1 ? 'See final result' : 'Next question';
  document.getElementById('gameNext').classList.remove('d-none');
}
document.getElementById('gameNext').addEventListener('click', function () {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showGameQuestion();
  } else {
    document.getElementById('gamePrompt').textContent = 'Game finished!';
    document.getElementById('gameClues').textContent = 'Your score: ' + score + ' out of ' + questions.length + '.';
    document.getElementById('gameStep').textContent = 'Complete';
    document.getElementById('gameOptions').replaceChildren();
    document.getElementById('gameFeedback').replaceChildren();
    document.getElementById('gameNext').classList.add('d-none');
    document.getElementById('gameRestart').classList.remove('d-none');
  }
});
document.getElementById('gameRestart').addEventListener('click', function () {
  score = 0;
  currentQuestion = 0;
  document.getElementById('gameRestart').classList.add('d-none');
  showGameQuestion();
});
showGameQuestion();
