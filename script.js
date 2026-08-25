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

const contributionRates = {
  mla: {goal: 30000, assist: 20000, cup: 2000000},
  mlb: {goal: 20000, assist: 10000, cup: 1000000},
  zmk: {goal: 20000, assist: 10000, cup: 1500000},
  facup: {goal: 15000, assist: 10000, cup: 1000000},
  goat: {goal: 10000, assist: 5000, cup: 500000},
  supercup: {goal: 10000, assist: 5000, cup: 250000},
  ucl: {goal: 60000, assist: 50000, cup: 4500000},
  uel: {goal: 50000, assist: 40000, cup: 3500000},
  uecl: {goal: 40000, assist: 30000, cup: 2500000},
  uefa_super: {goal: 50000, assist: 40000, cup: 3000000},
  worldcup: {goal: 70000, assist: 60000, cup: 5000000},
  euro: {goal: 60000, assist: 50000, cup: 4000000},
  nations: {goal: 40000, assist: 30000, cup: 2500000}
};

function euro(n){
  return "€" + new Intl.NumberFormat("tr-TR",{maximumFractionDigits:0}).format(n);
}

function calculateContribution(){
  const tournament = $("#contributionTournament").value;
  const rates = contributionRates[tournament];
  const goals = Math.max(0, Number($("#contributionGoals").value) || 0);
  const assists = Math.max(0, Number($("#contributionAssists").value) || 0);
  const cups = Math.max(0, Number($("#contributionCups").value) || 0);

  const base = 1000000;
  const goalValue = goals * rates.goal;
  const assistValue = assists * rates.assist;
  const cupValue = cups * rates.cup;
  const total = base + goalValue + assistValue + cupValue;

  $("#contributionBase").textContent = euro(base);
  $("#contributionGoalValue").textContent = "+" + euro(goalValue);
  $("#contributionAssistValue").textContent = "+" + euro(assistValue);
  $("#contributionCupValue").textContent = "+" + euro(cupValue);
  $("#contributionTotal").textContent = euro(total);
}

$("#calculateContribution")?.addEventListener("click", calculateContribution);
["contributionTournament","contributionGoals","contributionAssists","contributionCups"].forEach(id=>{
  $("#"+id)?.addEventListener("input", calculateContribution);
  $("#"+id)?.addEventListener("change", calculateContribution);
});
calculateContribution();

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
