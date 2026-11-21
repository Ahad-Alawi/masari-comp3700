/* Two object constructors (Career, EmploymentRecord) with arrays of sample
   data, based on the Part II tables. The show functions redraw the table
   rows from the array. New rows added here only last until the page reloads. */

// Constructor 1: a career contains a field, job title, skills and a course.
function Career(field, title, skills, course) {
  this.field = field;
  this.title = title;
  this.skills = skills;
  this.course = course;
}
// Career examples adapted from the Part II table. Combined job titles are now separate rows.
const careers = [
  new Career('Technology', 'Software developer', 'Programming, problem solving', 'Web development'),
  new Career('Technology', 'Data analyst', 'Statistics, Excel, R or Python', 'Data analysis'),
  new Career('Business', 'Accountant', 'Accounting, Excel', 'Basic accounting'),
  new Career('Business', 'Marketing officer', 'Communication, marketing', 'Digital marketing'),
  new Career('Health', 'Nurse', 'Patient care, communication', 'First aid'),
  new Career('Health', 'Lab technician', 'Laboratory skills, accuracy', 'Laboratory safety')
];

// Constructor 2: one row stores sample counts of employed graduates.
function EmploymentRecord(major, year2022, year2023, year2024) {
  this.major = major;
  this.year2022 = year2022;
  this.year2023 = year2023;
  this.year2024 = year2024;
}
// Values taken from the Part II Employment Trends example table.
const employment = [
  new EmploymentRecord('Business Administration', 410, 430, 450),
  new EmploymentRecord('Computer Science', 300, 320, 380),
  new EmploymentRecord('Nursing', 240, 260, 290),
  new EmploymentRecord('Education', 270, 250, 260)
];

// Add text safely using textContent rather than inserting untrusted HTML.
function addCell(row, value) {
  const cell = document.createElement('td');
  cell.textContent = String(value);
  row.appendChild(cell);
}

// Display function 1: show matching career records in the table.
function showCareers(searchText) {
  const tbody = document.getElementById('careerRows');
  if (!tbody) return;
  tbody.replaceChildren();
  const query = searchText.trim().toLowerCase();
  const filtered = careers.filter(function (job) {
    return [job.field, job.title, job.skills, job.course].some(function (value) {
      return value.toLowerCase().includes(query);
    });
  });
  filtered.forEach(function (job) {
    const row = document.createElement('tr');
    addCell(row, job.field);
    addCell(row, job.title);
    addCell(row, job.skills);
    addCell(row, job.course);
    tbody.appendChild(row);
  });
  document.getElementById('careerCount').textContent = 'Showing ' + filtered.length + ' of ' + careers.length + ' careers.';
}

// Display function 2: show matching employment records.
function showEmployment(searchText) {
  const tbody = document.getElementById('employmentRows');
  if (!tbody) return;
  tbody.replaceChildren();
  const query = searchText.trim().toLowerCase();
  const filtered = employment.filter(function (item) {
    return item.major.toLowerCase().includes(query);
  });
  filtered.forEach(function (item) {
    const row = document.createElement('tr');
    addCell(row, item.major);
    addCell(row, item.year2022);
    addCell(row, item.year2023);
    addCell(row, item.year2024);
    tbody.appendChild(row);
  });
  document.getElementById('employmentCount').textContent = 'Showing ' + filtered.length + ' of ' + employment.length + ' majors.';
  drawEmploymentChart(filtered);
}


