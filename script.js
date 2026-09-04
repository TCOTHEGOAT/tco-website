const menu=document.querySelector('.hamburger'),nav=document.querySelector('.nav nav');
menu?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const cards=[...document.querySelectorAll('.track-card')];
const nowTitle=document.querySelector('#now-title');
const nowArtist=document.querySelector('#now-artist');
const nowPanel=document.querySelector('.music-now');
const featuredTitle=document.querySelector('#featured-title');
const featuredMood=document.querySelector('#featured-mood');
const featuredLyric=document.querySelector('#featured-lyric');
const featuredPlay=document.querySelector('#featured-play');
let current=null;

function formatTime(sec){if(!Number.isFinite(sec)) return '0:30'; const m=Math.floor(sec/60); const s=Math.floor(sec%60).toString().padStart(2,'0'); return `${m}:${s}`;}
function updateFeatured(card){
  if(featuredTitle) featuredTitle.textContent=card.dataset.title.toUpperCase();
  if(featuredMood) featuredMood.textContent=card.dataset.mood||'';
  if(featuredLyric) featuredLyric.textContent=card.dataset.lyric||'';
}
function setCurrent(card){
  cards.forEach(c=>c.classList.remove('active'));
  card.classList.add('active'); current=card; updateFeatured(card);
  if(nowTitle) nowTitle.textContent=card.dataset.title.toUpperCase();
  if(nowArtist) nowArtist.textContent='TCO · 30-SECOND PREVIEW';
}
function resetOthers(except){
  cards.forEach(c=>{if(c!==except){const a=c.querySelector('audio'),b=c.querySelector('.track-play'),fill=c.querySelector('.progress span'),time=c.querySelector('time'); a?.pause(); if(a)a.currentTime=0; if(b)b.textContent='▶'; if(fill)fill.style.width='0%'; if(time)time.textContent='0:30'; c.classList.remove('active');}});
}
function playCard(card){
  const audio=card.querySelector('audio'),btn=card.querySelector('.track-play');
  resetOthers(card); setCurrent(card);
  audio.play().then(()=>{btn.textContent='Ⅱ'; nowPanel?.classList.add('playing');}).catch(()=>{});
}
cards.forEach(card=>{
  const audio=card.querySelector('audio'),btn=card.querySelector('.track-play'),bar=card.querySelector('.progress'),fill=card.querySelector('.progress span'),time=card.querySelector('time');
  btn.addEventListener('click',()=>{ if(audio.paused) playCard(card); else {audio.pause();btn.textContent='▶'; nowPanel?.classList.remove('playing');} });
  audio.addEventListener('loadedmetadata',()=>{if(time && audio.duration)time.textContent=formatTime(audio.duration);});
  audio.addEventListener('timeupdate',()=>{if(audio.duration){fill.style.width=(audio.currentTime/audio.duration*100)+'%';time.textContent=formatTime(audio.currentTime);}});
  audio.addEventListener('ended',()=>{btn.textContent='▶';fill.style.width='0%';time.textContent='0:30';card.classList.remove('active');nowPanel?.classList.remove('playing');});
  bar.addEventListener('click',e=>{if(!audio.duration)return;const r=bar.getBoundingClientRect();audio.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*audio.duration;setCurrent(card);if(audio.paused)playCard(card);});
  card.addEventListener('dblclick',()=>playCard(card));
});

featuredPlay?.addEventListener('click',()=>{const card=current||cards[0];const audio=card.querySelector('audio');if(audio.paused)playCard(card);else{audio.pause();card.querySelector('.track-play').textContent='▶';nowPanel?.classList.remove('playing');}});

function join(e){e.preventDefault();document.querySelector('#message').textContent="YOU'RE IN. WELCOME TO THE MOVEMENT.";e.target.reset();}
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.style.opacity=1}),{threshold:.12});
document.querySelectorAll('.music-room,.tiles,.wolf-section,.quote,.join').forEach(e=>{e.style.opacity=0;e.style.transition='opacity .8s ease';observer.observe(e)});


function joinDen(e){e.preventDefault();const m=document.querySelector('#den-message');if(m)m.textContent="YOU'RE IN. WELCOME TO THE DEN.";e.target.reset();}

// Active section indicator
const sections=[...document.querySelectorAll('main section[id]')];
const navLinks=[...document.querySelectorAll('.nav nav a')];
const sectionObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}})},{rootMargin:'-35% 0px -55% 0px',threshold:0});
sections.forEach(s=>sectionObserver.observe(s));


// V11 cinematic intro
document.body.classList.add('intro-lock');
const intro=document.querySelector('#site-intro');
const introEnter=document.querySelector('#intro-enter');
function leaveIntro(){ intro?.classList.add('hide'); document.body.classList.remove('intro-lock'); try{sessionStorage.setItem('tcoIntroSeen','1')}catch(e){} }
if((()=>{try{return sessionStorage.getItem('tcoIntroSeen')==='1'}catch(e){return false}})()){ intro?.classList.add('hide'); document.body.classList.remove('intro-lock'); }
introEnter?.addEventListener('click',leaveIntro);
intro?.addEventListener('click',e=>{if(e.target===intro)leaveIntro()});

