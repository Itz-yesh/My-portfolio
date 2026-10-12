/* ═══════════════════════════════════════════════
   PIXEL PORTFOLIO — script.js
   ═══════════════════════════════════════════════ */

// ─── 1. TYPING EFFECT ───────────────────────────
const TYPING_TEXTS = [
  'YESHWANTH K',
];

(function initTypingEffect() {
  const el = document.getElementById('typingText');
  if (!el) return;

  let textIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const current = TYPING_TEXTS[textIdx];
    el.textContent = isDeleting
      ? current.substring(0, charIdx--)
      : current.substring(0, charIdx++);

    let delay = isDeleting ? 60 : 110;

    if (!isDeleting && charIdx > current.length) {
      delay = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIdx < 0) {
      isDeleting = false;
      charIdx = 0;
      textIdx = (textIdx + 1) % TYPING_TEXTS.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  type();
})();


// ─── 2. PIXEL PARTICLE GENERATOR ────────────────
(function createParticles() {
  const container = document.getElementById('pixelParticles');
  if (!container) return;

  const PARTICLE_COUNT = 30;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'pixel-particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.setProperty('--dur', (6 + Math.random() * 10) + 's');
    p.style.setProperty('--delay', (Math.random() * 8) + 's');
    container.appendChild(p);
  }
})();


// ─── 3. NAVBAR SCROLL & ACTIVE LINK ─────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const scrollY = window.scrollY;

    // Scrolled style
    if (scrollY > 60) {
      navbar.style.background = 'rgba(10,10,15,0.98)';
    } else {
      navbar.style.background = 'rgba(10,10,15,0.92)';
    }

    // Back-to-top visibility
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 400);
    }

    // Active nav link
    let currentSection = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      const bottom = top + sec.offsetHeight;
      if (scrollY >= top && scrollY < bottom) currentSection = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + currentSection
      );
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Back to top click
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
})();


// ─── 4. HAMBURGER MENU ──────────────────────────
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    // Animate hamburger → X
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
})();


// ─── 5. SCROLL-IN ANIMATIONS ────────────────────
(function initScrollAnimations() {
  const targets = document.querySelectorAll('.pixel-card, .timeline-item, .cert-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Stagger delay based on sibling index
          const siblings = Array.from(el.parentElement.children);
          const idx = siblings.indexOf(el);
          setTimeout(() => el.classList.add('animate-in'), idx * 80);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(t => observer.observe(t));
  } else {
    // Fallback: show all
    targets.forEach(t => t.classList.add('animate-in'));
  }
})();


// ─── 6. SKILL BAR ANIMATION ─────────────────────
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill[data-target]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.getAttribute('data-target') + '%';
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
  } else {
    bars.forEach(bar => bar.style.width = bar.getAttribute('data-target') + '%');
  }
})();


// ─── 7. CONTACT FORM HANDLER ────────────────────
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName')?.value.trim();
    const email = document.getElementById('senderEmail')?.value.trim();
    const message = document.getElementById('messageBody')?.value.trim();
    const btn = document.getElementById('contactSubmitBtn');

    if (!name || !email || !message) {
      setStatus('⚠ PLEASE FILL IN ALL REQUIRED FIELDS', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      setStatus('⚠ PLEASE ENTER A VALID EMAIL ADDRESS', 'error');
      return;
    }

    // Simulate sending
    if (btn) { btn.textContent = '⏳ SENDING...'; btn.disabled = true; }
    setTimeout(() => {
      setStatus('✔ MESSAGE SENT! I\'LL REPLY SOON. +50 XP 🎉', 'success');
      form.reset();
      if (btn) { btn.textContent = '▶ SEND MESSAGE'; btn.disabled = false; }
    }, 1500);
  });

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className = 'form-status ' + type;
    setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
  }

  function isValidEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }
})();


// ─── 8. PIXEL GLITCH EFFECT ON HOVER ─────────────
(function initGlitchEffect() {
  const heroName = document.querySelector('.hero-name');
  if (!heroName) return;

  let glitchInterval = null;

  function triggerGlitch() {
    const colors = ['#00ff88', '#00cfff', '#ffd700', '#ff6eb4', '#b06bff'];
    const orig = heroName.style.textShadow;
    let count = 0;
    const max = 6;

    clearInterval(glitchInterval);
    glitchInterval = setInterval(() => {
      const c1 = colors[Math.floor(Math.random() * colors.length)];
      const c2 = colors[Math.floor(Math.random() * colors.length)];
      const ox = (Math.random() * 6 - 3).toFixed(0) + 'px';
      const oy = (Math.random() * 4 - 2).toFixed(0) + 'px';
      heroName.style.textShadow = `${ox} ${oy} 0 ${c1}, -${ox} -${oy} 0 ${c2}, 0 0 20px var(--color-green)`;
      if (++count >= max) {
        clearInterval(glitchInterval);
        heroName.style.textShadow = '';
      }
    }, 60);
  }

  heroName.addEventListener('mouseenter', triggerGlitch);
})();


// ─── 9. CONSOLE EASTER EGG ──────────────────────
(function consoleEasterEgg() {
  const styles = [
    'color: #00ff88; font-family: monospace; font-size: 14px; font-weight: bold;',
    'color: #00cfff; font-family: monospace; font-size: 12px;',
    'color: #ffd700; font-family: monospace; font-size: 11px;',
  ];
  console.log('%c ██╗ ██╗██╗  ██╗', styles[0]);
  console.log('%c ╚██╗╚██╔╝██║ ██╔╝', styles[0]);
  console.log('%c  ╚██╗██╔╝█████╔╝ ', styles[0]);
  console.log('%c  ██╔╝██╔╝██╔═██╗ ', styles[0]);
  console.log('%c ██╔╝ ██║ ██║  ██╗', styles[0]);
  console.log('%c ╚═╝  ╚═╝ ╚═╝  ╚═╝ YESHWANTH K', styles[0]);
  console.log('%c >> Hey, you found the dev console! 👾', styles[1]);
  console.log('%c >> B.Tech CSE @ VIT University | Graduating May 2026', styles[2]);
  console.log('%c >> MERN Stack • Computer Vision • GNN Fraud Detection', styles[2]);
  console.log('%c >> Oracle Cloud AI + DB Certified | MCCT 2023 Presenter', styles[2]);
  console.log('%c >> kyeshwanth9001@gmail.com | +91 93608 86534', styles[2]);
})();


// ─── 10. CURSOR TRAIL PIXEL EFFECT ───────────────
(function initCursorTrail() {
  const TRAIL_SIZE = 6;
  const COLORS = ['#00ff88', '#00cfff', '#ffd700', '#ff6eb4', '#b06bff'];
  let lastX = 0, lastY = 0;

  document.addEventListener('mousemove', (e) => {
    if (Math.abs(e.clientX - lastX) < 15 && Math.abs(e.clientY - lastY) < 15) return;
    lastX = e.clientX; lastY = e.clientY;

    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      left: ${e.clientX - TRAIL_SIZE / 2}px;
      top:  ${e.clientY - TRAIL_SIZE / 2}px;
      width:  ${TRAIL_SIZE}px;
      height: ${TRAIL_SIZE}px;
      background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
      pointer-events: none;
      z-index: 9998;
      image-rendering: pixelated;
      transition: opacity 0.5s ease, transform 0.5s ease;
      opacity: 0.8;
    `;
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.opacity = '0';
      dot.style.transform = 'scale(3)';
    });
    setTimeout(() => dot.remove(), 500);
  });
})();
