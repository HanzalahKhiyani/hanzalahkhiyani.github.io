/* ======================================================
   HANZALAH KHIYANI PORTFOLIO
   SIMPLE PREMIUM EDITORIAL APP.JS
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
   PAGE READY
   Activates the simple hero entrance
====================================================== */

function initializePage() {
  /*
    Remove any leftover lock from older versions.
  */

  body.classList.remove('intro-active');


  /*
    Add page-ready on the next animation frame
    so the hero entrance animation can play.
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
    Desktop / mouse only.
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

  cursorLabel.className =
    'luxury-cursor-label';


  cursor.setAttribute(
    'aria-hidden',
    'true'
  );

  cursorLabel.setAttribute(
    'aria-hidden',
    'true'
  );


  body.append(
    cursor,
    cursorLabel
  );


  /* Mouse coordinates */

  let mouseX =
    window.innerWidth / 2;

  let mouseY =
    window.innerHeight / 2;


  /* Cursor coordinates */

  let cursorX = mouseX;
  let cursorY = mouseY;


  /* Cursor label coordinates */

  let labelX = mouseX;
  let labelY = mouseY;


  let animationFrame;


  /* ====================================================
     CURSOR ANIMATION LOOP
  ==================================================== */

  function renderCursor() {
    /*
      Eased movement creates the subtle
      trailing effect.
    */

    cursorX +=
      (mouseX - cursorX) * 0.24;

    cursorY +=
      (mouseY - cursorY) * 0.24;


    labelX +=
      (mouseX - labelX) * 0.2;

    labelY +=
      (mouseY - labelY) * 0.2;


    cursor.style.transform =
      `
        translate3d(
          ${cursorX}px,
          ${cursorY}px,
          0
        )
        translate(-50%, -50%)
      `;


    cursorLabel.style.transform =
      `
        translate3d(
          ${labelX}px,
          ${labelY}px,
          0
        )
        translate(-50%, -50%)
      `;


    animationFrame =
      requestAnimationFrame(
        renderCursor
      );
  }


  /* ====================================================
     TRACK MOUSE
  ==================================================== */

  document.addEventListener(
    'mousemove',
    event => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursor.classList.add(
        'visible'
      );
    },
    {
      passive: true
    }
  );


  /* ====================================================
     HIDE CURSOR WHEN LEAVING WINDOW
  ==================================================== */

  document.addEventListener(
    'mouseleave',
    () => {
      cursor.classList.remove(
        'visible'
      );

      cursorLabel.classList.remove(
        'visible'
      );
    }
  );


  document.addEventListener(
    'mouseenter',
    () => {
      cursor.classList.add(
        'visible'
      );
    }
  );


  /* ====================================================
     INTERACTIVE ELEMENTS
  ==================================================== */

  const interactiveElements =
    document.querySelectorAll(
      [
        'a',
        'button',
        '.editorial-entry',
        '.stat-card',
        '.impact-item',
        '.approach-step',
        '.skill-group',
        '.project-case-item'
      ].join(', ')
    );


  interactiveElements.forEach(
    element => {

      element.addEventListener(
        'mouseenter',
        () => {
          cursor.classList.add(
            'interactive'
          );


          const label =
            element.dataset.cursor ||
            getCursorLabel(element);


          if (label) {
            cursorLabel.textContent =
              label;

            cursorLabel.classList.add(
              'visible'
            );
          } else {
            cursorLabel.textContent = '';

            cursorLabel.classList.remove(
              'visible'
            );
          }
        }
      );


      element.addEventListener(
        'mouseleave',
        () => {
          cursor.classList.remove(
            'interactive'
          );


          cursorLabel.textContent = '';

          cursorLabel.classList.remove(
            'visible'
          );
        }
      );

    }
  );


  animationFrame =
    requestAnimationFrame(
      renderCursor
    );


  window.addEventListener(
    'beforeunload',
    () => {
      cancelAnimationFrame(
        animationFrame
      );
    }
  );
}


/* ======================================================
   CURSOR LABELS
====================================================== */

