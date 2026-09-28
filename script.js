const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

menu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

const form = document.querySelector('#contact-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = form.querySelector('.form-status');
  if (!form.checkValidity()) {
    form.reportValidity();
    status.textContent = 'Completa los campos obligatorios para continuar.';
    return;
  }
  status.textContent = 'Datos validados. Demostración: no se envía ni guarda tu solicitud.';
});
