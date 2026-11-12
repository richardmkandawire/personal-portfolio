const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const year = document.getElementById('year');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (year) {
  year.textContent = new Date().getFullYear();
}

const footerText = document.querySelector('.site-footer .wrap p');
if (footerText && !prefersReducedMotion) {
  const fullText = footerText.textContent;
  const animatedText = document.createElement('span');
  const accessibleText = document.createElement('span');

  animatedText.className = 'footer-typing';
  animatedText.setAttribute('aria-hidden', 'true');
  accessibleText.className = 'visually-hidden';
  accessibleText.textContent = fullText;
  footerText.replaceChildren(animatedText, accessibleText);

  const typeFooter = () => {
    let characterIndex = 0;
    const typeNextCharacter = () => {
      characterIndex++;
      animatedText.textContent = fullText.slice(0, characterIndex);

      if (characterIndex < fullText.length) {
        window.setTimeout(typeNextCharacter, 35);
      } else {
        animatedText.classList.remove('footer-typing');
      }
    };

    typeNextCharacter();
  };

  const footerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        typeFooter();
      }
    });
  }, { threshold: 0.2 });

  footerObserver.observe(footerText);
}

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('open');
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const pointerBackground = document.body;
const supportsPointerBackground = window.matchMedia('(pointer: fine)').matches;

if (supportsPointerBackground && !prefersReducedMotion) {
  let pointerFrame = null;
  let pointerX = 0;
  let pointerY = 0;

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    pointerBackground.classList.add('pointer-active');

    if (pointerFrame === null) {
      pointerFrame = window.requestAnimationFrame(() => {
        pointerBackground.style.setProperty('--pointer-x', `${pointerX}px`);
        pointerBackground.style.setProperty('--pointer-y', `${pointerY}px`);
        pointerFrame = null;
      });
    }
  }, { passive: true });

  document.documentElement.addEventListener('pointerleave', () => {
    pointerBackground.classList.remove('pointer-active');
  });
}

const typedTextEl = document.querySelector('.typed-text');
if (typedTextEl) {
  const phrases = typedTextEl.dataset.typed.split(',');
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    const current = phrases[phraseIndex].trim();

    if (!deleting) {
      typedTextEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      typedTextEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const speed = deleting ? 50 : 90;
    setTimeout(typeLoop, speed);
  }

  typeLoop();
}

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach(item => revealObserver.observe(item));

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const reason = String(formData.get('reason') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const subject = `Portfolio contact: ${reason}`;
    const body = `Name: ${name}\nEmail: ${email}\nReason: ${reason}\n\n${message}`;
    const recipient = 'richardntchindimkandawire@gmail.com';
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const draftWindow = window.open(gmailUrl, '_blank');

    if (draftWindow) {
      draftWindow.opener = null;
    } else {
      window.location.href = mailtoUrl;
    }
  });
}

const tableWrap = document.querySelector('.table-wrap');

if (tableWrap && !prefersReducedMotion) {
  const table = tableWrap.querySelector('table');
  const rows = [
    ...Array.from(table.querySelectorAll('caption, thead tr, tbody tr'))
      .map(row => row.matches('caption')
        ? [row]
        : Array.from(row.querySelectorAll('th, td'))),
  ];

  rows.forEach(cells => {
    cells.forEach(cell => {
      const text = cell.textContent.trim();
      const content = document.createElement('span');
      content.className = 'typewriter-content';
      content.textContent = text;
      content.setAttribute('aria-hidden', 'true');
      cell.setAttribute('aria-label', text);
      cell.replaceChildren(content);
    });
  });

  const typeRow = (cells) => new Promise(resolve => {
    const contents = cells.map(cell => cell.querySelector('.typewriter-content'));
    const texts = contents.map(content => content.textContent);
    contents.forEach(content => {
      content.textContent = '';
    });

    let character = 0;
    const typeNextCharacter = () => {
      contents.forEach((content, index) => {
        content.textContent = texts[index].slice(0, character + 1);
      });
      character++;

      if (contents.every((content, index) => character >= texts[index].length)) {
        resolve();
        return;
      }

      setTimeout(typeNextCharacter, 32);
    };

    typeNextCharacter();
  });

  const tableObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        rows.reduce((sequence, row) => sequence.then(() => typeRow(row)), Promise.resolve());
      }
    });
  }, { threshold: 0.2 });

  tableObserver.observe(tableWrap);
}
