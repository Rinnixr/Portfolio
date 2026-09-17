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
