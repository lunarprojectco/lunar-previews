(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const form = document.querySelector('form');

  // Essential interactions are independent of the optional motion APIs.
  if (form) {
    form.querySelector('fieldset').disabled = false;
    form.addEventListener('submit', event => event.preventDefault());
    form.querySelector('button').addEventListener('click', () => {
      if (!form.reportValidity()) return;
      const status = document.querySelector('#form-status');
      status.textContent = 'Preview complete. Nothing was sent or saved. Contact the business directly for a real enquiry.';
      status.focus();
    });
    const service = form.querySelector('#service');
    document.querySelectorAll('[data-service]').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', () => {
        service.value = button.dataset.service;
        service.focus({preventScroll: true});
        // Centre the focused field, including on short phone viewports.
        service.scrollIntoView({block: 'center', behavior: reduce.matches ? 'instant' : 'smooth'});
      });
    });
  }

  const active = new Set();
  function animate(element, frames, options) {
    if (reduce.matches || typeof element.animate !== 'function') return;
    const animation = element.animate(frames, options);
    active.add(animation);
    animation.finished.catch(() => {}).finally(() => active.delete(animation));
  }
  reduce.addEventListener('change', () => {
    if (reduce.matches) {
      for (const animation of active) animation.cancel();
      active.clear();
    }
  });
  document.querySelectorAll('.hero-copy>*').forEach((element, index) => animate(element,
    [{opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'translateY(0)'}],
    {duration: 500, delay: index * 65, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards'}));
  const hero = document.querySelector('.hero-media img');
  if (hero) animate(hero, [{transform: 'scale(1.045)'}, {transform: 'scale(1)'}],
    {duration: 1000, easing: 'cubic-bezier(.16,1,.3,1)'});
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        animate(entry.target, [{opacity: .3, transform: 'translateY(16px)'}, {opacity: 1, transform: 'translateY(0)'}],
          {duration: 450, easing: 'cubic-bezier(.16,1,.3,1)'});
        observer.unobserve(entry.target);
      }
    }, {threshold: .12});
    document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
  }
})();
