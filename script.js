document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>{const target=document.querySelector(link.getAttribute('href'));if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}}));

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.dossier-grid, .services-heading, .service-card').forEach(el => {
    el.classList.add('reveal-ready'); observer.observe(el);
  });
}

const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(pointer: fine)');
const hero = document.querySelector('.hero');
hero.addEventListener('pointermove', event => {
  if (motionQuery.matches || !finePointer.matches) return;
  const box = hero.getBoundingClientRect();
  hero.style.setProperty('--move-x', ((event.clientX-box.left)/box.width-.5)*18+'px');
  hero.style.setProperty('--move-y', ((event.clientY-box.top)/box.height-.5)*14+'px');
});
hero.addEventListener('pointerleave', () => {
  hero.style.setProperty('--move-x','0px'); hero.style.setProperty('--move-y','0px');
});
const profile = document.querySelector('.dossier');
profile.addEventListener('pointermove', event => {
  if (motionQuery.matches || !finePointer.matches) return;
  const box = profile.getBoundingClientRect();
  profile.style.setProperty('--light-x', (event.clientX-box.left)/box.width*100+'%');
  profile.style.setProperty('--light-y', (event.clientY-box.top)/box.height*100+'%');
});

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const chapterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); chapterObserver.unobserve(entry.target); }
    });
  }, {threshold: .12});
  document.querySelectorAll('.chapter').forEach(chapter => {chapter.classList.add('is-revealing'); chapterObserver.observe(chapter);});
}
