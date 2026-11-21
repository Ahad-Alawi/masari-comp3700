/* Custom validation for the feedback form (does not use the default
   password pattern). Checks: name = two or more words, email = full
   address pattern, comment = 15-300 characters, phone = optional Oman
   number. Adds Bootstrap's is-valid / is-invalid classes to each field. */
const feedbackForm = document.getElementById('feedbackForm');
// The form only displays feedback locally. It never uploads personal details.
function showFieldStatus(field, valid, message) {
  field.classList.toggle('is-valid', valid);
  field.classList.toggle('is-invalid', !valid);
  const feedback = field.parentElement.querySelector('.invalid-feedback');
  if (feedback && message) feedback.textContent = message;
}
feedbackForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Do not send any survey data to an external server.
  const name = document.getElementById('feedbackName');
  const email = document.getElementById('feedbackEmail');
  const comment = document.getElementById('feedbackComment');
  const phone = document.getElementById('feedbackPhone');
  const stage = document.getElementById('feedbackStudent');
  const rating = feedbackForm.querySelector('input[name="rating"]:checked');
  const nameOK = /^[\p{L}]+(?:[ '-][\p{L}]+)+$/u.test(name.value.trim());
  const emailOK = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.value.trim());
  const commentText = comment.value.trim();
  const commentOK = commentText.length >= 15 && commentText.length <= 300 && /\p{L}/u.test(commentText);
  const phoneOK = phone.value.trim() === '' || /^[79]\d{7}$/.test(phone.value.trim());
  const stageOK = stage.value !== '';
  showFieldStatus(name, nameOK, 'Write at least two words using letters (e.g. Aisha Ali).');
  showFieldStatus(email, emailOK, 'Enter a complete email address such as name@example.com.');
  showFieldStatus(comment, commentOK, 'Write 15–300 characters including letters.');
  showFieldStatus(phone, phoneOK, 'Use 8 digits starting with 7 or 9, or leave it blank.');
  showFieldStatus(stage, stageOK, 'Choose your study stage.');
  document.getElementById('ratingMessage').textContent = rating ? '' : 'Please select one rating.';
  const result = document.getElementById('feedbackResult');
  if (nameOK && emailOK && commentOK && phoneOK && stageOK && rating) {
    result.className = 'alert alert-success mt-3';
    result.textContent = 'Thank you for your feedback! This is a front-end demo, so your answers are not stored.';
    feedbackForm.reset();
    feedbackForm.classList.remove('was-validated');
    feedbackForm.querySelectorAll('.is-valid, .is-invalid').forEach(function (input) {
      input.classList.remove('is-valid', 'is-invalid');
    });
  } else {
    result.className = 'alert alert-danger mt-3';
    result.textContent = 'Please correct the highlighted fields and try again.';
  }
});
