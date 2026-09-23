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
const tabIndicator = document.createElement('span');
tabIndicator.className = 'journey-tab-indicator'; tabIndicator.setAttribute('aria-hidden', 'true');
chapterNav.append(tabIndicator);
function positionChapterIndicator() {
 const button = chapterButtons[activeChapter];
 chapterNav.style.setProperty('--tab-left', button.offsetLeft + 'px');
 chapterNav.style.setProperty('--tab-width', button.offsetWidth + 'px');
}

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
  requestAnimationFrame(positionChapterIndicator);
  chapters.forEach((chapter, i) => {chapter.hidden = i !== index; chapter.classList.toggle('is-active', i === index); chapterButtons[i].setAttribute('aria-selected', String(i === index)); chapterButtons[i].tabIndex = i === index ? 0 : -1;});
  document.querySelector('.journey-count').textContent = `0${index + 1} / 05`;
}
chapterNav.setAttribute('role', 'tablist'); chapterNav.hidden = false; chapterControls.hidden = false;
document.querySelector('.journey-next').addEventListener('click', () => selectChapter((activeChapter + 1) % chapters.length));
selectChapter(0);

window.addEventListener('resize', positionChapterIndicator);
if (document.fonts) document.fonts.ready.then(positionChapterIndicator);

// A lightweight pointer follower; native cursor remains on touch and reduced motion.
const cursorMedia = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
const designCursor = document.createElement('div');
designCursor.className = 'design-cursor'; designCursor.setAttribute('aria-hidden','true');
designCursor.innerHTML = '<span class="cursor-frame"></span>'; document.body.append(designCursor);
let cursorX=0,cursorY=0,targetX=0,targetY=0,cursorFrame=0,cursorVisible=false;
function animateCursor(){cursorX+=(targetX-cursorX)*.3;cursorY+=(targetY-cursorY)*.3;designCursor.style.transform=`translate3d(${cursorX-18}px,${cursorY-18}px,0)`;if(Math.abs(targetX-cursorX)+Math.abs(targetY-cursorY)>.15){cursorFrame=requestAnimationFrame(animateCursor);}else{cursorFrame=0;}}
function hideCursor(){cursorVisible=false;designCursor.classList.remove('is-on','is-down');document.documentElement.classList.remove('has-design-cursor');cancelAnimationFrame(cursorFrame);cursorFrame=0;}
document.addEventListener('pointermove',event=>{if(!cursorMedia.matches||event.pointerType==='touch')return;const editable=event.target.closest('input,textarea,[contenteditable="true"]');if(editable){hideCursor();return;}targetX=event.clientX;targetY=event.clientY;if(!cursorVisible){cursorX=targetX;cursorY=targetY;cursorVisible=true;}document.documentElement.classList.add('has-design-cursor');designCursor.classList.add('is-on');designCursor.classList.toggle('is-link',!!event.target.closest('a,button,[role="tab"]'));if(!cursorFrame)cursorFrame=requestAnimationFrame(animateCursor);},{passive:true});
document.addEventListener('pointerdown',()=>designCursor.classList.add('is-down'));
document.addEventListener('pointerup',()=>designCursor.classList.remove('is-down'));
document.documentElement.addEventListener('pointerleave',hideCursor);window.addEventListener('blur',hideCursor);cursorMedia.addEventListener('change',hideCursor);

if ('IntersectionObserver' in window && !motionQuery.matches) {
  const projectObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) {entry.target.classList.add('project-visible');projectObserver.unobserve(entry.target);} });
  }, {threshold:.08});
  document.querySelectorAll('.project-card').forEach(card => {card.classList.add('project-reveal');projectObserver.observe(card);});
}

// Animate both directions while retaining native details semantics without JS.
const faqItems = [...document.querySelectorAll('.faq-item')];
const faqAnimations = new WeakMap();
function setFaq(item, expanded) {
  const from = item.getBoundingClientRect().height;
  faqAnimations.get(item)?.cancel();
  const summary = item.querySelector('summary');
  item.dataset.expanded = String(expanded);
  item.open = true;
  const to = expanded ? summary.getBoundingClientRect().height + item.querySelector('.faq-answer').getBoundingClientRect().height + 1 : summary.getBoundingClientRect().height + 1;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { item.open = expanded; return; }
  item.style.overflow = 'hidden';
  const animation = item.animate([{height:from+'px'},{height:to+'px'}], {duration:360,easing:'cubic-bezier(.22,.8,.25,1)'});
  faqAnimations.set(item, animation);
  animation.onfinish = () => {item.open = expanded; item.style.overflow = ''; faqAnimations.delete(item);};
}
faqItems.forEach(item => {
  item.removeAttribute('name');
  item.dataset.expanded = String(item.open);
  item.querySelector('summary').addEventListener('click', event => {
    event.preventDefault();
    const expanded = item.dataset.expanded !== 'true';
    if (expanded) faqItems.filter(other => other !== item && other.dataset.expanded === 'true').forEach(other => setFaq(other, false));
    setFaq(item, expanded);
  });
});

// Hover opens the full FAQ item; touch and keyboard retain click controls.
const faqHover = matchMedia('(hover: hover) and (pointer: fine)');
faqItems.forEach(item => {
  item.addEventListener('pointerenter', event => {
    if (!faqHover.matches || event.pointerType === 'touch') return;
    faqItems.filter(other => other !== item && other.dataset.expanded === 'true').forEach(other => setFaq(other, false));
    if (item.dataset.expanded !== 'true') setFaq(item, true);
  });
  item.addEventListener('pointerleave', event => {
    if (!faqHover.matches || event.pointerType === 'touch') return;
    if (item.dataset.expanded === 'true') setFaq(item, false);
  });
});

// Pause the atmosphere when the page is not visible.
document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('page-hidden',document.hidden));
