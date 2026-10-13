// Content is visible without JavaScript. Motion is finite and never blocks input.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let observer;
function reveal() {
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => {
    if (!isIntersecting) return;
    target.animate([{opacity:.2,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{duration:520,easing:'cubic-bezier(.2,.65,.25,1)'});
    observer.unobserve(target);
  }),{threshold:.12});
  document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
  const hero = document.querySelector('.hero-media img');
  if(hero) hero.animate([{transform:'scale(1.045)'},{transform:'scale(1)'}],{duration:1200,easing:'cubic-bezier(.2,.65,.25,1)'});
}
reveal();
reduced.addEventListener('change',()=>{if(reduced.matches){observer?.disconnect();document.getAnimations().forEach(a=>a.cancel());}});
document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{
  const select=document.querySelector('#service');
  if(select){select.value=link.dataset.service;select.dispatchEvent(new Event('change'));}
}));
const form=document.querySelector('form');
if(form){
  const button=form.querySelector('button');button.disabled=false;
  // A type=button and a submit listener prevent network submission, including Enter.
  function preview(event){
    event.preventDefault();
    if(!form.reportValidity())return;
    const result=document.querySelector('#form-status');
    result.textContent='Preview complete. Nothing was sent or saved. Use the published contact links to reach the business.';
    result.focus();
  }
  button.addEventListener('click',preview);form.addEventListener('submit',preview);
}
