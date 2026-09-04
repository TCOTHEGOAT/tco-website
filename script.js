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
