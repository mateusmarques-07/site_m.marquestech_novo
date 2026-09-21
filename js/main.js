// Header transparente no topo, com fundo/blur ao rolar
const navHeader = document.querySelector('.nav');
if (navHeader) {
  const toggleNavBg = () => navHeader.classList.toggle('is-scrolled', window.scrollY > 40);
  toggleNavBg();
  window.addEventListener('scroll', toggleNavBg, { passive: true });
}

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
const revealEls = document.querySelectorAll('.reveal, .reveal-drift, .cs-anim-media, .cs-anim-text-l, .cs-anim-text-r');
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

// Paralaxe sutil ao mover o mouse (sites e automação)
if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  [['criacaoVisual'], ['automacaoVisual']].forEach(([id]) => {
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

// Hero v2: paralaxe de mouse em camadas (imagem grande + glow/fundo), só desktop com mouse de precisão
if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  const heroV2 = document.querySelector('.hero-v2');
  const heroParallaxEls = heroV2 ? heroV2.querySelectorAll('[data-parallax]') : [];
  if (heroV2 && heroParallaxEls.length) {
    heroV2.addEventListener('mousemove', (e) => {
      const rect = heroV2.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      heroParallaxEls.forEach((el) => {
        const strength = parseFloat(el.dataset.parallax) || 4;
        el.style.transform = `translate(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px)`;
      });
    });
    heroV2.addEventListener('mouseleave', () => {
      heroParallaxEls.forEach((el) => { el.style.transform = ''; });
    });
  }
}

// Esteira de cases (depoimentos): clona dinamicamente até cobrir 2x a largura visível
// e anima via Web Animations API com distância em pixel (evita vão vazio em tela larga
// e o bug do Safari com custom-property dentro de @keyframes)
(function setupCasesMarquee() {
  const wrap = document.querySelector('.marquee-wrap');
  const track = document.getElementById('marqueeTrack');
  if (!wrap || !track) return;

  const originalCards = Array.from(track.children);
  if (!originalCards.length) return;

  let anim = null;

  function build() {
    if (anim) anim.cancel();
    track.innerHTML = '';
    originalCards.forEach((card) => track.appendChild(card.cloneNode(true)));

    const containerWidth = wrap.clientWidth;
    while (
      track.children.length < originalCards.length * 2 ||
      track.scrollWidth < containerWidth * 2 + 400
    ) {
      originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    }

    const shift = track.children[originalCards.length].offsetLeft - track.children[0].offsetLeft;
    if (reduceMotion || !shift) return;

    anim = track.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(-${shift}px)` }],
      { duration: (shift / 55) * 1000, iterations: Infinity, easing: 'linear' }
    );
  }

  build();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });

  wrap.addEventListener('mouseenter', () => anim && anim.pause());
  wrap.addEventListener('mouseleave', () => anim && anim.play());
})();

// Projetos: timeline vertical que preenche conforme o scroll, pontos acendendo,
// e projeto "ativo" (mais próximo do centro da viewport) recebendo destaque sutil
(function setupProjetosTimeline() {
  const wrap = document.querySelector('.case-studies-wrap');
  const fill = document.getElementById('csTimelineFill');
  if (!wrap || !fill) return;

  const dots = Array.from(document.querySelectorAll('.cs-timeline-dot'));
  const cases = Array.from(document.querySelectorAll('.case-study'));

  function positionDots() {
    const wrapRect = wrap.getBoundingClientRect();
    const wrapTop = wrapRect.top + window.scrollY;
    cases.forEach((cs, i) => {
      const dot = dots[i];
      if (!dot) return;
      const csRect = cs.getBoundingClientRect();
      const centerY = csRect.top + window.scrollY - wrapTop + csRect.height / 2;
      dot.style.top = centerY + 'px';
    });
  }

  function updateFill() {
    const rect = wrap.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height + vh * 0.5;
    const progressed = vh * 0.5 - rect.top;
    const progress = Math.min(1, Math.max(0, progressed / total));
    const fillPx = progress * rect.height;
    fill.style.height = fillPx + 'px';
    dots.forEach((dot) => {
      const dotTop = parseFloat(dot.style.top) || 0;
      dot.classList.toggle('is-lit', fillPx >= dotTop);
    });

    // projeto ativo: o mais próximo do centro vertical da viewport
    let closest = null;
    let closestDist = Infinity;
    cases.forEach((cs) => {
      const csRect = cs.getBoundingClientRect();
      const dist = Math.abs(csRect.top + csRect.height / 2 - vh / 2);
      if (dist < closestDist) { closestDist = dist; closest = cs; }
    });
    cases.forEach((cs) => cs.classList.toggle('is-active', cs === closest));
  }

  positionDots();
  updateFill();
  window.addEventListener('scroll', updateFill, { passive: true });
  window.addEventListener('resize', () => { positionDots(); updateFill(); });
})();

// Projetos: modal/lightbox ao clicar (ou Enter/Espaço) numa screenshot
(function setupProjetosModal() {
  const modal = document.getElementById('csModal');
  if (!modal) return;

  const backdrop = modal.querySelector('[data-modal-close]');
  const closeBtn = document.getElementById('csModalClose');
  const imgEl = document.getElementById('csModalImg');
  const catEl = document.getElementById('csModalCat');
  const titleEl = document.getElementById('csModalTitle');
  const descEl = document.getElementById('csModalDesc');
  const tagsEl = document.getElementById('csModalTags');
  const prevBtn = document.getElementById('csModalPrev');
  const nextBtn = document.getElementById('csModalNext');

  let lastFocused = null;

  function openModal(frame) {
    const caseStudy = frame.closest('.case-study');
    if (!caseStudy) return;
    const img = frame.querySelector('img');
    const cat = caseStudy.querySelector('.cs-cat');
    const title = caseStudy.querySelector('h3');
    const desc = caseStudy.querySelector('.case-study-text p');
    const tags = caseStudy.querySelectorAll('.cs-tag');

    imgEl.src = img.src;
    imgEl.alt = img.alt;
    catEl.textContent = cat ? cat.textContent : '';
    catEl.style.cssText = cat ? cat.style.cssText : '';
    titleEl.textContent = title ? title.textContent : '';
    descEl.textContent = desc ? desc.textContent : '';
    tagsEl.innerHTML = '';
    tags.forEach((tag) => {
      const span = document.createElement('span');
      span.className = 'cs-tag';
      span.textContent = tag.textContent;
      tagsEl.appendChild(span);
    });
    // hoje cada projeto tem 1 screenshot só — setas ficam ocultas, prontas pra quando houver mais
    prevBtn.hidden = true;
    nextBtn.hidden = true;

    lastFocused = document.activeElement;
    modal.hidden = false;
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeModal() {
    modal.hidden = true;
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
      const list = Array.from(focusable).filter((el) => !el.hidden);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  document.querySelectorAll('.case-frame-v2').forEach((frame) => {
    frame.addEventListener('click', () => openModal(frame));
    frame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(frame);
      }
    });
  });

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
})();

// Fundo do Projetos: parallax muito sutil no scroll (número gigante e blobs)
if (!reduceMotion) {
  const scrollParallaxEls = document.querySelectorAll('[data-parallax-scroll]');
  if (scrollParallaxEls.length) {
    const updateScrollParallax = () => {
      const vh = window.innerHeight;
      scrollParallaxEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - vh / 2;
        const strength = parseFloat(el.dataset.parallaxScroll) || 0.1;
        el.style.transform = `translateY(${(-center * strength).toFixed(1)}px)`;
      });
    };
    window.addEventListener('scroll', updateScrollParallax, { passive: true });
    updateScrollParallax();
  }
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
