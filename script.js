(() => {
  'use strict';

  const body = document.body;
  const trigger = document.getElementById('openEnvelope');
  const invitation = document.getElementById('invitation');
  const reveals = Array.from(document.querySelectorAll('.reveal'));

  const reduceMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* --- Scroll reveals -------------------------------------------------- */
  const showAll = () => reveals.forEach((el) => el.classList.add('is-visible'));

  if (!('IntersectionObserver' in window)) {
    showAll();
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

    reveals.forEach((el) => observer.observe(el));
  }

  /* --- The envelope ---------------------------------------------------- */
  if (!trigger || !invitation) {
    // Nothing to open — make sure the page is at least readable.
    body.classList.remove('is-locked');
    showAll();
    return;
  }

  let opened = false;

  const open = () => {
    if (opened) return;
    opened = true;

    body.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    trigger.disabled = true;

    const unlockAfter = reduceMotion ? 20 : 1250;
    const scrollAfter = reduceMotion ? 40 : 1650;

    window.setTimeout(() => body.classList.remove('is-locked'), unlockAfter);
    window.setTimeout(() => {
      invitation.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    }, scrollAfter);
  };

  trigger.setAttribute('aria-expanded', 'false');
  trigger.addEventListener('click', open);

  /* Safety net: if anything above throws or the click never lands, don't
     leave a guest stranded on a locked screen. */
  window.setTimeout(() => {
    if (!opened && body.classList.contains('is-locked')) {
      body.style.height = 'auto';
    }
  }, 15000);
})();
