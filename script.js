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

const chapters = [...document.querySelectorAll('.chapter')];
const chapterNav = document.querySelector('.journey-tabs');
const chapterControls = document.querySelector('.journey-controls');
let activeChapter = 0;
const chapterButtons = chapters.map((chapter, index) => {
  const button = document.createElement('button');
  button.type = 'button'; button.textContent = chapter.querySelector('h3').textContent;
  button.id = `chapter-tab-${index}`; button.setAttribute('role', 'tab');
  chapter.id = `chapter-${index}`; chapter.setAttribute('role', 'tabpanel');
  chapter.setAttribute('aria-labelledby', button.id);
  button.setAttribute('aria-controls', chapter.id);
  button.addEventListener('click', () => selectChapter(index));
  button.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % chapters.length;
    if (event.key === 'ArrowLeft') next = (index + chapters.length - 1) % chapters.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = chapters.length - 1;
    if (next !== undefined) {event.preventDefault(); selectChapter(next); chapterButtons[next].focus();}
  });
  chapterNav.append(button); return button;
});
function selectChapter(index) {
  activeChapter = index;
  chapters.forEach((chapter, i) => {chapter.hidden = i !== index; chapter.classList.toggle('is-active', i === index); chapterButtons[i].setAttribute('aria-selected', String(i === index)); chapterButtons[i].tabIndex = i === index ? 0 : -1;});
  document.querySelector('.journey-count').textContent = `0${index + 1} / 05`;
}
chapterNav.setAttribute('role', 'tablist'); chapterNav.hidden = false; chapterControls.hidden = false;
document.querySelector('.journey-next').addEventListener('click', () => selectChapter((activeChapter + 1) % chapters.length));
selectChapter(0);
