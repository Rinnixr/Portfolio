const container = document.getElementById('twinkle-container');

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

const projectTabs = document.querySelectorAll('[data-project-category]');
const projectPanels = document.querySelectorAll('[data-project-panel]');

projectTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const selectedCategory = tab.dataset.projectCategory;

    projectTabs.forEach((projectTab) => {
      const isSelected = projectTab === tab;
      projectTab.classList.toggle('is-active', isSelected);
      projectTab.setAttribute('aria-selected', isSelected);
    });

    projectPanels.forEach((panel) => {
      panel.hidden = panel.dataset.projectPanel !== selectedCategory;
    });
  });
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
  }, { threshold: 0.12 });

  revealTargets.forEach((element) => revealObserver.observe(element));
}

const parallaxGlowOne = document.querySelector('.parallax-glow-one');
const parallaxGlowTwo = document.querySelector('.parallax-glow-two');

if (!reduceMotion && parallaxGlowOne && parallaxGlowTwo) {
  let ticking = false;

  const updateParallax = () => {
    const scrollOffset = window.scrollY;
    parallaxGlowOne.style.transform = `translate3d(0, ${scrollOffset * 0.1}px, 0)`;
    parallaxGlowTwo.style.transform = `translate3d(0, ${scrollOffset * -0.06}px, 0)`;
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
