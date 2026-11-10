/* ======================================================
   HANZALAH KHIYANI
   LUXURY DIGITAL PORTFOLIO
   APP.JS
====================================================== */


/* ======================================================
   GLOBAL SETTINGS
====================================================== */

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
);

const finePointer = window.matchMedia(
  '(hover: hover) and (pointer: fine)'
);

const html = document.documentElement;
const body = document.body;

const nav = document.getElementById('nav');
const hero = document.getElementById('hero');
const progressBar = document.getElementById('progress');

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

let lastScrollY = window.scrollY;
let navTicking = false;
let progressTicking = false;
let manifestoTicking = false;
let resizeTimer;


/* ======================================================
   CINEMATIC INTRO
====================================================== */

function createIntroOverlay() {
  if (
    prefersReducedMotion.matches ||
    document.querySelector('.intro-overlay')
  ) {
    body.classList.add('page-ready');
    return;
  }

  const intro = document.createElement('div');

  intro.className = 'intro-overlay';

  intro.setAttribute('aria-hidden', 'true');

  intro.innerHTML = `
    <div class="intro-inner">

      <div class="intro-meta">
        C.T. Bauer College of Business
        <br>
        Houston, Texas
      </div>

      <div class="intro-line"></div>

      <div class="intro-name">

        <span class="intro-name-line">
          <span class="intro-name-text">
            Hanzalah
          </span>
        </span>

        <span class="intro-name-line">
          <span class="intro-name-text">
            Khiyani
          </span>
        </span>

      </div>

      <div class="intro-caption">
        Data · Strategy · Decisions
      </div>

    </div>
  `;

  body.prepend(intro);

  body.classList.add('intro-active');

  /*
    The intro remains long enough for each element
    to complete the entrance sequence.
  */

  window.setTimeout(() => {
    intro.classList.add('finished');

    body.classList.remove('intro-active');
    body.classList.add('page-ready');
  }, 2200);

  /*
    Remove the finished overlay from the DOM after
    its fade-out transition.
  */

  window.setTimeout(() => {
    intro.remove();
  }, 3200);
}


/* ======================================================
   HERO ENTRANCE FALLBACK
====================================================== */

function initializeHeroEntrance() {
  if (prefersReducedMotion.matches) {
    body.classList.add('page-ready');
    return;
  }

  /*
    If the cinematic overlay is not present,
    reveal the page immediately.
  */

  if (!document.querySelector('.intro-overlay')) {
    body.classList.add('page-ready');
  }
}


/* ======================================================
   CUSTOM LUXURY CURSOR
====================================================== */

function createLuxuryCursor() {
  if (
    !finePointer.matches ||
    prefersReducedMotion.matches ||
    document.querySelector('.luxury-cursor')
  ) {
    return;
  }

  const cursor = document.createElement('div');
  const cursorLabel = document.createElement('div');

  cursor.className = 'luxury-cursor';
  cursorLabel.className = 'luxury-cursor-label';

  cursor.setAttribute('aria-hidden', 'true');
  cursorLabel.setAttribute('aria-hidden', 'true');

  cursorLabel.textContent = '';

  body.append(cursor, cursorLabel);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let cursorX = mouseX;
  let cursorY = mouseY;

  let labelX = mouseX;
  let labelY = mouseY;

  let cursorAnimationFrame;


  function renderCursor() {
    /*
      The cursor follows quickly.
      The label follows slightly more slowly,
      creating a smoother premium movement.
    */

    cursorX += (mouseX - cursorX) * 0.22;
    cursorY += (mouseY - cursorY) * 0.22;

    labelX += (mouseX - labelX) * 0.18;
    labelY += (mouseY - labelY) * 0.18;

    cursor.style.transform =
      `translate3d(${cursorX}px, ${cursorY}px, 0)
       translate(-50%, -50%)`;

    cursorLabel.style.transform =
      `translate3d(${labelX}px, ${labelY}px, 0)
       translate(-50%, -50%)`;

    cursorAnimationFrame =
      requestAnimationFrame(renderCursor);
  }


  document.addEventListener(
    'mousemove',
    event => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursor.classList.add('visible');
      cursorLabel.classList.add('visible');
    },
    { passive: true }
  );


  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('visible');
    cursorLabel.classList.remove('visible');
  });


  document.addEventListener('mouseenter', () => {
    cursor.classList.add('visible');
    cursorLabel.classList.add('visible');
  });


  /*
    Elements that should expand the cursor.
  */

  const interactiveElements = document.querySelectorAll(
    [
      'a',
      'button',
      '.exp-trigger',
      '.impact-item',
      '.stat-card',
      '.approach-step',
      '.skill-group',
      '.project-feature'
    ].join(', ')
  );


  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.classList.add('interactive');

      const cursorText =
        element.dataset.cursor ||
        getCursorLabel(element);

      cursorLabel.textContent = cursorText;

      if (cursorText) {
        cursorLabel.classList.add('visible');
      }
    });


    element.addEventListener('mouseleave', () => {
      cursor.classList.remove('interactive');

      cursorLabel.textContent = '';
    });
  });


  cursorAnimationFrame =
    requestAnimationFrame(renderCursor);


  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(cursorAnimationFrame);
  });
}


