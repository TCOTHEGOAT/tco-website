const menu=document.querySelector('.hamburger'),nav=document.querySelector('.nav nav');
menu?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const cards=[...document.querySelectorAll('.track-card')];
const nowTitle=document.querySelector('#now-title');
const nowArtist=document.querySelector('#now-artist');
let current=null;
function setCurrent(card){
  cards.forEach(c=>c.classList.remove('active'));
  card.classList.add('active');
  current=card;
  if(nowTitle) nowTitle.textContent=card.dataset.title.toUpperCase();
  if(nowArtist) nowArtist.textContent='TCO · 30-SECOND PREVIEW';
}
function resetOthers(except){
  cards.forEach(c=>{if(c!==except){const a=c.querySelector('audio'),b=c.querySelector('.track-play'),bar=c.querySelector('.progress span');a?.pause();if(a)a.currentTime=0;if(b)b.textContent='▶';if(bar)bar.style.width='0%';c.classList.remove('active')}});
}
cards.forEach(card=>{
  const audio=card.querySelector('audio'),btn=card.querySelector('.track-play'),bar=card.querySelector('.progress'),fill=card.querySelector('.progress span'),time=card.querySelector('time');
  btn.addEventListener('click',()=>{
    if(audio.paused){resetOthers(card);setCurrent(card);audio.play().then(()=>btn.textContent='Ⅱ').catch(()=>{});}else{audio.pause();btn.textContent='▶';}
  });
  audio.addEventListener('timeupdate',()=>{if(audio.duration){fill.style.width=(audio.currentTime/audio.duration*100)+'%';time.textContent=new Date(audio.currentTime*1000).toISOString().substring(14,19);}});
  audio.addEventListener('ended',()=>{btn.textContent='▶';fill.style.width='0%';card.classList.remove('active');});
  bar.addEventListener('click',e=>{if(!audio.duration)return;const r=bar.getBoundingClientRect();audio.currentTime=((e.clientX-r.left)/r.width)*audio.duration;setCurrent(card);if(audio.paused)audio.play().then(()=>btn.textContent='Ⅱ').catch(()=>{});});
});

function join(e){e.preventDefault();document.querySelector('#message').textContent="YOU'RE IN. WELCOME TO THE MOVEMENT.";e.target.reset();}
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.style.opacity=1}),{threshold:.12});
document.querySelectorAll('.music-room,.tiles,.wolf-section,.quote,.join').forEach(e=>{e.style.opacity=0;e.style.transition='opacity .8s ease';observer.observe(e)});
