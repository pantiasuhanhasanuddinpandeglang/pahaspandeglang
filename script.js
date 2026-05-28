/* =============================================
   PANTI ASUHAN HASANUDDIN — SCRIPT.JS
============================================= */

'use strict';

// ===== NAVBAR: SCROLL + ACTIVE LINK + MOBILE TOGGLE =====

const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');
const navLinks  = document.querySelectorAll('.nav-link');

// Scrolled class for navbar shrink
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightActiveNav();
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

// Highlight active nav link based on scroll position
function highlightActiveNav() {
  const scrollPos = window.scrollY + 100;
  const sections  = document.querySelectorAll('section[id]');

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = navbar.offsetHeight + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ===== REVEAL ON SCROLL =====

const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children within galeri grid
      const delay = entry.target.closest('.galeri-grid')
        ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
        : 0;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

reveals.forEach(el => revealObserver.observe(el));


// ===== HERO TITLE: FLOATING TEXT LOOP =====
// Adds a subtle breathing / floating effect to the hero title
const heroTitle = document.querySelector('.hero-title');

if (heroTitle) {
  // After initial animation is done (1.5s), add the floating class
  setTimeout(() => {
    heroTitle.style.animation = 'heroFloat 4s ease-in-out infinite';
  }, 2000);
}

// Inject heroFloat keyframe dynamically
const floatStyle = document.createElement('style');
floatStyle.textContent = `
  @keyframes heroFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
`;
document.head.appendChild(floatStyle);


// ===== GALERI LIGHTBOX (Simple) =====
const galeriItems = document.querySelectorAll('.galeri-item');

galeriItems.forEach(item => {
  item.addEventListener('click', () => {
    const imgEl   = item.querySelector('.galeri-img');
    const caption = item.querySelector('.galeri-info span').textContent;
    const bg      = window.getComputedStyle(imgEl).backgroundImage;
    const url     = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    openLightbox(url, caption);
  });
});

function openLightbox(src, caption) {
  // Remove existing
  const existing = document.getElementById('lightbox');
  if (existing) existing.remove();

  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-inner">
      <button class="lb-close" aria-label="Tutup">&times;</button>
      <img src="${src}" alt="${caption}" />
      <p class="lb-caption">${caption}</p>
    </div>
  `;

  // Inject lightbox styles
  if (!document.getElementById('lb-style')) {
    const s = document.createElement('style');
    s.id = 'lb-style';
    s.textContent = `
      #lightbox {
        position: fixed; inset: 0; z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        animation: lbIn 0.3s ease;
      }
      @keyframes lbIn {
        from { opacity: 0; } to { opacity: 1; }
      }
      .lb-backdrop {
        position: absolute; inset: 0;
        background: rgba(26,18,8,0.92);
        backdrop-filter: blur(8px);
      }
      .lb-inner {
        position: relative; z-index: 1;
        max-width: 90vw; max-height: 85vh;
        display: flex; flex-direction: column; align-items: center; gap: 16px;
      }
      .lb-inner img {
        max-width: 100%; max-height: 72vh;
        border-radius: 14px;
        object-fit: contain;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      }
      .lb-caption {
        color: rgba(255,255,255,0.85);
        font-family: 'Lato', sans-serif;
        font-size: 14px; font-weight: 700;
        letter-spacing: 1px;
        background: rgba(200,150,74,0.25);
        padding: 6px 20px; border-radius: 99px;
      }
      .lb-close {
        position: absolute; top: -44px; right: 0;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: white; font-size: 22px;
        width: 40px; height: 40px;
        border-radius: 50%; cursor: pointer;
        line-height: 1;
        transition: all 0.2s;
        display: flex; align-items: center; justify-content: center;
      }
      .lb-close:hover { background: rgba(200,150,74,0.4); transform: scale(1.1); }
    `;
    document.head.appendChild(s);
  }

  document.body.appendChild(lb);
  document.body.style.overflow = 'hidden';

  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function escClose(e) {
    if (e.key === 'Escape') { closeLightbox(); document.removeEventListener('keydown', escClose); }
  });
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.style.opacity = '0';
    lb.style.transition = 'opacity 0.25s';
    setTimeout(() => { lb.remove(); document.body.style.overflow = ''; }, 250);
  }
}


// ===== COUNTER ANIMATION (Stats jika ada) =====
// Placeholder for future stat counters
function animateCount(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target; clearInterval(timer); return; }
    el.textContent = Math.floor(start);
  }, 16);
}


// ===== PARALLAX on Hero (subtle) =====
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    hero.style.backgroundPositionY = `calc(50% + ${scrolled * 0.3}px)`;
  }
});


// ===== INIT =====
highlightActiveNav();
console.log('✨ Panti Asuhan Hasanuddin — Website loaded successfully.');
