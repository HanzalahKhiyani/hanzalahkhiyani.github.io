/* ======================================================
   HANZALAH KHIYANI PORTFOLIO
   APP.JS
====================================================== */


/* ─── ELEMENT REFERENCES ─────────────────────────────── */

const nav = document.getElementById('nav');
const progressBar = document.getElementById('progress');

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

let lastScrollY = window.scrollY;
let navTicking = false;
let progressTicking = false;


/* ======================================================
   NAVIGATION
   Hide on scroll down / show on scroll up
====================================================== */

function updateNav() {
  const currentScrollY = window.scrollY;

  if (!nav) {
    navTicking = false;
    return;
  }

  if (currentScrollY < 80) {
    nav.classList.remove('hidden', 'scrolled');
  } else if (currentScrollY > lastScrollY + 3) {
    nav.classList.add('hidden');
    nav.classList.add('scrolled');
  } else if (currentScrollY < lastScrollY - 3) {
    nav.classList.remove('hidden');
    nav.classList.add('scrolled');
  }

  lastScrollY = Math.max(currentScrollY, 0);
  navTicking = false;
}


window.addEventListener(
  'scroll',
  () => {
    if (!navTicking) {
      requestAnimationFrame(updateNav);
      navTicking = true;
    }
  },
  { passive: true }
);


/* ======================================================
   ACTIVE NAVIGATION SECTION
====================================================== */

const navObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }

      const sectionId = entry.target.id;

      navLinks.forEach(link => {
        link.classList.remove('active');
      });

      const activeLink = document.querySelector(
        `.nav-links a[href="#${sectionId}"]`
      );

      if (activeLink) {
        activeLink.classList.add('active');
      }
    });
  },
  {
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  }
);


sections.forEach(section => {
  navObserver.observe(section);
});


/* ======================================================
   SMOOTH NAVIGATION LINKS
====================================================== */

navLinks.forEach(link => {
  link.addEventListener('click', event => {
    const targetId = link.getAttribute('href');

    if (!targetId || !targetId.startsWith('#')) {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    if (nav) {
      nav.classList.remove('hidden');
      nav.classList.add('scrolled');
    }
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

  const documentHeight =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const percentage =
    documentHeight > 0
      ? (window.scrollY / documentHeight) * 100
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


window.addEventListener(
  'scroll',
  () => {
    if (!progressTicking) {
      requestAnimationFrame(updateScrollProgress);
      progressTicking = true;
    }
  },
  { passive: true }
);


/* Initial progress state */

updateScrollProgress();


/* ======================================================
   REVEAL ON SCROLL
====================================================== */

const revealElements =
  document.querySelectorAll('.reveal');


const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('visible');

      revealObserver.unobserve(entry.target);
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


/* Fallback in case IntersectionObserver reveal is delayed */

window.addEventListener('load', () => {
  setTimeout(() => {
    document
      .querySelectorAll('.reveal')
      .forEach(element => {
        element.classList.add('visible');
      });
  }, 1000);
});


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
  const startTime = performance.now();


  function updateCounter(currentTime) {
    const elapsed =
      currentTime - startTime;

    const progress =
      Math.min(
        elapsed / duration,
        1
      );

    /*
      Cubic ease-out.
      Fast at the beginning and slows toward the end.
    */

    const easedProgress =
      1 - Math.pow(1 - progress, 3);

    const currentValue =
      Math.round(
        easedProgress * target
      );

    element.textContent =
      `${prefix}${currentValue}${suffix}`;


    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }


  requestAnimationFrame(updateCounter);
}


const impactObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }


      entry.target.classList.add('in-view');


      const valueElement =
        entry.target.querySelector('.impact-val');


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
          valueElement.dataset.animated = 'true';

          const prefix =
            valueElement.dataset.prefix || '';

          const suffix =
            valueElement.dataset.suffix || '';


          animateCounter(
            valueElement,
            target,
            prefix,
            suffix
          );
        }
      }


      impactObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.3
  }
);


document
  .querySelectorAll('.impact-item')
  .forEach(item => {
    impactObserver.observe(item);
  });


/* ======================================================
   EXPERIENCE + PROJECT ACCORDIONS
====================================================== */

/*
  The HTML uses:

  onclick="toggleExp(this)"

  so this function remains globally available.
*/

function toggleExp(trigger) {
  const selectedItem =
    trigger.closest('.exp-item');


  if (!selectedItem) {
    return;
  }


  const selectedBody =
    selectedItem.querySelector('.exp-body');


  const selectedButton =
    selectedItem.querySelector('.exp-expand-btn');


  const wasOpen =
    selectedItem.classList.contains('open');


  /*
    Close every currently open accordion first.
  */

  document
    .querySelectorAll('.exp-item.open')
    .forEach(openItem => {
      const body =
        openItem.querySelector('.exp-body');

      const button =
        openItem.querySelector('.exp-expand-btn');


      openItem.classList.remove('open');


      if (body) {
        body.style.maxHeight = '';
      }


      if (button) {
        button.setAttribute(
          'aria-expanded',
          'false'
        );
      }
    });


  /*
    If the clicked item was previously closed,
    open it and calculate the exact content height.
  */

  if (!wasOpen) {
    selectedItem.classList.add('open');


    if (selectedBody) {
      selectedBody.style.maxHeight =
        `${selectedBody.scrollHeight}px`;
    }


    if (selectedButton) {
      selectedButton.setAttribute(
        'aria-expanded',
        'true'
      );
    }
  }
}


/*
  Make toggleExp available to inline HTML onclick handlers.
*/

window.toggleExp = toggleExp;


/* ======================================================
   ACCORDION ACCESSIBILITY
====================================================== */

const accordionTriggers =
  document.querySelectorAll('.exp-trigger');


accordionTriggers.forEach(trigger => {
  const button =
    trigger.querySelector('.exp-expand-btn');


  /*
    Makes the entire accordion row keyboard-focusable.
  */

  trigger.setAttribute('tabindex', '0');

  trigger.setAttribute(
    'role',
    'button'
  );

  trigger.setAttribute(
    'aria-expanded',
    'false'
  );


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


  /*
    Enter or Space opens the accordion.
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

        trigger.setAttribute(
          'aria-expanded',
          trigger
            .closest('.exp-item')
            ?.classList.contains('open')
            ? 'true'
            : 'false'
        );
      }
    }
  );
});


/* ======================================================
   KEEP ACCORDION HEIGHT CORRECT ON WINDOW RESIZE
====================================================== */

let resizeTimer;


window.addEventListener(
  'resize',
  () => {
    clearTimeout(resizeTimer);


    resizeTimer = setTimeout(() => {

      document
        .querySelectorAll('.exp-item.open')
        .forEach(item => {
          const body =
            item.querySelector('.exp-body');


          if (body) {
            body.style.maxHeight =
              `${body.scrollHeight}px`;
          }
        });


      updateScrollProgress();

    }, 120);
  }
);


/* ======================================================
   PAGE LOAD INITIALIZATION
====================================================== */

window.addEventListener('load', () => {

  /*
    Ensure the navigation starts in the correct state.
  */

  updateNav();


  /*
    Recalculate progress once fonts/content have loaded.
  */

  updateScrollProgress();

});
