/* Shared helpers for Masari Part III.
   Every form has Bootstrap's needs-validation class. This listener checks
   the built-in HTML constraints and shows Bootstrap feedback if invalid. */
document.querySelectorAll('form.needs-validation').forEach(function (form) {
  form.addEventListener('submit', function (event) {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  });
  form.addEventListener('reset', function () {
    form.classList.remove('was-validated');
    form.querySelectorAll('.is-valid, .is-invalid').forEach(function (field) {
      field.classList.remove('is-valid', 'is-invalid');
    });
  });
});
