const storageKey = 'onoja-portfolio-tasks';
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-name');
const list = document.querySelector('#task-list');
const count = document.querySelector('#task-count');
const empty = document.querySelector('#task-empty');
const storageNotice = document.querySelector('#storage-notice');
let tasks = [];

function showStorageWarning() {
  storageNotice.hidden = false;
  storageNotice.textContent = 'This browser could not save your tasks. Changes may be lost when you leave this page.';
}

function readTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (Array.isArray(savedTasks)) {
      tasks = savedTasks.filter(task => task && typeof task.name === 'string' && typeof task.done === 'boolean');
    }
  } catch {
    showStorageWarning();
  }
}

function saveTasks() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
    storageNotice.hidden = true;
  } catch {
    showStorageWarning();
  }
}

function updateCount() {
  const completed = tasks.filter(task => task.done).length;
  count.textContent = `${completed} of ${tasks.length} complete`;
  empty.hidden = tasks.length > 0;
}

function createTaskRow(task) {
  const row = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  const title = document.createElement('span');
  const remove = document.createElement('button');

  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  title.textContent = task.name;
  label.append(checkbox, title);

  remove.className = 'remove-task';
  remove.type = 'button';
  remove.textContent = 'Delete';
  remove.setAttribute('aria-label', `Delete task: ${task.name}`);

  checkbox.addEventListener('change', () => {
    task.done = checkbox.checked;
    saveTasks();
    updateCount();
  });

  remove.addEventListener('click', () => {
    const nextControl = row.nextElementSibling?.querySelector('button')
      ?? row.previousElementSibling?.querySelector('button')
      ?? input;
    tasks = tasks.filter(item => item !== task);
    row.remove();
    saveTasks();
    updateCount();
    nextControl.focus();
  });

  row.append(label, remove);
  return row;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const name = input.value.trim();

  if (!name) {
    input.setCustomValidity('Enter a task before adding it.');
    input.reportValidity();
    return;
  }

  const task = { name, done: false };
  tasks.push(task);
  list.append(createTaskRow(task));
  saveTasks();
  updateCount();
  form.reset();
  input.focus();
});

input.addEventListener('input', () => input.setCustomValidity(''));
readTasks();
list.append(...tasks.map(createTaskRow));
updateCount();
