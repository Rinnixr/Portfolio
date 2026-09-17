const container = document.getElementById('twinkle-container');
const foregroundContainer = document.getElementById('foreground-stars');

function createStar() {
    const star = document.createElement('div');
    star.classList.add('twinkle-star');
  
    // Set the star image here (optional if not done in CSS)
    star.style.background = "url('Assets/star.png') no-repeat center center";
    star.style.backgroundSize = "contain";
  
    // Random position within viewport
    star.style.top = Math.random() * 100 + 'vh';
    star.style.left = Math.random() * 100 + 'vw';
  
    // Random animation delay to desync flashes
    star.style.animationDelay = (Math.random() * 3) + 's';
  
    // Random star size (2px to 6px)
    const size = Math.random() * 4 + 2;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
  
    container.appendChild(star);
  
    // Remove star after animation duration (3s)
    setTimeout(() => {
      container.removeChild(star);
    }, 3000);
  }
  

// Spawn a star every 100 milliseconds
setInterval(createStar, 100);

function createForegroundStar() {
  if (!foregroundContainer) return;

  const star = document.createElement('div');
  const size = Math.random() * 8 + 7;
  star.classList.add('foreground-star');
  star.style.top = Math.random() * 100 + 'vh';
  star.style.left = Math.random() * 100 + 'vw';
  star.style.width = size + 'px';
  star.style.height = size + 'px';
  star.style.animationDelay = (Math.random() * 1.5) + 's';
  foregroundContainer.appendChild(star);

  setTimeout(() => star.remove(), 6500);
}

setInterval(createForegroundStar, 900);

const projectTabs = document.querySelectorAll('[data-project-category]');
const projectPanels = document.querySelectorAll('[data-project-panel]');

function activateProjectCategory(selectedCategory) {
  const selectedTab = [...projectTabs].find((tab) => tab.dataset.projectCategory === selectedCategory);

  if (!selectedTab) return;

  projectTabs.forEach((projectTab) => {
    const isSelected = projectTab === selectedTab;
    projectTab.classList.toggle('is-active', isSelected);
    projectTab.setAttribute('aria-selected', isSelected);
  });

  projectPanels.forEach((panel) => {
    panel.hidden = panel.dataset.projectPanel !== selectedCategory;
  });
}

projectTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    activateProjectCategory(tab.dataset.projectCategory);
  });
});

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

function savePageState() {
  const activeTab = document.querySelector('.project-tab.is-active');
  history.replaceState({
    ...history.state,
    portfolioScrollY: window.scrollY,
    portfolioProjectCategory: activeTab?.dataset.projectCategory
  }, '', window.location.href);
}

function restorePageState() {
  const savedState = history.state;
  const savedTab = savedState?.portfolioProjectCategory;
  const savedScrollY = Number(savedState?.portfolioScrollY);

  if (savedTab) activateProjectCategory(savedTab);

  if (Number.isFinite(savedScrollY)) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => window.scrollTo(0, savedScrollY));
    });
  }
}

window.addEventListener('pagehide', savePageState);
window.addEventListener('pageshow', (event) => {
  const navigation = performance.getEntriesByType('navigation')[0];
  const isHistoryReturn = event.persisted || navigation?.type === 'back_forward';

  if (isHistoryReturn) restorePageState();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets = document.querySelectorAll('section, .card');

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
} else {
  revealTargets.forEach((element) => element.classList.add('reveal-on-scroll'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  // Project pages can contain very long sections. Reveal them when any part
  // enters the viewport so the section cannot remain hidden indefinitely.
  }, { threshold: 0 });

  revealTargets.forEach((element) => revealObserver.observe(element));
}

const parallaxGlowOne = document.querySelector('.parallax-glow-one');
const parallaxGlowTwo = document.querySelector('.parallax-glow-two');
const parallaxGlowThree = document.querySelector('.parallax-glow-three');

if (!reduceMotion && parallaxGlowOne && parallaxGlowTwo && parallaxGlowThree) {
  let ticking = false;

  const updateParallax = () => {
    const scrollOffset = window.scrollY;
    parallaxGlowOne.style.transform = `translate3d(${scrollOffset * -0.025}px, ${scrollOffset * 0.12}px, 0)`;
    parallaxGlowTwo.style.transform = `translate3d(${scrollOffset * 0.02}px, ${scrollOffset * -0.08}px, 0)`;
    parallaxGlowThree.style.transform = `translate3d(${scrollOffset * 0.04}px, ${scrollOffset * 0.05}px, 0)`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  updateParallax();
}

const canTiltCards = !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (canTiltCards) {
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -7}deg) rotateY(${x * 7}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}