// V11 video lightbox
const modal=document.querySelector('#video-modal'), modalFrame=document.querySelector('#video-modal-iframe'), modalTitle=document.querySelector('#video-modal-title'), modalClose=document.querySelector('#video-close');
function openVideo(id,title){if(!modal)return; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); modalTitle.textContent=title||'TCO'; modalFrame.src=`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`; document.body.classList.add('intro-lock');}
function closeVideo(){if(!modal)return; modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); modalFrame.src=''; document.body.classList.remove('intro-lock');}
document.querySelectorAll('.video-open').forEach(b=>b.addEventListener('click',()=>openVideo(b.dataset.video,b.dataset.title)));
modalClose?.addEventListener('click',closeVideo);
modal?.querySelector('[data-close-video]')?.addEventListener('click',closeVideo);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeVideo()});

// V11 back-to-top
const backTop=document.querySelector('#back-top');
window.addEventListener('scroll',()=>backTop?.classList.toggle('show',window.scrollY>700),{passive:true});
backTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));


// V12 immersive layer
const canvas=document.querySelector('#ambient-canvas');
const ctx=canvas?.getContext('2d');
const orb=document.querySelector('#cursor-orb');
const progress=document.querySelector('#scroll-progress span');
const ambientToggle=document.querySelector('#ambient-toggle');
const chapterDots=[...document.querySelectorAll('.chapter-dot')];
const immersiveSections=[...document.querySelectorAll('.immersive-section')];
let ambientOn=true;
let particles=[];
function resizeAmbient(){if(!canvas||!ctx)return;canvas.width=window.innerWidth*devicePixelRatio;canvas.height=window.innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);particles=Array.from({length:window.innerWidth<700?18:34},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.3+.25,a:Math.random()*.45+.08,s:Math.random()*.18+.04,p:Math.random()*Math.PI*2}));}
function drawAmbient(){if(!ctx)return;ctx.clearRect(0,0,innerWidth,innerHeight);if(!ambientOn){requestAnimationFrame(drawAmbient);return}for(const p of particles){p.y-=p.s;p.p+=.008;if(p.y<-5)p.y=innerHeight+5;const alpha=p.a*(.72+.28*Math.sin(p.p));ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(155,220,255,${alpha})`;ctx.fill()}requestAnimationFrame(drawAmbient)}
resizeAmbient();drawAmbient();window.addEventListener('resize',resizeAmbient);
window.addEventListener('pointermove',e=>{if(orb){orb.style.left=e.clientX+'px';orb.style.top=e.clientY+'px'}const x=(e.clientX/innerWidth-.5)*2,y=(e.clientY/innerHeight-.5)*2;document.documentElement.style.setProperty('--mx',(e.clientX/innerWidth*100)+'%');document.documentElement.style.setProperty('--my',(e.clientY/innerHeight*100)+'%');document.querySelectorAll('[data-depth]').forEach(el=>{const d=parseFloat(el.dataset.depth||0);el.style.transform=`translate3d(${x*d*18}px,${y*d*10}px,0)`})});
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;const pct=max>0?window.scrollY/max*100:0;if(progress)progress.style.width=pct+'%';});
ambientToggle?.addEventListener('click',()=>{ambientOn=!ambientOn;document.body.classList.toggle('ambient-off',!ambientOn);if(ambientToggle.querySelector('b'))ambientToggle.querySelector('b').textContent=ambientOn?'ON':'OFF';});
chapterDots.forEach(dot=>dot.addEventListener('click',()=>document.getElementById(dot.dataset.target)?.scrollIntoView({behavior:'smooth',block:'start'})));
const revealTargets=[...document.querySelectorAll('.about-header,.about-story,.about-side,.music-room .featured-listen,.music-room .track-card,.visuals-intro,.video-card,.philosophy-top,.philosophy-grid article,.vault-heading,.vault-grid article,.quote blockquote,.word-cards article,.join-brand,.join-logo,.join>div:last-child,.den-inner')];
revealTargets.forEach((el,i)=>{el.classList.add('reveal');if(i%4)el.classList.add('delay-'+(i%4));});
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('revealed')}),{threshold:.12,rootMargin:'0px 0px -7% 0px'});revealTargets.forEach(e=>revealObserver.observe(e));
const chapterObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){chapterDots.forEach(d=>d.classList.toggle('active',d.dataset.target===e.target.id))}}),{rootMargin:'-42% 0px -48% 0px',threshold:0});immersiveSections.forEach(s=>chapterObserver.observe(s));
// Gentle section light follows pointer without altering layout
window.addEventListener('pointermove',e=>{immersiveSections.forEach(s=>{const r=s.getBoundingClientRect();if(e.clientY>=r.top&&e.clientY<=r.bottom){s.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');s.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')}})});
