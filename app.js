/* ======================================================
   HANZALAH KHIYANI PORTFOLIO
   SIMPLE PREMIUM APP.JS
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

const body = document.body;

const nav = document.getElementById('nav');
const hero = document.getElementById('hero');
const progressBar = document.getElementById('progress');

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

let lastScrollY = window.scrollY;

let navTicking = false;
let progressTicking = false;
let resizeTimer;


/* ======================================================
   PAGE READY / HERO ENTRANCE
====================================================== */

function initializePage() {
  /*
    Make sure the old cinematic intro can never
    leave the page locked.
  */

  body.classList.remove('intro-active');

  /*
    Activates the clean hero entrance animation.
  */

  requestAnimationFrame(() => {
    body.classList.add('page-ready');
  });
}


/* ======================================================
   CUSTOM POINTER-FOLLOW CURSOR
====================================================== */

function createCustomCursor() {
  /*
    Only show the custom cursor on desktop devices
    with an actual mouse / fine pointer.
  */

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

  body.append(cursor, cursorLabel);


  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let cursorX = mouseX;
  let cursorY = mouseY;

  let labelX = mouseX;
  let labelY = mouseY;

  let cursorFrame;


  function renderCursor() {
    /*
      Slight easing creates the smooth trailing effect.
    */

    cursorX += (mouseX - cursorX) * 0.24;
    cursorY += (mouseY - cursorY) * 0.24;

    labelX += (mouseX - labelX) * 0.2;
    labelY += (mouseY - labelY) * 0.2;


    cursor.style.transform =
      `translate3d(${cursorX}px, ${cursorY}px, 0)
       translate(-50%, -50%)`;


    cursorLabel.style.transform =
      `translate3d(${labelX}px, ${labelY}px, 0)
       translate(-50%, -50%)`;


    cursorFrame = requestAnimationFrame(
      renderCursor
    );
  }


  /* Track mouse position */

  document.addEventListener(
    'mousemove',
    event => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursor.classList.add('visible');
    },
    {
      passive: true
    }
  );


  /* Hide cursor when mouse leaves browser area */

  document.addEventListener(
    'mouseleave',
    () => {
      cursor.classList.remove('visible');
      cursorLabel.classList.remove('visible');
    }
  );


  document.addEventListener(
    'mouseenter',
    () => {
      cursor.classList.add('visible');
    }
  );


  /*
    Elements that should trigger the larger pointer.
  */

  const interactiveElements =
    document.querySelectorAll(
      [
        'a',
        'button',
        '.exp-trigger',
        '.project-feature'
      ].join(', ')
    );


  interactiveElements.forEach(element => {

    element.addEventListener(
      'mouseenter',
      () => {
        cursor.classList.add('interactive');


        const label =
          element.dataset.cursor ||
          getCursorLabel(element);


        if (label) {
          cursorLabel.textContent = label;
          cursorLabel.classList.add('visible');
        } else {
          cursorLabel.textContent = '';
          cursorLabel.classList.remove('visible');
        }
      }
    );


    element.addEventListener(
      'mouseleave',
      () => {
        cursor.classList.remove('interactive');

        cursorLabel.textContent = '';
        cursorLabel.classList.remove('visible');
      }
    );

  });


  cursorFrame = requestAnimationFrame(
    renderCursor
  );


  window.addEventListener(
    'beforeunload',
    () => {
      cancelAnimationFrame(cursorFrame);
    }
  );
}


/* ======================================================
   CURSOR LABELS
====================================================== */

function getCursorLabel(element) {
  /*
    Experience accordion
  */

  if (element.classList.contains('exp-trigger')) {
    const item = element.closest('.exp-item');

    return item?.classList.contains('open')
      ? 'CLOSE'
      : 'OPEN';
  }


  /*
    Project showcase
  */

  if (element.classList.contains('project-feature')) {
    return '';
  }


  /*
    External links
  */

  if (element.matches('a[target="_blank"]')) {
    return 'OPEN';
  }


  /*
    Email CTA
  */

  if (element.classList.contains('contact-cta')) {
    return 'SEND';
  }


  return '';
}


