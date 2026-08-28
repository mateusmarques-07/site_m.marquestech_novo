// Menu mobile
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
  });
}

// FAQ accordion
document.querySelectorAll('.faq-item').forEach((item) => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-answer').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
    }
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal, .reveal-drift');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => revealObserver.observe(el));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hero: alterna os 4 pilares (Site / E-commerce / IA / Automação) na composição 3D
const heroStates = document.querySelectorAll('#heroCycle .hp-state');
if (heroStates.length && !reduceMotion) {
  let heroIndex = 0;
  setInterval(() => {
    heroStates[heroIndex].classList.remove('hp-active');
    heroIndex = (heroIndex + 1) % heroStates.length;
    heroStates[heroIndex].classList.add('hp-active');
  }, 3500);
}

// Paralaxe sutil ao mover o mouse (hero, sites e automação)
if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  [['heroVisual'], ['criacaoVisual'], ['automacaoVisual']].forEach(([id]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const section = el.closest('section');
    section.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      el.style.transform = `perspective(1200px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg)`;
    });
    section.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

// Cookie banner (LGPD)
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
if (cookieBanner && !localStorage.getItem('mmt_cookie_consent')) {
  setTimeout(() => cookieBanner.classList.add('show'), 1200);
}
if (cookieAccept) {
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('mmt_cookie_consent', '1');
    cookieBanner.classList.remove('show');
  });
}
