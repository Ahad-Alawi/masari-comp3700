/* Smaller interactive features carried over from Part II.
   These examples use client-side JavaScript only; they do not create
   real user accounts, send advisor messages, or save personal data. */
// Majors Explorer: start with the existing six cards from the Part II website.
// The dropdowns are linked: selecting a field changes the majors available.
const majorFilter = document.getElementById('majorsFilter');
if (majorFilter) {
  const fieldSelect = document.getElementById('majorField');
  const majorSelect = document.getElementById('majorChoice');
  const cardsContainer = document.getElementById('majorCards');
  const cards = Array.from(cardsContainer.querySelectorAll('article'));

  // Keep the major name, field and its card together for searching.
  const majors = cards.map(function (card) {
    return {
      name: card.querySelector('h2').textContent.trim(),
      field: card.querySelector('.badge').textContent.trim(),
      card: card
    };
  });

  // Rebuild the major dropdown using only majors in the selected field.
  function updateMajorOptions() {
    majorSelect.replaceChildren();
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All majors';
    majorSelect.appendChild(allOption);
    majors.forEach(function (item) {
      if (fieldSelect.value === '' || item.field === fieldSelect.value) {
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = item.name;
        majorSelect.appendChild(option);
      }
    });
    majorSelect.value = '';
  }

  // Show cards that match both the field and the selected major.
  function showMatchingMajors() {
    let visible = 0;
    majors.forEach(function (item) {
      const matchesField = fieldSelect.value === '' || item.field === fieldSelect.value;
      const matchesMajor = majorSelect.value === '' || item.name === majorSelect.value;
      const show = matchesField && matchesMajor;
      item.card.classList.toggle('d-none', !show);
      if (show) visible++;
    });
    document.getElementById('majorCount').textContent = 'Showing ' + visible + ' of ' + majors.length + ' majors.';
    document.getElementById('majorNoResults').classList.toggle('d-none', visible !== 0);
  }

  fieldSelect.addEventListener('change', function () {
    updateMajorOptions();
    showMatchingMajors();
  });
  majorSelect.addEventListener('change', showMatchingMajors);
  majorFilter.addEventListener('reset', function () {
    // Reset happens after the event; restore the dropdown choices for all fields.
    setTimeout(function () { updateMajorOptions(); showMatchingMajors(); }, 0);
  });

  const addMajorForm = document.getElementById('addMajorForm');
  addMajorForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addMajorForm.classList.add('was-validated');
    if (!addMajorForm.checkValidity()) return;

    const name = document.getElementById('newMajorName').value.trim();
    const field = document.getElementById('newMajorField').value;
    const description = document.getElementById('newMajorDescription').value.trim();
    const message = document.getElementById('addMajorMessage');
    if (majors.some(function (item) { return item.name.toLowerCase() === name.toLowerCase(); })) {
      message.className = 'alert alert-warning mt-3';
      message.textContent = 'This major is already in the list.';
      return;
    }

    // Create a new Bootstrap card using the same layout as the original cards.
    const column = document.createElement('article');
    column.className = 'col-md-6 col-lg-4';
    const card = document.createElement('div');
    card.className = 'card h-100 shadow-sm';
    const body = document.createElement('div');
    body.className = 'card-body';
    const heading = document.createElement('h2');
    heading.className = 'h5';
    heading.textContent = name;
    const fieldParagraph = document.createElement('p');
    fieldParagraph.className = 'mb-1';
    const badge = document.createElement('span');
    badge.className = 'badge text-bg-info';
    badge.textContent = field;
    fieldParagraph.appendChild(badge);
    const details = document.createElement('p');
    details.className = 'text-secondary mb-0';
    details.textContent = description;
    body.append(heading, fieldParagraph, details);
    card.appendChild(body);
    column.appendChild(card);
    cardsContainer.appendChild(column);
    majors.push({ name: name, field: field, card: column });

    // Show the added major and include it in the second dropdown.
    fieldSelect.value = field;
    updateMajorOptions();
    majorSelect.value = name;
    showMatchingMajors();
    addMajorForm.reset();
    addMajorForm.classList.remove('was-validated');
    message.className = 'alert alert-success mt-3';
    message.textContent = name + ' was added. It is now available in the dropdown.';
  });

  updateMajorOptions();
  showMatchingMajors();
}
// Compare Majors: each major has sample information for the comparison.
// The information is illustrative and does not represent official SQU course plans or Oman job demand.
const compareForm = document.getElementById('compareForm');
if (compareForm) {
  const majorDetails = {
    'Computer Science': { duration: '4 years (example)', content: 'Programming, algorithms and databases', careers: 'Software developer, systems analyst', field: 'Technology' },
    'Statistics': { duration: '4 years (example)', content: 'Probability, statistics and data analysis', careers: 'Data analyst, statistician', field: 'Science' },
    'Business Administration': { duration: '4 years (example)', content: 'Management, marketing and finance', careers: 'Marketing officer, business administrator', field: 'Business' },
    'Civil Engineering': { duration: '4 years (example)', content: 'Structures, construction and surveying', careers: 'Civil engineer, site engineer', field: 'Engineering' },
    'Nursing': { duration: '4 years (example)', content: 'Patient care, anatomy and clinical practice', careers: 'Nurse, clinical care specialist', field: 'Health' },
    'Education': { duration: '4 years (example)', content: 'Teaching methods, learning and curriculum', careers: 'Teacher, education coordinator', field: 'Education' }
  };

  // Create a cell as plain text; we do not insert form values as HTML.
  function comparisonCell(row, text, heading) {
    const cell = document.createElement(heading ? 'th' : 'td');
    cell.textContent = text;
    if (heading) cell.scope = 'row';
    row.appendChild(cell);
  }

  function updateComparison() {
    const first = document.getElementById('majorA').value;
    const second = document.getElementById('majorB').value;
    const result = document.getElementById('compareResult');
    const rows = document.getElementById('compareRows');
    rows.replaceChildren();
    if (!first || !second || first === second) {
      document.getElementById('compareHeadA').textContent = 'First major';
      document.getElementById('compareHeadB').textContent = 'Second major';
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 3;
      cell.className = 'text-secondary';
      cell.textContent = first && second && first === second ?
        'Please choose two different majors.' : 'Choose two different majors to see the comparison.';
      row.appendChild(cell);
      rows.appendChild(row);
      result.className = first && second ? 'alert alert-warning mt-3' : 'mt-3';
      result.textContent = first && second ? 'Choose two different majors to compare.' : '';
      return;
    }

    document.getElementById('compareHeadA').textContent = first;
    document.getElementById('compareHeadB').textContent = second;
    const criteria = [
      ['Field', 'field'],
      ['Duration', 'duration'],
      ['Study content', 'content'],
      ['Example careers', 'careers']
    ];
    criteria.forEach(function (criterion) {
      const row = document.createElement('tr');
      comparisonCell(row, criterion[0], true);
      comparisonCell(row, majorDetails[first][criterion[1]], false);
      comparisonCell(row, majorDetails[second][criterion[1]], false);
      rows.appendChild(row);
    });
    result.className = 'alert alert-success mt-3';
    result.textContent = 'Showing ' + first + ' and ' + second + ' in the table.';
  }

  // Update when the Compare button is clicked or either dropdown changes.
  compareForm.addEventListener('submit', function (event) {
    event.preventDefault();
    compareForm.classList.add('was-validated');
    updateComparison();
  });
  document.getElementById('majorA').addEventListener('change', updateComparison);
  document.getElementById('majorB').addEventListener('change', updateComparison);
}
// Prevent demo registration and login from leaking credentials via GET URLs.
document.querySelectorAll('.demo-form').forEach(function (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.checkValidity()) return;
    const result = form.querySelector('.demo-result');
    result.className = 'demo-result alert alert-info mt-3';
    result.textContent = form.getAttribute('data-demo-message') || 'Demo form checked. No data was sent or saved.';
  });
});
// Prepare an email draft through the user's mail client (no server required).
const contactForm = document.getElementById('contactForm');
if (contactForm) contactForm.addEventListener('submit', function (event) {
  event.preventDefault();
  if (!contactForm.checkValidity()) return;
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const reason = document.getElementById('contactReason').value;
  const message = document.getElementById('contactMessage').value.trim();
  if (!name || !email || !message) return;
  const subject = encodeURIComponent('Masari: ' + reason);
  const body = encodeURIComponent('From: ' + name + '\nEmail: ' + email + '\n\n' + message);
  document.getElementById('contactResult').textContent = 'Opening your email application. Please press Send there to deliver the message.';
  window.location.href = 'mailto:ahadalalawi76@gmail.com?subject=' + subject + '&body=' + body;
});