function getCursorLabel(element) {
  /*
    Explicit data-cursor values in the HTML
    always take priority.
  */

  if (element.dataset.cursor) {
    return element.dataset.cursor;
  }


  /*
    External links
  */

  if (
    element.matches(
      'a[target="_blank"]'
    )
  ) {
    return 'OPEN';
  }


  /*
    Email / contact CTA
  */

  if (
    element.classList.contains(
      'contact-cta'
    )
  ) {
    return 'SEND';
  }


  /*
    The editorial Experience and Projects
    remain visually interactive without
    requiring cursor text.
  */

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
      cancelAnimationFrame(
        spotlightFrame
      );


      spotlightFrame =
        requestAnimationFrame(
          () => {
            const rect =
              hero.getBoundingClientRect();


            const relativeX =
              event.clientX -
              rect.left;


            const relativeY =
              event.clientY -
              rect.top;


            const x =
              (relativeX /
                rect.width) *
              100;


            const y =
              (relativeY /
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
          }
        );
    },
    {
      passive: true
    }
  );


  /*
    Reset when mouse leaves hero.
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
    Top of page.
  */

  if (currentScrollY < 80) {
    nav.classList.remove(
      'hidden',
      'scrolled'
    );
  }


  /*
    Scroll down.
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
    Scroll up.
  */

  else if (
    currentScrollY <
    lastScrollY - 4
  ) {
    nav.classList.remove(
      'hidden'
    );

    nav.classList.add(
      'scrolled'
    );
  }


  lastScrollY =
    currentScrollY;


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


  const observer =
    new IntersectionObserver(
      entries => {
        entries.forEach(
          entry => {
            if (
              !entry.isIntersecting
            ) {
              return;
            }


            const sectionId =
              entry.target.id;


            /*
              Clear previous active link.
            */

            navLinks.forEach(
              link => {
                link.classList.remove(
                  'active'
                );
              }
            );


            /*
              Find corresponding navigation link.
            */

            const activeLink =
              document.querySelector(
                `.nav-links a[href="#${sectionId}"]`
              );


            if (activeLink) {
              activeLink.classList.add(
                'active'
              );
            }
          }
        );
      },
      {
        rootMargin:
          '-42% 0px -42% 0px',

        threshold: 0
      }
    );


  sections.forEach(
    section => {
      observer.observe(
        section
      );
    }
  );
}


/* ======================================================
   SMOOTH NAVIGATION
====================================================== */

