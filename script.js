/* Preloader functionality */
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    
    // Set initial theme based on localStorage or time
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const hour = new Date().getHours();
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark) || (!savedTheme && hour >= 18 || hour <= 6)) {
        document.body.classList.add('dark');
        document.querySelector('.day-night i').classList.remove('fa-moon');
        document.querySelector('.day-night i').classList.add('fa-sun');
    }
    
    // Hide preloader when everything is loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('hidden');
                
                // Remove from DOM after animation
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }
        }, 800);
    });
    
    // Fallback: Hide preloader after 3 seconds max
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 3000);
});

/* Typing Animation */
var typed = new Typed(".typing", {
  strings: [
    "ICT Consultant",
    "ICT Support Specialist",
    "ICT Technician",
    "Web Developer"
  ],
  typeSpeed: 100,
  backSpeed: 60,
  loop: true,
  backDelay: 1500,
  startDelay: 500,
});

/* Dark/Light Mode - Fixed */
const dayNight = document.querySelector(".day-night");
const themeIcon = dayNight.querySelector("i");

// Check current theme and set icon
if (document.body.classList.contains("dark")) {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
} else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
}

dayNight.addEventListener("click", () => {
    // Toggle dark mode
    document.body.classList.toggle("dark");
    
    // Toggle icon
    themeIcon.classList.toggle("fa-sun");
    themeIcon.classList.toggle("fa-moon");
    
    // Save theme preference
    const isDarkMode = document.body.classList.contains("dark");
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Add animation effect
    dayNight.style.transform = 'scale(0.9)';
    setTimeout(() => {
        dayNight.style.transform = '';
    }, 200);
});

/* Changing Aside Active Link */
const nav = document.querySelector(".nav");
const navList = nav.querySelectorAll("li");
const totalNavList = navList.length;
const allSection = document.querySelectorAll(".section");
const totalSection = allSection.length;

for (let i = 0; i < totalNavList; i++) {
  const a = navList[i].querySelector("a");
  a.addEventListener("click", function () {
    removeBackSection();
    for (let j = 0; j < totalNavList; j++) {
      if (navList[j].querySelector("a").classList.contains("active")) {
        addBackSection(j);
      }
      navList[j].querySelector("a").classList.remove("active");
    }
    this.classList.add("active");
    showSection(this);

    if (window.innerWidth < 1200) {
      asideSectionTogglerBtn();
    }
  });
}

function addBackSection(num) {
  allSection[num].classList.add("back-section");
}

function removeBackSection() {
  for (let i = 0; i < totalSection; i++) {
    allSection[i].classList.remove("back-section");
  }
}

function showSection(element) {
  for (let i = 0; i < totalSection; i++) {
    allSection[i].classList.remove("active");
  }

  const target = element.getAttribute("href").split("#")[1];
  document.querySelector("#" + target).classList.add("active");
}

function updateNav(element) {
  for (let i = 0; i < totalNavList; i++) {
    navList[i].querySelector("a").classList.remove("active");
    const target = element.getAttribute("href").split("#")[1];
    if (
      target ===
      navList[i].querySelector("a").getAttribute("href").split("#")[1]
    ) {
      navList[i].querySelector("a").classList.add("active");
    }
  }
}

document.querySelector(".hire-me")?.addEventListener("click", function () {
  const sectionIndex = this.getAttribute("data-section-index");
  showSection(this);
  updateNav(this);
  removeBackSection();
  addBackSection(sectionIndex);
});

/* Activating Mobile Menu */
const navTogglerBtn = document.querySelector(".nav-toggler");
const aside = document.querySelector(".aside");

navTogglerBtn?.addEventListener("click", () => {
  asideSectionTogglerBtn();
});

function asideSectionTogglerBtn() {
  aside.classList.toggle("open");
  navTogglerBtn.classList.toggle("open");
  for (let i = 0; i < totalSection; i++) {
    allSection[i].classList.toggle("open");
  }
}

/* Prevent zoom on mobile */
document.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

/* Prevent double tap zoom */
document.addEventListener('dblclick', function (event) {
  event.preventDefault();
}, { passive: false });

/* Smooth scrolling for anchor links */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      // For sections with smooth scrolling
      if (targetElement.classList.contains('section')) {
        // Already handled by existing navigation
        return;
      }
      
      // For other elements
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

/* Initialize price list navigation */
function initializePriceListNavigation() {
  const priceListSection = document.getElementById('pricelist');
  
  if (priceListSection) {
    priceListSection.classList.add('section');
    priceListSection.classList.add('back-section');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializePriceListNavigation();
  
  // Add click animation to all buttons
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
});

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

/* Back to top button functionality */
window.addEventListener('scroll', function() {
  const sections = document.querySelectorAll('.section');
  const currentSection = Array.from(sections).find(section => 
    section.classList.contains('active')
  );
  
  // Update active nav based on scroll position
  if (currentSection) {
    const activeId = currentSection.id;
    navList.forEach(navItem => {
      const link = navItem.querySelector('a');
      const href = link.getAttribute('href').replace('#', '');
      if (href === activeId) {
        navList.forEach(item => item.querySelector('a').classList.remove('active'));
        link.classList.add('active');
      }
    });
  }
});