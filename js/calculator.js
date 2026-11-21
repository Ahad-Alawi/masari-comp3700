/* Skill calculator: estimates how many weeks a learning plan will take.
   Beginners use the full hours; "some experience" cuts the hours by 20%.
   Extra practice adds 20% more hours. Weeks = hours / hours-per-week,
   rounded up since a part-week still counts as a week. */
document.getElementById('calculatorForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) return;
  const targetHours = Number(document.getElementById('calcTarget').value);
  const weeklyHours = Number(document.getElementById('calcWeekly').value);
  const experience = document.getElementById('calcLevel').value;
  const extraPractice = document.getElementById('calcPractice').checked;
  const skill = document.getElementById('calcSkill').value;
  if (!(targetHours > 0 && targetHours <= 1000 && weeklyHours > 0 && weeklyHours <= 80)) return;
  let adjustedHours = targetHours;
  if (experience === 'some') {
    adjustedHours *= 0.8;
  } else {
    adjustedHours *= 1;
  }
  if (extraPractice && weeklyHours > 0) {
    adjustedHours *= 1.2;
  }
  const weeks = Math.ceil(adjustedHours / weeklyHours);
  let message;
  if (weeks <= 4) {
    message = 'This looks like a short learning plan.';
  } else if (weeks <= 12) {
    message = 'This is a medium-length learning plan.';
  } else {
    message = 'This is a longer plan. You may want to divide it into milestones.';
  }
  // Use DOM text nodes to avoid interpreting user data as HTML.
  const result = document.getElementById('calculatorResult');
  result.replaceChildren();
  const card = document.createElement('div');
  card.className = 'alert alert-info';
  const heading = document.createElement('h2');
  heading.className = 'h4';
  heading.textContent = skill + ': about ' + weeks + ' week' + (weeks === 1 ? '' : 's');
  const details = document.createElement('p');
  details.className = 'mb-1';
  details.textContent = 'Adjusted study hours: ' + adjustedHours.toFixed(1) + '. Weekly hours: ' + weeklyHours + '.';
  const advice = document.createElement('p');
  advice.className = 'mb-0';
  advice.textContent = message;
  card.append(heading, details, advice);
  result.appendChild(card);
});
