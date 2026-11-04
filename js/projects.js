const calculator = document.querySelector('#score-form');
const result = document.querySelector('#score-result');
const dayFilter = document.querySelector('#day-filter');
const sessions = document.querySelectorAll('#study-timetable tbody tr');

calculator.addEventListener('submit', event => {
  event.preventDefault();
  const scores = new FormData(calculator).getAll('score').map(Number);
  const total = scores.reduce((sum, score) => sum + score, 0);
  const average = total / scores.length;
  result.textContent = `Average: ${Number(average.toFixed(2))}%`;
});

calculator.addEventListener('input', () => {
  result.textContent = '';
});

dayFilter.addEventListener('change', () => {
  sessions.forEach(session => {
    session.hidden = dayFilter.value !== 'all' && session.cells[0].textContent !== dayFilter.value;
  });
});

function openLinkedDemo() {
  const project = document.getElementById(location.hash.slice(1));
  const demo = project?.querySelector('details');
  if (demo) demo.open = true;
}

window.addEventListener('hashchange', openLinkedDemo);
openLinkedDemo();
