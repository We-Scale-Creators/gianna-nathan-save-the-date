(() => {
  const body = document.body;
  const trigger = document.getElementById('openEnvelope');
  const invitation = document.getElementById('invitation');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let opened = false;

  const open = () => {
    if (opened) return;
    opened = true;
    body.classList.add('is-open');

    window.setTimeout(() => {
      body.classList.remove('is-locked');
    }, reduceMotion ? 20 : 1950);

    window.setTimeout(() => {
      invitation.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }, reduceMotion ? 30 : 2520);
  };

  trigger.addEventListener('click', open);
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();