function initializeSmoothNavigation() {
  /*
    Handles both top navigation and
    internal hero links.
  */

  const internalLinks =
    document.querySelectorAll(
      'a[href^="#"]'
    );


  internalLinks.forEach(
    link => {
      link.addEventListener(
        'click',
        event => {
          const targetId =
            link.getAttribute(
              'href'
            );


          /*
            Ignore plain # links.
          */

          if (
            !targetId ||
            targetId === '#'
          ) {
            return;
          }


          const target =
            document.querySelector(
              targetId
            );


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


          /*
            Keep navigation visible after
            a navigation click.
          */

          nav?.classList.remove(
            'hidden'
          );


          if (window.scrollY > 80) {
            nav?.classList.add(
              'scrolled'
            );
          }
        }
      );
    }
  );
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
    document.documentElement
      .scrollHeight -
    window.innerHeight;


  const percentage =
    scrollableHeight > 0
      ? (
          window.scrollY /
          scrollableHeight
        ) * 100
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
      /*
        Navigation update
      */

      if (!navTicking) {
        requestAnimationFrame(
          updateNavigation
        );

        navTicking = true;
      }


      /*
        Progress bar update
      */

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
   SCROLL REVEALS
====================================================== */

function initializeScrollReveals() {
  const revealElements =
    document.querySelectorAll(
      '.reveal'
    );


  if (!revealElements.length) {
    return;
  }


  /*
    Accessibility:
    immediately show everything when
    reduced motion is enabled.
  */

  if (
    prefersReducedMotion.matches
  ) {
    revealElements.forEach(
      element => {
        element.classList.add(
          'visible'
        );
      }
    );

    return;
  }


  const observer =
    new IntersectionObserver(
      entries => {
        entries.forEach(
          entry => {
            if (
              !entry.isIntersecting
            ) {
              return;
            }


            entry.target.classList.add(
              'visible'
            );


            /*
              Animation only needs to happen once.
            */

            observer.unobserve(
              entry.target
            );
          }
        );
      },
      {
        rootMargin:
          '0px 0px -8% 0px',

        threshold: 0.05
      }
    );


  revealElements.forEach(
    element => {
      observer.observe(
        element
      );
    }
  );


  /*
    Safety fallback in case a browser
    delays IntersectionObserver.
  */

  window.setTimeout(
    () => {
      revealElements.forEach(
        element => {
          element.classList.add(
            'visible'
          );
        }
      );
    },
    1800
  );
}


/* ======================================================
   IMPACT COUNTER ANIMATION
====================================================== */

function animateCounter(
  element,
  target,
  prefix = '',
  suffix = '',
  duration = 1400
) {
  /*
    Reduced motion:
    immediately display the final value.
  */

  if (
    prefersReducedMotion.matches
  ) {
    element.textContent =
      `${prefix}${target}${suffix}`;

    return;
  }


  const startTime =
    performance.now();


  function updateCounter(
    currentTime
  ) {
    const elapsed =
      currentTime -
      startTime;


    const progress =
      Math.min(
        elapsed /
          duration,
        1
      );


    /*
      Smooth ease-out.
    */

    const easedProgress =
      1 -
      Math.pow(
        1 - progress,
        3
      );


    const currentValue =
      Math.round(
        easedProgress *
        target
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


/* ======================================================
   INITIALIZE IMPACT COUNTERS
====================================================== */

function initializeImpactCounters() {
  const impactItems =
    document.querySelectorAll(
      '.impact-item'
    );


  if (!impactItems.length) {
    return;
  }


  const observer =
    new IntersectionObserver(
      entries => {
        entries.forEach(
          entry => {
            if (
              !entry.isIntersecting
            ) {
              return;
            }


            /*
              Activates the gold top line.
            */

            entry.target.classList.add(
              'in-view'
            );


            const valueElement =
              entry.target.querySelector(
                '.impact-val'
              );


            /*
              Prevent duplicate animation.
            */

            if (
              valueElement &&
              !valueElement.dataset
                .animated
            ) {
              const target =
                Number.parseInt(
                  valueElement
                    .dataset
                    .target,
                  10
                );


              if (
                !Number.isNaN(
                  target
                )
              ) {
                valueElement.dataset
                  .animated =
                  'true';


                const prefix =
                  valueElement
                    .dataset
                    .prefix ||
                  '';


                const suffix =
                  valueElement
                    .dataset
                    .suffix ||
                  '';


                animateCounter(
                  valueElement,
                  target,
                  prefix,
                  suffix
                );
              }
            }


            observer.unobserve(
              entry.target
            );
          }
        );
      },
      {
        threshold: 0.3
      }
    );


  impactItems.forEach(
    item => {
      observer.observe(
        item
      );
    }
  );
}


/* ======================================================
   EDITORIAL EXPERIENCE
====================================================== */

function initializeExperience() {
  const experienceEntries =
    document.querySelectorAll(
      '.experience-entry'
    );


  /*
    Experience is intentionally static now.
    Nothing opens or closes.
  */

  experienceEntries.forEach(
    entry => {
      entry.removeAttribute(
        'aria-expanded'
      );
    }
  );
}


/* ======================================================
   EDITORIAL PROJECTS
====================================================== */

function initializeProjects() {
  const projectEntries =
    document.querySelectorAll(
      '.project-entry'
    );


  /*
    Projects are fully expanded and visible.
    There is no Explore Project behavior.
  */

  projectEntries.forEach(
    entry => {
      const caseStudy =
        entry.querySelector(
          '.project-case-study'
        );


      if (caseStudy) {
        caseStudy.hidden = false;
      }
    }
  );


  /*
    Remove any leftover Explore Project
    buttons from older versions.
  */

  document
    .querySelectorAll(
      '.project-explore'
    )
    .forEach(
      element => {
        element.remove();
      }
    );


  /*
    Remove leftover older hidden
    project-detail containers if somehow
    still present in the DOM.
  */

  document
    .querySelectorAll(
      '.project-detail[hidden]'
    )
    .forEach(
      detail => {
        detail.hidden = false;
      }
    );
}


/* ======================================================
   CLEAN UP OLD ACCORDION MARKUP
====================================================== */

function cleanLegacyAccordionState() {
  /*
    The new HTML should not contain these,
    but cleaning the old state prevents stale
    classes from affecting the page if Chrome
    restores an older DOM state.
  */

  document
    .querySelectorAll(
      '.exp-item.open'
    )
    .forEach(
      item => {
        item.classList.remove(
          'open'
        );
      }
    );


  document
    .querySelectorAll(
      '.exp-body'
    )
    .forEach(
      bodyElement => {
        bodyElement.style
          .maxHeight = '';
      }
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
              Progress height can change when
              responsive content wraps.
            */

            updateScrollProgress();


            /*
              Reset hero spotlight to a sensible
              position after viewport changes.
            */

            if (hero) {
              hero.style.setProperty(
                '--spotlight-x',
                '70%'
              );


              hero.style.setProperty(
                '--spotlight-y',
                '35%'
              );
            }
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
   REDUCED MOTION HANDLING
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
        Ensure all reveal content is shown.
      */

      document
        .querySelectorAll(
          '.reveal'
        )
        .forEach(
          element => {
            element.classList.add(
              'visible'
            );
          }
        );


      /*
        Ensure hero is fully visible.
      */

      body.classList.add(
        'page-ready'
      );


      /*
        Immediately finish all counters.
      */

      document
        .querySelectorAll(
          '.impact-val[data-target]'
        )
        .forEach(
          element => {
            const target =
              element.dataset.target;

            const prefix =
              element.dataset.prefix ||
              '';

            const suffix =
              element.dataset.suffix ||
              '';


            element.textContent =
              `${prefix}${target}${suffix}`;
          }
        );
    }
  );
}


/* ======================================================
   CLEAN OLD EXPERIMENTAL ELEMENTS
====================================================== */

function removeLegacyElements() {
  /*
    Remove cinematic intro if leftover
    from an older version.
  */

  document
    .querySelectorAll(
      '.intro-overlay'
    )
    .forEach(
      element => {
        element.remove();
      }
    );


  /*
    Remove scrolling manifesto if leftover.
  */

  document
    .querySelectorAll(
      '.brand-manifesto'
    )
    .forEach(
      element => {
        element.remove();
      }
    );


  /*
    Remove old body lock.
  */

  body.classList.remove(
    'intro-active'
  );
}


/* ======================================================
   INITIALIZE PORTFOLIO
====================================================== */

function initializePortfolio() {
  /*
    Cleanup first.
  */

  removeLegacyElements();

  cleanLegacyAccordionState();


  /*
    Hero.
  */

  initializePage();

  initializeHeroSpotlight();


  /*
    Custom cursor.
  */

  createCustomCursor();


  /*
    Navigation.
  */

  initializeActiveNavigation();

  initializeSmoothNavigation();

  initializeScrollEvents();


  /*
    Main page content.
  */

  initializeExperience();

  initializeProjects();

  initializeImpactCounters();

  initializeScrollReveals();


  /*
    Browser behavior.
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
  document.readyState ===
  'loading'
) {
  document.addEventListener(
    'DOMContentLoaded',
    initializePortfolio
  );
} else {
  initializePortfolio();
}


/* ======================================================
   FINAL LOAD CHECK
====================================================== */

window.addEventListener(
  'load',
  () => {
    /*
      Recalculate after Google Fonts and
      other resources have loaded.
    */

    updateNavigation();

    updateScrollProgress();


    /*
      Make sure projects remain visible.
    */

    document
      .querySelectorAll(
        '.project-case-study'
      )
      .forEach(
        caseStudy => {
          caseStudy.hidden = false;
        }
      );


    /*
      Last reveal fallback.
    */

    document
      .querySelectorAll(
        '.reveal'
      )
      .forEach(
        element => {
          /*
            IntersectionObserver handles the
            normal animation. This only fixes
            content that somehow remained hidden.
          */

          const rect =
            element.getBoundingClientRect();


          if (
            rect.top <
            window.innerHeight *
              1.15
          ) {
            element.classList.add(
              'visible'
            );
          }
        }
      );
  }
);