/* ======================================================
   HERO POINTER SPOTLIGHT
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


      spotlightFrame =
        requestAnimationFrame(() => {

          const rect =
            hero.getBoundingClientRect();


          const x =
            ((event.clientX - rect.left) /
              rect.width) *
            100;


          const y =
            ((event.clientY - rect.top) /
              rect.height) *
            100;


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
    {
      passive: true
    }
  );


  /*
    Return the spotlight to its default position.
  */

  hero.addEventListener(
    'mouseleave',
    () => {
      hero.style.setProperty(
        '--spotlight-x',
        '70%'
      );

      hero.style.setProperty(
        '--spotlight-y',
        '35%'
      );
    }
  );
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
    Math.max(
      window.scrollY,
      0
    );


  /*
    At top of page:
    show normal navigation.
  */

  if (currentScrollY < 80) {

    nav.classList.remove(
      'hidden',
      'scrolled'
    );

  }

  /*
    Scrolling down:
    hide navigation.
  */

  else if (
    currentScrollY >
    lastScrollY + 4
  ) {

    nav.classList.add(
      'hidden',
      'scrolled'
    );

  }

  /*
    Scrolling up:
    show compact navigation.
  */

  else if (
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
   ACTIVE NAVIGATION SECTION
====================================================== */

function initializeActiveNavigation() {
  if (
    !sections.length ||
    !navLinks.length
  ) {
    return;
  }


  const navObserver =
    new IntersectionObserver(
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
}


/* ======================================================
   SMOOTH NAVIGATION
====================================================== */

function initializeSmoothNavigation() {
  navLinks.forEach(link => {

    link.addEventListener(
      'click',
      event => {

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

      }
    );

  });
}


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
      Math.max(
        percentage,
        0
      ),
      100
    );


  progressBar.style.width =
    `${clampedPercentage}%`;


  progressTicking = false;
}


/* ======================================================
   MASTER SCROLL LISTENER
====================================================== */

function initializeScrollEvents() {
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

    },
    {
      passive: true
    }
  );
}


/* ======================================================
   REVEAL ON SCROLL
====================================================== */

function initializeScrollReveals() {
  const revealElements =
    document.querySelectorAll('.reveal');


  if (!revealElements.length) {
    return;
  }


  /*
    Skip animation if reduced motion is enabled.
  */

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
    Safety fallback.
  */

  window.setTimeout(
    () => {

      revealElements.forEach(element => {
        element.classList.add('visible');
      });

    },
    1800
  );
}


/* ======================================================
   IMPACT COUNTERS
====================================================== */

function animateCounter(
  element,
  target,
  prefix = '',
  suffix = '',
  duration = 1400
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
      Ease-out cubic.
    */

    const easedProgress =
      1 - Math.pow(
        1 - progress,
        3
      );


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


  requestAnimationFrame(
    updateCounter
  );
}


