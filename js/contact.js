const form = document.querySelector('#contact-form');
const status = document.querySelector('#contact-status');
const download = document.querySelector('#download-draft');
let draftUrl;
const fields = ['full-name', 'email', 'phone', 'message'].map(id => document.getElementById(id));
const requiredMessages = ['Enter your name.', 'Enter your email address.', 'Enter your phone number.', 'Enter a message.'];

function clearDraft() {
  status.textContent = '';
  download.hidden = true;
  download.removeAttribute('href');
  if (draftUrl) URL.revokeObjectURL(draftUrl);
  draftUrl = undefined;
}

function showError(field, message) {
  document.getElementById(`${field.id}-error`).textContent = message;
  if (message) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
}

form.addEventListener('submit', event => {
  event.preventDefault();
  clearDraft();
  let firstInvalid;

  fields.forEach((field, index) => {
    const value = field.value.trim();
    let message = '';

    if (!value) {
      message = requiredMessages[index];
    } else if (field.id === 'email' && (field.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) {
      message = 'Enter an email address such as name@example.com.';
    } else if (field.id === 'phone' && !/^[0-9]+$/.test(field.value)) {
      message = 'Use digits only for the phone number.';
    }

    showError(field, message);
    if (message && !firstInvalid) firstInvalid = field;
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const [name, email, phone, message] = fields.map(field => field.value.trim());
  const draft = `To: Onoja Agbo John
From: ${name}
Email: ${email}
Phone: ${phone}

${message}
`;
  draftUrl = URL.createObjectURL(new Blob([draft], { type: 'text/plain;charset=utf-8' }));
  download.href = draftUrl;
  download.hidden = false;
  status.textContent = 'Your draft is ready to download.';
});

fields.forEach(field => {
  field.addEventListener('input', () => {
    showError(field, '');
    clearDraft();
  });
});

form.querySelector('button[type="submit"]').disabled = false;