// Draw the chart from the SAME employment array used by the table.
// SVG draws shapes inside the page without extra CSS or a chart library.
function drawEmploymentChart(records) {
  const svg = document.getElementById('employmentChart');
  if (!svg) return;
  svg.replaceChildren();
  const namespace = 'http://www.w3.org/2000/svg';

  // Helper: make an SVG rectangle, line, or text label.
  function element(tag, properties, label) {
    const node = document.createElementNS(namespace, tag);
    for (const key in properties) node.setAttribute(key, properties[key]);
    if (label !== undefined) node.textContent = label;
    svg.appendChild(node);
    return node;
  }

  if (records.length === 0) {
    element('text', {x: 25, y: 45, fill: '#212529', 'font-size': 18}, 'No matching majors to display.');
    return;
  }

  // Give each major its own horizontal group of three bars.
  // The highest number sets the scale, so the chart also works for new data.
  let maximum = 1;
  for (const item of records) {
    maximum = Math.max(maximum, item.year2022, item.year2023, item.year2024);
  }
  const height = Math.max(175, 65 + records.length * 65);
  svg.setAttribute('viewBox', '0 0 800 ' + height);
  svg.setAttribute('height', height);
  const colors = ['#0d6efd', '#198754', '#ffc107']; // Bootstrap primary, success, warning
  const plotStart = 205;
  const availableWidth = 530;

  // The light guide lines mark 0%, 25%, 50%, 75% and 100% of the current scale.
  for (let tick = 0; tick <= 4; tick++) {
    const x = plotStart + (availableWidth * tick / 4);
    element('line', {x1: x, y1: 30, x2: x, y2: height - 15, stroke: '#dee2e6'});
    element('text', {x: x, y: 20, 'text-anchor': 'middle', 'font-size': 12, fill: '#495057'}, String(Math.round(maximum * tick / 4)));
  }
  records.forEach(function (item, index) {
    const top = 40 + index * 65;
    element('text', {x: 195, y: top + 24, 'text-anchor': 'end', 'font-size': 13, fill: '#212529'}, item.major);
    const values = [item.year2022, item.year2023, item.year2024];
    values.forEach(function (value, year) {
      const barWidth = availableWidth * value / maximum;
      const barY = top + year * 15;
      element('rect', {x: plotStart, y: barY, width: barWidth, height: 12, rx: 2, fill: colors[year]});
      element('text', {x: plotStart + barWidth + 5, y: barY + 10, 'font-size': 11, fill: '#212529'}, String(value));
    });
  });
}

// Search live as the user types, without leaving the page.
const careerSearch = document.getElementById('careerSearch');
if (careerSearch) {
  showCareers('');
  careerSearch.addEventListener('input', function () { showCareers(careerSearch.value); });
}
const employmentSearch = document.getElementById('employmentSearch');
if (employmentSearch) {
  showEmployment('');
  employmentSearch.addEventListener('input', function () { showEmployment(employmentSearch.value); });
}

// Add a Career object to the careers array and update the visible table.
const careerForm = document.getElementById('careerForm');
if (careerForm) careerForm.addEventListener('submit', function (event) {
  event.preventDefault();
  if (!careerForm.checkValidity()) return;
  const newJob = new Career(
    document.getElementById('careerField').value.trim(),
    document.getElementById('careerName').value.trim(),
    document.getElementById('careerSkills').value.trim(),
    document.getElementById('careerCourse').value.trim()
  );
  if (![newJob.field, newJob.title, newJob.skills, newJob.course].every(Boolean)) return;
  careers.push(newJob);
  careerSearch.value = '';
  showCareers('');
  careerForm.reset();
  careerForm.classList.remove('was-validated');
  document.getElementById('careerMessage').textContent = 'Career added to the table.';
});

// Add a new EmploymentRecord and redisplay the sample employment table.
const employmentForm = document.getElementById('employmentForm');
if (employmentForm) employmentForm.addEventListener('submit', function (event) {
  event.preventDefault();
  if (!employmentForm.checkValidity()) return;
  const name = document.getElementById('employmentMajor').value.trim();
  const years = ['employment2022', 'employment2023', 'employment2024'].map(function (id) {
    return Number(document.getElementById(id).value);
  });
  if (!name || years.some(function (num) { return !Number.isInteger(num) || num < 0; })) return;
  employment.push(new EmploymentRecord(name, years[0], years[1], years[2]));
  employmentSearch.value = '';
  showEmployment('');
  employmentForm.reset();
  employmentForm.classList.remove('was-validated');
  document.getElementById('employmentMessage').textContent = 'Sample data added to the table.';
});
