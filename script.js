const menu=document.querySelector(".hamburger"),nav=document.querySelector(".nav nav");
menu?.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll(".nav nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
const play=document.querySelector("#play"); let playing=false;
play?.addEventListener("click",()=>{playing=!playing;play.textContent=playing?"Ⅱ":"▶"});
function join(e){e.preventDefault();document.querySelector("#message").textContent="YOU'RE IN. WELCOME TO THE MOVEMENT.";e.target.reset();}
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.style.opacity=1}),{threshold:.12});
document.querySelectorAll(".feature,.tiles,.wolf-section,.quote,.join").forEach(e=>{e.style.opacity=0;e.style.transition="opacity .8s ease";observer.observe(e)});