function getCursorLabel(element) {
  if (element.classList.contains('exp-trigger')) {
    return element
      .closest('.exp-item')
      ?.classList.contains('open')
      ? 'CLOSE'
      : 'OPEN';
  }

  if (
    element.classList.contains('project-feature') ||
    element.closest('#projects')
  ) {
    return 'VIEW';
  }

  if (element.matches('a[target="_blank"]')) {
    return 'OPEN';
  }

  if (
    element.classList.contains('impact-item') ||
    element.classList.contains('stat-card')
  ) {
    return '';
  }

  if (element.classList.contains('contact-cta')) {
    return 'SEND';
  }

  return '';
}


/* ======================================================
   INTERACTIVE HERO SPOTLIGHT
====================================================== */

function initializeHeroSpotlight() {
  if (
    !hero ||
    !finePointer.matches ||
    prefersReducedMotion.matches
  ) {
    return;
  }

  let spotlightFrame;


  hero.addEventListener(
    'mousemove',
    event => {
      cancelAnimationFrame(spotlightFrame);

      spotlightFrame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();

        const x =
          ((event.clientX - rect.left) / rect.width) * 100;

        const y =
          ((event.clientY - rect.top) / rect.height) * 100;

        hero.style.setProperty(
          '--spotlight-x',
          `${x.toFixed(2)}%`
        );

        hero.style.setProperty(
          '--spotlight-y',
          `${y.toFixed(2)}%`
        );
      });
    },
    { passive: true }
  );


  hero.addEventListener('mouseleave', () => {
    hero.style.setProperty(
      '--spotlight-x',
      '70%'
    );

    hero.style.setProperty(
      '--spotlight-y',
      '35%'
    );
  });
}


/* ======================================================
   DATA · STRATEGY · DECISIONS MANIFESTO
====================================================== */

function createBrandManifesto() {
  if (document.querySelector('.brand-manifesto')) {
    return;
  }

  const aboutSection =
    document.getElementById('about');

  if (!aboutSection) {
    return;
  }

  const manifesto =
    document.createElement('section');

  manifesto.className = 'brand-manifesto';

  manifesto.setAttribute(
    'aria-label',
    'Data, strategy, and decisions'
  );

  manifesto.innerHTML = `
    <div
      class="manifesto-line"
      data-direction="right"
      aria-hidden="true"
    >
      <span class="manifesto-word">
        Data
      </span>

      <span class="manifesto-word">
        Data
      </span>

      <span class="manifesto-word">
        Data
      </span>
    </div>

    <div
      class="manifesto-line"
      data-direction="left"
      aria-hidden="true"
    >
      <span class="manifesto-word">
        Strategy
      </span>

      <span class="manifesto-word">
        Strategy
      </span>
    </div>

    <div
      class="manifesto-line"
      data-direction="right"
      aria-hidden="true"
    >
      <span class="manifesto-word">
        Decisions
      </span>

      <span class="manifesto-word">
        Decisions
      </span>
    </div>
  `;

  aboutSection.before(manifesto);
}


/* ======================================================
   MANIFESTO SCROLL MOVEMENT
====================================================== */

function updateManifestoMovement() {
  const manifesto =
    document.querySelector('.brand-manifesto');

  if (
    !manifesto ||
    prefersReducedMotion.matches
  ) {
    manifestoTicking = false;
    return;
  }

  const rect =
    manifesto.getBoundingClientRect();

  const viewportHeight =
    window.innerHeight;

  /*
    Only calculate transforms while the manifesto
    is near or inside the viewport.
  */

  if (
    rect.bottom < -200 ||
    rect.top > viewportHeight + 200
  ) {
    manifestoTicking = false;
    return;
  }

  const visibleProgress =
    (viewportHeight - rect.top) /
    (viewportHeight + rect.height);

  const normalizedProgress =
    Math.min(
      Math.max(visibleProgress, 0),
      1
    );

  const lines =
    manifesto.querySelectorAll('.manifesto-line');


  lines.forEach((line, index) => {
    const direction =
      line.dataset.direction === 'left'
        ? -1
        : 1;

    const baseOffset =
      index === 1
        ? 7
        : -10;

    const movement =
      baseOffset +
      direction *
      (normalizedProgress - 0.5) *
      20;

    line.style.transform =
      `translate3d(${movement}vw, 0, 0)`;
  });

  manifestoTicking = false;
}


