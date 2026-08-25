const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function makeParticles(){
  const box=$("#particles");
  for(let i=0;i<42;i++){
    const o=document.createElement("i"); o.className="orb";
    const size=Math.random()*4+2;
    o.style.width=o.style.height=size+"px";
    o.style.left=Math.random()*100+"%";
    o.style.animationDuration=(Math.random()*18+12)+"s";
    o.style.animationDelay=(-Math.random()*25)+"s";
    o.style.opacity=(Math.random()*.45+.12);
    box.appendChild(o);
  }
}
makeParticles();

// Sistemler: başlıklar kapalı başlar, tıklayınca açıklama açılır.
$$('.systemRule h3').forEach(title=>{
  title.classList.add('accordionTrigger');
  title.setAttribute('role','button');
  title.setAttribute('tabindex','0');
  const card=title.closest('.systemRule');
  const toggle=()=>card.classList.toggle('open');
  title.addEventListener('click',toggle);
  title.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}
  });
});

$$("[data-scroll]").forEach(b=>b.addEventListener("click",()=>{
  const el=$("#"+b.dataset.scroll); if(el) el.scrollIntoView({behavior:"smooth"});
}));

$$("[data-tab]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    $$("[data-tab]").forEach(x=>x.classList.remove("active"));
    $$(".contentPane").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
    $("#"+btn.dataset.tab).classList.add("active");
  });
});

function openModal(id){ $("#"+id)?.classList.add("show"); document.body.style.overflow="hidden"; }
function closeModals(){ $$(".modal").forEach(m=>m.classList.remove("show")); document.body.style.overflow=""; }
$$("[data-open]").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.open)));
$$("[data-close]").forEach(b=>b.addEventListener("click",closeModals));
$$(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModals()}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModals()});

function money(n){
  return new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY",maximumFractionDigits:0}).format(n);
}
function calculate(){
  const age=Math.max(16,Math.min(40,Number($("#age").value)||24));
  const base=Math.max(0,Number($("#base").value)||0);
  const train=Number($("#trainingLevel").value)||0;
  let ageFactor=1;
  if(age<22) ageFactor=1.18;
  else if(age<=25) ageFactor=1.10;
  else if(age<=28) ageFactor=1.00;
  else if(age<=32) ageFactor=.86;
  else ageFactor=.68;
  const value=base*ageFactor*(1+train);
  $("#result").textContent=money(value);
  const toast=$("#toast"); toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1600);
}
$("#calculate").addEventListener("click",calculate);
["age","base","trainingLevel"].forEach(id=>$("#"+id).addEventListener("change",calculate));

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.style.animation="fade .6s ease both"});
},{threshold:.12});
$$(".card,.panel,.cta,.sectionHead").forEach(x=>observer.observe(x));

window.addEventListener("scroll",()=>{
  const y=scrollY;
  $$(".navlinks button").forEach(b=>{
    const id=b.dataset.scroll, el=$("#"+id);
    if(el && y>=el.offsetTop-150 && y<el.offsetTop+el.offsetHeight-150){
      $$(".navlinks button").forEach(x=>x.classList.remove("active")); b.classList.add("active");
    }
  });
});
