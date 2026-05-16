/* ═══════════════════════════════════════════════════════
   VENUMADHAV REDDY MULE — PORTFOLIO SCRIPT
════════════════════════════════════════════════════════ */

/* ── 1. DEVICE DETECTION ──────────────────────────────── */
const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
                      window.matchMedia('(max-width: 1024px)').matches ||
                      ('ontouchstart' in window) ||
                      (navigator.maxTouchPoints > 0);

/* ── 2. CUSTOM CURSOR ─────────────────────────────────── */
(function initCursor() {
  if (isTouchDevice) return;

  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0; // mouse position
  let rx = 0, ry = 0; // ring lerp position

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // ring follows with lag
  (function lerpRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();

  // hover effect on interactive elements
  const targets = document.querySelectorAll('a, button, .proj-card, .skill-group, .info-card, .tl-card');
  targets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

/* ── 3. NAV SCROLL BEHAVIOR ───────────────────────────── */
(function initNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ── 4. ACTIVE NAV LINK ───────────────────────────────── */
(function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => obs.observe(s));
})();

/* ── 5. MOBILE NAV TOGGLE ─────────────────────────────── */
(function initMobileNav() {
  const openBtn  = document.getElementById('mobile-open');
  const closeBtn = document.getElementById('mobile-close');
  const nav      = document.getElementById('mobile-nav');
  if (!openBtn || !closeBtn || !nav) return;

  const open  = () => { nav.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { nav.classList.remove('open'); document.body.style.overflow = ''; };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

/* ── 6. SCROLL REVEAL ─────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => obs.observe(el));
})();

/* ── 7. TYPEWRITER ────────────────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const phrases = [
    'Full Stack Engineer · Backend-Focused',
    'Java · Spring Boot · Microservices',
    'Distributed Systems · Payment Flows',
    'Agentic AI · LLM Integrations',
    'Building Systems That Hold Under Pressure',
  ];
  let pi = 0, ci = 0, deleting = false;

  const tick = () => {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(tick, 2400);
        return;
      }
      setTimeout(tick, 50);
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(tick, 380);
        return;
      }
      setTimeout(tick, 22);
    }
  };

  setTimeout(tick, 1500);
})();

/* ── 8. HERO CANVAS PARTICLES ─────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COUNT = Math.min(Math.floor(window.innerWidth / 14), 90);
  const particles = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * 1600,
    y:  Math.random() * 900,
    vx: (Math.random() - 0.5) * 0.32,
    vy: (Math.random() - 0.5) * 0.32,
    r:  Math.random() * 1.4 + 0.5,
    a:  Math.random() * 0.45 + 0.12,
    c:  Math.random() > 0.6 ? '#F5A623' : Math.random() > 0.5 ? '#52D9C0' : '#FFFFFF',
  }));

  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    // connections
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const q   = particles[j];
        const dx  = p.x - q.x, dy = p.y - q.y;
        const d   = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(245,166,35,${0.07 * (1 - d / 150)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    // dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = p.a;
      ctx.fill();
      ctx.globalAlpha = 1;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  };
  draw();
})();

/* ── 9. STATS COUNTER ANIMATION ───────────────────────── */
(function initCounters() {
  const statsEl = document.querySelector('.hero-stats');
  if (!statsEl) return;

  const nums = statsEl.querySelectorAll('.stat-num');
  
  // Elite Dynamic Experience Logic
  const calculateExperience = () => {
    const segment1Start = new Date('2024-11-01');
    const segment1End   = new Date('2025-04-30');
    const segment2Start = new Date('2025-07-01');
    const now           = new Date();

    // Segment 1: Nov 2024 to April 2025 (fixed 6 months)
    const months1 = 6;

    // Segment 2: July 2025 to Present (dynamic)
    let months2 = (now.getFullYear() - segment2Start.getFullYear()) * 12;
    months2 += now.getMonth() - segment2Start.getMonth();
    if (now.getDate() < segment2Start.getDate()) months2--;

    const totalMonths = months1 + Math.max(0, months2);
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return { years, months, total: totalMonths };
  };

  const exp = calculateExperience();
  const targets = [exp.total, 16, 4];
  const suffixes = ['', '', ''];
  let ran = false;

  const run = () => {
    if (ran) return;
    ran = true;
    nums.forEach((el, i) => {
      let cur = 0;
      const target = targets[i];
      const step = () => {
        cur = Math.min(cur + Math.ceil(target / 42), target);
        
        if (i === 0) {
          const y = Math.floor(cur / 12);
          const m = cur % 12;
          el.textContent = `${y}.${m}+`;
          
          const label = el.nextElementSibling;
          if (label) {
            label.innerHTML = y >= 1 ? `Years of Total<br>Experience` : `Months of Total<br>Experience`;
          }
        } else {
          el.textContent = cur + suffixes[i];
        }
        
        if (cur < target) requestAnimationFrame(step);
      };
      step();
    });
  };

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { run(); obs.disconnect(); }
  }, { threshold: 0.5 });
  obs.observe(statsEl);
})();