/* ======================================================
   NAVIGATION HIDE / SHOW
====================================================== */

function updateNavigation() {
  if (!nav) {
    navTicking = false;
    return;
  }

  const currentScrollY =
    Math.max(window.scrollY, 0);

  if (currentScrollY < 80) {
    nav.classList.remove(
      'hidden',
      'scrolled'
    );
  } else if (
    currentScrollY >
    lastScrollY + 4
  ) {
    nav.classList.add(
      'hidden',
      'scrolled'
    );
  } else if (
    currentScrollY <
    lastScrollY - 4
  ) {
    nav.classList.remove('hidden');
    nav.classList.add('scrolled');
  }

  lastScrollY = currentScrollY;
  navTicking = false;
}


/* ======================================================
   ACTIVE NAVIGATION LINK
====================================================== */

const navObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }

      const sectionId =
        entry.target.id;

      navLinks.forEach(link => {
        link.classList.remove('active');
      });

      const activeLink =
        document.querySelector(
          `.nav-links a[href="#${sectionId}"]`
        );

      if (activeLink) {
        activeLink.classList.add('active');
      }
    });
  },
  {
    rootMargin: '-42% 0px -42% 0px',
    threshold: 0
  }
);


sections.forEach(section => {
  navObserver.observe(section);
});


/* ======================================================
   SMOOTH NAVIGATION
====================================================== */

navLinks.forEach(link => {
  link.addEventListener('click', event => {
    const targetId =
      link.getAttribute('href');

    if (
      !targetId ||
      !targetId.startsWith('#')
    ) {
      return;
    }

    const target =
      document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    target.scrollIntoView({
      behavior:
        prefersReducedMotion.matches
          ? 'auto'
          : 'smooth',
      block: 'start'
    });

    nav?.classList.remove('hidden');
    nav?.classList.add('scrolled');
  });
});


/* ======================================================
   SCROLL PROGRESS
====================================================== */

function updateScrollProgress() {
  if (!progressBar) {
    progressTicking = false;
    return;
  }

  const scrollableHeight =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const percentage =
    scrollableHeight > 0
      ? (window.scrollY / scrollableHeight) * 100
      : 0;

  const clampedPercentage =
    Math.min(
      Math.max(percentage, 0),
      100
    );

  progressBar.style.width =
    `${clampedPercentage}%`;

  progressTicking = false;
}


/* ======================================================
   MASTER SCROLL HANDLER
====================================================== */

window.addEventListener(
  'scroll',
  () => {
    if (!navTicking) {
      requestAnimationFrame(
        updateNavigation
      );

      navTicking = true;
    }

    if (!progressTicking) {
      requestAnimationFrame(
        updateScrollProgress
      );

      progressTicking = true;
    }

    if (!manifestoTicking) {
      requestAnimationFrame(
        updateManifestoMovement
      );

      manifestoTicking = true;
    }
  },
  { passive: true }
);


/* ======================================================
   REVEAL ON SCROLL
====================================================== */

function initializeScrollReveals() {
  const revealElements =
    document.querySelectorAll('.reveal');

  if (prefersReducedMotion.matches) {
    revealElements.forEach(element => {
      element.classList.add('visible');
    });

    return;
  }

  const revealObserver =
    new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            'visible'
          );

          revealObserver.unobserve(
            entry.target
          );
        });
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.05
      }
    );


  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  /*
    Fallback for slow font or resource loading.
  */

  window.setTimeout(() => {
    revealElements.forEach(element => {
      element.classList.add('visible');
    });
  }, 2200);
}


/* ======================================================
   IMPACT COUNTERS
====================================================== */