function initializeImpactCounters() {
  const impactItems =
    document.querySelectorAll(
      '.impact-item'
    );


  if (!impactItems.length) {
    return;
  }


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


              const prefix =
                valueElement.dataset.prefix ||
                '';


              const suffix =
                valueElement.dataset.suffix ||
                '';


              animateCounter(
                valueElement,
                target,
                prefix,
                suffix
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
   EXPERIENCE ACCORDIONS
====================================================== */

function closeAccordion(item) {
  if (!item) {
    return;
  }


  const trigger =
    item.querySelector(
      '.exp-trigger'
    );


  const bodyElement =
    item.querySelector(
      '.exp-body'
    );


  const button =
    item.querySelector(
      '.exp-expand-btn'
    );


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
  if (!item) {
    return;
  }


  const trigger =
    item.querySelector(
      '.exp-trigger'
    );


  const bodyElement =
    item.querySelector(
      '.exp-body'
    );


  const button =
    item.querySelector(
      '.exp-expand-btn'
    );


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


/* ======================================================
   PUBLIC ACCORDION FUNCTION
====================================================== */

function toggleExp(trigger) {
  const selectedItem =
    trigger.closest(
      '.exp-item'
    );


  if (!selectedItem) {
    return;
  }


  const wasOpen =
    selectedItem.classList.contains(
      'open'
    );


  /*
    Close any currently open Experience item.
  */

  document
    .querySelectorAll(
      '.exp-item.open'
    )
    .forEach(openItem => {

      closeAccordion(openItem);

    });


  /*
    Open the selected item if it wasn't already open.
  */

  if (!wasOpen) {
    openAccordion(selectedItem);
  }
}


/*
  Required because the HTML currently uses:

  onclick="toggleExp(this)"
*/

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
        trigger.closest(
          '.exp-item'
        );


      const bodyElement =
        item?.querySelector(
          '.exp-body'
        );


      const button =
        trigger.querySelector(
          '.exp-expand-btn'
        );


      const bodyId =
        `experience-panel-${index + 1}`;


      /*
        Make the complete row keyboard accessible.
      */

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
          'aria-hidden',
          'true'
        );

      }


      /*
        Keyboard support.
      */

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
   PROJECT SHOWCASE
====================================================== */

function initializeProjects() {
  const projectFeatures =
    document.querySelectorAll(
      '.project-feature'
    );


  if (!projectFeatures.length) {
    return;
  }


  projectFeatures.forEach(
    (project, index) => {

      /*
        Projects are always fully visible.
        No Explore Project interaction is needed.
      */

      const detail =
        project.querySelector(
          '.project-detail'
        );


      if (detail) {

        /*
          Remove the HTML hidden state.
          CSS also handles this as a backup.
        */

        detail.hidden = false;

      }


      /*
        Give each project a reveal animation
        without turning it into another accordion.
      */

      project.classList.add(
        'reveal'
      );


      project.style.transitionDelay =
        `${Math.min(
          index * 0.06,
          0.18
        )}s`;

    }
  );


  /*
    Hide any leftover Explore Project links
    from older HTML.
  */

  document
    .querySelectorAll(
      '.project-explore'
    )
    .forEach(link => {

      link.remove();

    });
}


/* ======================================================
   REMOVE OLD OVERDONE ELEMENTS
====================================================== */

function removeLegacyLuxuryElements() {
  /*
    Remove any leftover intro popup.
  */

  document
    .querySelectorAll(
      '.intro-overlay'
    )
    .forEach(element => {
      element.remove();
    });


  /*
    Remove any leftover scrolling manifesto.
  */

  document
    .querySelectorAll(
      '.brand-manifesto'
    )
    .forEach(element => {
      element.remove();
    });


  /*
    Remove the old body lock.
  */

  body.classList.remove(
    'intro-active'
  );
}


/* ======================================================
   RESIZE HANDLING
====================================================== */

function initializeResizeHandling() {
  window.addEventListener(
    'resize',
    () => {

      window.clearTimeout(
        resizeTimer
      );


      resizeTimer =
        window.setTimeout(
          () => {

            /*
              Recalculate open accordion height.
            */

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

          },
          120
        );

    },
    {
      passive: true
    }
  );
}


/* ======================================================
   REDUCED MOTION CHANGES
====================================================== */

function initializeReducedMotionHandling() {
  prefersReducedMotion.addEventListener(
    'change',
    event => {

      if (!event.matches) {
        return;
      }


      /*
        Remove custom cursor.
      */

      document
        .querySelector(
          '.luxury-cursor'
        )
        ?.remove();


      document
        .querySelector(
          '.luxury-cursor-label'
        )
        ?.remove();


      /*
        Reveal all content immediately.
      */

      document
        .querySelectorAll(
          '.reveal'
        )
        .forEach(element => {

          element.classList.add(
            'visible'
          );

        });


      /*
        Ensure hero is visible.
      */

      body.classList.add(
        'page-ready'
      );

    }
  );
}


/* ======================================================
   INITIALIZE EVERYTHING
====================================================== */

function initializePortfolio() {
  /*
    Remove effects from the previous luxury experiment.
  */

  removeLegacyLuxuryElements();


  /*
    Initialize the actual page.
  */

  initializePage();


  /*
    Pointer-follow effects.
  */

  initializeHeroSpotlight();
  createCustomCursor();


  /*
    Navigation.
  */

  initializeActiveNavigation();
  initializeSmoothNavigation();
  initializeScrollEvents();


  /*
    Content interaction.
  */

  initializeProjects();
  initializeAccordions();
  initializeImpactCounters();
  initializeScrollReveals();


  /*
    Browser / accessibility handling.
  */

  initializeResizeHandling();
  initializeReducedMotionHandling();


  /*
    Initial measurements.
  */

  updateNavigation();
  updateScrollProgress();
}


/* ======================================================
   START APPLICATION
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

window.addEventListener(
  'load',
  () => {

    /*
      Recalculate after fonts and other resources load.
    */

    updateNavigation();
    updateScrollProgress();


    /*
      Ensure all project details remain visible.
    */

    document
      .querySelectorAll(
        '.project-detail'
      )
      .forEach(detail => {

        detail.hidden = false;

      });


    /*
      Fix accordion measurements after fonts load.
    */

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

  }
);
