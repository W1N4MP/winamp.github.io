/* ========================================
   GRUNGE FOREVER — ANIMATIONS (FIXED)
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. SCROLL REVEAL — Надежный Observer
  const bandCards = document.querySelectorAll('.band-card');
  
  // Сначала помечаем карточки для анимации (без этого они останутся видимыми по дефолту)
  bandCards.forEach(card => card.classList.add('animate-on-scroll'));

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -5% 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Перестаем наблюдать после появления для производительности
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  bandCards.forEach(card => revealObserver.observe(card));

  // 2. STICKY NAV — Show/Hide on scroll
  const stickyNav = document.getElementById('stickyNav');
  const heroSection = document.getElementById('hero');
  let navVisible = false;

  function handleNavScroll() {
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    if (heroBottom <= 0 && !navVisible) {
      stickyNav.classList.add('visible');
      navVisible = true;
    } else if (heroBottom > 0 && navVisible) {
      stickyNav.classList.remove('visible');
      navVisible = false;
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // 3. PARALLAX on Hero
  const heroContent = heroSection.querySelector('.hero-content');
  function handleParallax() {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      const opacity = 1 - (scrolled / (window.innerHeight * 0.8));
      heroContent.style.opacity = Math.max(opacity, 0);
      heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
    }
  }
  window.addEventListener('scroll', handleParallax, { passive: true });

  // 4. GLITCH EFFECT — Intensify on hover
  const glitchTitle = document.querySelector('.glitch');
  glitchTitle.addEventListener('mouseenter', () => {
    glitchTitle.style.animation = 'none';
    glitchTitle.offsetHeight; // reflow
    glitchTitle.style.animation = 'glitch-main 0.15s infinite';
  });
  glitchTitle.addEventListener('mouseleave', () => {
    glitchTitle.style.animation = 'glitch-main 3s infinite';
  });

  // 5. RANDOM GLITCH BURSTS
  function triggerRandomGlitch() {
    const elements = document.querySelectorAll('.band-logo');
    if (elements.length === 0) return;
    const randomEl = elements[Math.floor(Math.random() * elements.length)];
    randomEl.style.transform = `translateX(${(Math.random() - 0.5) * 6}px)`;
    randomEl.style.filter = `hue-rotate(${Math.random() * 90}deg)`;
    setTimeout(() => {
      randomEl.style.transform = 'translateX(0)';
      randomEl.style.filter = 'none';
    }, 150);
  }
  function scheduleGlitch() {
    setTimeout(() => { triggerRandomGlitch(); scheduleGlitch(); }, 3000 + Math.random() * 4000);
  }
  scheduleGlitch();

  // 6. CURSOR TRAIL — Grunge particles
  document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.6) return;
    const p = document.createElement('div');
    p.classList.add('cursor-trail');
    p.style.left = `${e.clientX}px`;
    p.style.top = `${e.clientY}px`;
    p.style.opacity = '0.8';
    p.style.width = `${3 + Math.random() * 6}px`;
    p.style.height = p.style.width;
    document.body.appendChild(p);
    setTimeout(() => { p.style.opacity = '0'; p.style.transform = `translate(${(Math.random()-0.5)*30}px, ${(Math.random()-0.5)*30}px) scale(0)`; }, 100);
    setTimeout(() => p.remove(), 800);
  });

  // 7. SMOOTH ANCHOR SCROLLING
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navOffset = stickyNav.offsetHeight || 0;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navOffset - 20,
          behavior: 'smooth'
        });
      }
    });
  });

  // 8. DYNAMIC ACCENT COLOR on cards
  const accentColors = {
    red: '#c0392b', blue: '#2980b9', green: '#27ae60',
    brown: '#8b6914', pink: '#e74c3c', dark: '#888888'
  };
  bandCards.forEach(card => {
    const theme = card.dataset.theme;
    const accent = accentColors[theme] || '#c0392b';
    card.addEventListener('mouseenter', () => {
      card.querySelector('.card-inner').style.borderColor = `${accent}40`;
      card.querySelector('.card-info h2').style.color = accent;
    });
    card.addEventListener('mouseleave', () => {
      card.querySelector('.card-inner').style.borderColor = 'rgba(255,255,255,0.05)';
      card.querySelector('.card-info h2').style.color = '';
    });
  });

  // 9. TYPING EFFECT for subtitle
  const subtitle = document.querySelector('.subtitle');
  const originalText = subtitle.textContent;
  subtitle.textContent = '';
  let charIndex = 0;
  function typeSubtitle() {
    if (charIndex < originalText.length) {
      subtitle.textContent += originalText.charAt(charIndex);
      charIndex++;
      setTimeout(typeSubtitle, 50 + Math.random() * 40);
    }
  }
  setTimeout(typeSubtitle, 2200);

  // 10. AUDIO VISUALIZER — lightweight bars
  const barsContainer = document.createElement('div');
  Object.assign(barsContainer.style, {
    position: 'fixed', bottom: '0', left: '0', width: '100%', height: '60px',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    gap: '3px', pointerEvents: 'none', zIndex: '1', opacity: '0.08', padding: '0 5%'
  });
  for (let i = 0; i < 80; i++) {
    const bar = document.createElement('div');
    Object.assign(bar.style, {
      flex: '1', background: 'var(--accent-red)', minWidth: '2px', maxWidth: '4px',
      height: '5px', transition: 'height 0.3s ease'
    });
    barsContainer.appendChild(bar);
  }
  document.body.appendChild(barsContainer);

  let lastBarUpdate = 0;
  function animateBars(timestamp) {
    if (timestamp - lastBarUpdate > 250) {
      Array.from(barsContainer.children).forEach(bar => {
        bar.style.height = `${5 + Math.random() * 50}px`;
      });
      lastBarUpdate = timestamp;
    }
    requestAnimationFrame(animateBars);
  }
  requestAnimationFrame(animateBars);

  console.log('%c GRUNGE FOREVER ', 'background: #c0392b; color: #fff; font-size: 20px; font-weight: bold; padding: 10px;');
});