function animateCounter(
  element,
  target,
  prefix = '',
  suffix = '',
  duration = 1650
) {
  if (prefersReducedMotion.matches) {
    element.textContent =
      `${prefix}${target}${suffix}`;

    return;
  }

  const startTime =
    performance.now();


  function updateCounter(currentTime) {
    const elapsed =
      currentTime - startTime;

    const progress =
      Math.min(
        elapsed / duration,
        1
      );

    /*
      Luxury easing:
      quick confidence at the beginning,
      gradual settle at the end.
    */

    const easedProgress =
      1 - Math.pow(1 - progress, 4);

    const currentValue =
      Math.round(
        easedProgress * target
      );

    element.textContent =
      `${prefix}${currentValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(
        updateCounter
      );
    }
  }


  requestAnimationFrame(updateCounter);
}


function initializeImpactCounters() {
  const impactItems =
    document.querySelectorAll(
      '.impact-item'
    );

  const impactObserver =
    new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            'in-view'
          );

          const valueElement =
            entry.target.querySelector(
              '.impact-val'
            );

          if (
            valueElement &&
            !valueElement.dataset.animated
          ) {
            const target =
              Number.parseInt(
                valueElement.dataset.target,
                10
              );

            if (!Number.isNaN(target)) {
              valueElement.dataset.animated =
                'true';

              animateCounter(
                valueElement,
                target,
                valueElement.dataset.prefix || '',
                valueElement.dataset.suffix || ''
              );
            }
          }

          impactObserver.unobserve(
            entry.target
          );
        });
      },
      {
        threshold: 0.3
      }
    );


  impactItems.forEach(item => {
    impactObserver.observe(item);
  });
}


/* ======================================================
   LUXURY ACCORDIONS
====================================================== */

function closeAccordion(item) {
  const trigger =
    item.querySelector('.exp-trigger');

  const bodyElement =
    item.querySelector('.exp-body');

  const button =
    item.querySelector('.exp-expand-btn');

  item.classList.remove('open');

  trigger?.setAttribute(
    'aria-expanded',
    'false'
  );

  button?.setAttribute(
    'aria-expanded',
    'false'
  );

  if (bodyElement) {
    bodyElement.style.maxHeight = '';
  }
}


function openAccordion(item) {
  const trigger =
    item.querySelector('.exp-trigger');

  const bodyElement =
    item.querySelector('.exp-body');

  const button =
    item.querySelector('.exp-expand-btn');

  item.classList.add('open');

  trigger?.setAttribute(
    'aria-expanded',
    'true'
  );

  button?.setAttribute(
    'aria-expanded',
    'true'
  );

  if (bodyElement) {
    bodyElement.style.maxHeight =
      `${bodyElement.scrollHeight}px`;
  }
}


function toggleExp(trigger) {
  const selectedItem =
    trigger.closest('.exp-item');

  if (!selectedItem) {
    return;
  }

  const wasOpen =
    selectedItem.classList.contains('open');

  /*
    Close all Experience and Project accordions
    before opening the selected one.
  */

  document
    .querySelectorAll('.exp-item.open')
    .forEach(openItem => {
      closeAccordion(openItem);
    });


  if (!wasOpen) {
    openAccordion(selectedItem);
  }
}


window.toggleExp = toggleExp;


/* ======================================================
   ACCORDION ACCESSIBILITY
====================================================== */

function initializeAccordions() {
  const accordionTriggers =
    document.querySelectorAll(
      '.exp-trigger'
    );

  accordionTriggers.forEach(
    (trigger, index) => {
      const item =
        trigger.closest('.exp-item');

      const bodyElement =
        item?.querySelector('.exp-body');

      const button =
        trigger.querySelector(
          '.exp-expand-btn'
        );

      const bodyId =
        `accordion-content-${index + 1}`;

      trigger.setAttribute(
        'tabindex',
        '0'
      );

      trigger.setAttribute(
        'role',
        'button'
      );

      trigger.setAttribute(
        'aria-expanded',
        'false'
      );

      trigger.setAttribute(
        'aria-controls',
        bodyId
      );


      if (bodyElement) {
        bodyElement.id = bodyId;
      }


      if (button) {
        button.setAttribute(
          'aria-expanded',
          'false'
        );

        button.setAttribute(
          'aria-hidden',
          'true'
        );
      }


      trigger.addEventListener(
        'keydown',
        event => {
          if (
            event.key === 'Enter' ||
            event.key === ' '
          ) {
            event.preventDefault();

            toggleExp(trigger);
          }
        }
      );
    }
  );
}


/* ======================================================
   MAGNETIC BUTTON MOVEMENT
====================================================== */

function initializeMagneticElements() {
  if (
    !finePointer.matches ||
    prefersReducedMotion.matches
  ) {
    return;
  }

  const magneticElements =
    document.querySelectorAll(
      [
        '.btn-gold',
        '.btn-outline',
        '.contact-cta',
        '.project-explore'
      ].join(', ')
    );


  magneticElements.forEach(element => {
    element.addEventListener(
      'mousemove',
      event => {
        const rect =
          element.getBoundingClientRect();

        const relativeX =
          event.clientX -
          rect.left -
          rect.width / 2;

        const relativeY =
          event.clientY -
          rect.top -
          rect.height / 2;

        const moveX =
          relativeX * 0.08;

        const moveY =
          relativeY * 0.12;

        element.style.transform =
          `translate3d(${moveX}px, ${moveY}px, 0)`;
      }
    );


    element.addEventListener(
      'mouseleave',
      () => {
        element.style.transform = '';
      }
    );
  });
}


/* ======================================================
   PROJECT FEATURE SCROLL REVEAL
====================================================== */

function initializeProjectFeatures() {
  const projectFeatures =
    document.querySelectorAll(
      '.project-feature'
    );

  if (!projectFeatures.length) {
    return;
  }

  projectFeatures.forEach(
    (feature, index) => {
      feature.classList.add('reveal');

      feature.style.transitionDelay =
        `${Math.min(index * 0.05, 0.2)}s`;
    }
  );
}


/* ======================================================
   HERO TEXT DATA ATTRIBUTES
====================================================== */

function initializeHeroText() {
  const firstName =
    document.querySelector(
      '.hero-name-first'
    );

  const lastName =
    document.querySelector(
      '.hero-name-last'
    );

  if (firstName) {
    firstName.dataset.text =
      firstName.textContent.trim();
  }

  if (lastName) {
    lastName.dataset.text =
      lastName.textContent.trim();
  }
}


/* ======================================================
   RESIZE HANDLING
====================================================== */

window.addEventListener(
  'resize',
  () => {
    window.clearTimeout(resizeTimer);

    resizeTimer =
      window.setTimeout(() => {
        document
          .querySelectorAll(
            '.exp-item.open'
          )
          .forEach(item => {
            const bodyElement =
              item.querySelector(
                '.exp-body'
              );

            if (bodyElement) {
              bodyElement.style.maxHeight =
                `${bodyElement.scrollHeight}px`;
            }
          });

        updateScrollProgress();
        updateManifestoMovement();
      }, 140);
  },
  { passive: true }
);


/* ======================================================
   REDUCED MOTION CHANGES
====================================================== */

prefersReducedMotion.addEventListener(
  'change',
  event => {
    if (event.matches) {
      document
        .querySelector('.intro-overlay')
        ?.remove();

      document
        .querySelector('.luxury-cursor')
        ?.remove();

      document
        .querySelector(
          '.luxury-cursor-label'
        )
        ?.remove();

      body.classList.remove(
        'intro-active'
      );

      body.classList.add(
        'page-ready'
      );

      document
        .querySelectorAll('.reveal')
        .forEach(element => {
          element.classList.add(
            'visible'
          );
        });
    }
  }
);


/* ======================================================
   INITIALIZATION
====================================================== */

function initializePortfolio() {
  /*
    Build page elements that are not part of the
    original HTML structure.
  */

  createIntroOverlay();
  createBrandManifesto();

  /*
    Prepare interface behavior.
  */

  initializeHeroText();
  initializeHeroSpotlight();
  initializeProjectFeatures();
  initializeAccordions();
  initializeImpactCounters();
  initializeScrollReveals();
  initializeMagneticElements();

  /*
    The custom cursor is initialized after the
    dynamically generated page elements exist.
  */

  createLuxuryCursor();

  /*
    Ensure the normal hero entrance still works
    when the intro is disabled.
  */

  initializeHeroEntrance();

  /*
    Initial layout and page calculations.
  */

  updateNavigation();
  updateScrollProgress();
  updateManifestoMovement();
}


/* ======================================================
   START THE PORTFOLIO
====================================================== */

if (
  document.readyState === 'loading'
) {
  document.addEventListener(
    'DOMContentLoaded',
    initializePortfolio
  );
} else {
  initializePortfolio();
}


/* ======================================================
   FINAL LOAD RECALCULATION
====================================================== */

window.addEventListener('load', () => {
  updateNavigation();
  updateScrollProgress();
  updateManifestoMovement();

  /*
    Fonts can change accordion measurements after
    they finish loading.
  */

  document
    .querySelectorAll('.exp-item.open')
    .forEach(item => {
      const bodyElement =
        item.querySelector('.exp-body');

      if (bodyElement) {
        bodyElement.style.maxHeight =
          `${bodyElement.scrollHeight}px`;
      }
    });
});
