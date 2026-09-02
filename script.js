const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function makeParticles(){
  const box=$("#particles");
  if(!box) return;
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile=window.matchMedia("(max-width: 700px)").matches;
  const count=reduce ? 0 : (mobile ? 18 : 30);
  const frag=document.createDocumentFragment();
  for(let i=0;i<count;i++){
    const o=document.createElement("i"); o.className="orb";
    const size=Math.random()*4+2;
    o.style.width=o.style.height=size+"px";
    o.style.left=Math.random()*100+"%";
    o.style.animationDuration=(Math.random()*18+12)+"s";
    o.style.animationDelay=(-Math.random()*25)+"s";
    o.style.opacity=(Math.random()*.45+.12);
    frag.appendChild(o);
  }
  box.appendChild(frag);
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
    const target=$("#"+btn.dataset.tab);
    if(target) target.classList.add("active");
  });
});

function openModal(id){ $("#"+id)?.classList.add("show"); document.body.style.overflow="hidden"; }
function closeModals(){ $$(".modal").forEach(m=>m.classList.remove("show")); document.body.style.overflow=""; }
$$("[data-open]").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.open)));
$$("[data-close]").forEach(b=>b.addEventListener("click",closeModals));
$$(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModals()}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModals()});


// Sistem arama: tüm başlıkları filtreler, içerikleri değiştirmez.
const systemSearch = $("#systemSearch");
const systemRules = $$(".systemRule");
const systemCount = $("#systemCount");
const systemNoResults = $("#systemNoResults");

function filterSystems(){
  const q = (systemSearch?.value || "").trim().toLocaleLowerCase("tr-TR");
  let visible = 0;
  systemRules.forEach(card=>{
    const text = card.textContent.toLocaleLowerCase("tr-TR");
    const hit = !q || text.includes(q);
    card.classList.toggle("isHidden", !hit);
    card.classList.toggle("searchHit", !!q && hit);
    if(hit) visible++;
  });
  if(systemCount) systemCount.textContent = q ? `${visible} eşleşme` : `${systemRules.length} sistem`;
  if(systemNoResults) systemNoResults.style.display = visible ? "none" : "block";
}
systemSearch?.addEventListener("input", filterSystems);

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
  const tournamentEl = $("#contributionTournament");
  const goalsEl = $("#contributionGoals");
  const gymEl = $("#contributionGym");
  const assistsEl = $("#contributionAssists");
  const cupsEl = $("#contributionCups");
  if(!tournamentEl || !goalsEl || !gymEl || !assistsEl || !cupsEl) return;
  const tournament = tournamentEl.value;
  const rates = contributionRates[tournament];
  if(!rates) return;
  const goals = Math.max(0, Number(goalsEl.value) || 0);
  const gym = Math.max(0, Number(gymEl.value) || 0);
  const assists = Math.max(0, Number(assistsEl.value) || 0);
  const cups = Math.max(0, Number(cupsEl.value) || 0);

  const base = 1000000;
  const goalValue = goals * rates.goal;
  const gymValue = gym * rates.goal;
  const assistValue = assists * rates.assist;
  const cupValue = cups * rates.cup;
  const total = base + goalValue + gymValue + assistValue + cupValue;

  $("#contributionBase") && ($("#contributionBase").textContent = euro(base));
  $("#contributionGoalValue") && ($("#contributionGoalValue").textContent = "+" + euro(goalValue));
  $("#contributionGymValue") && ($("#contributionGymValue").textContent = "+" + euro(gymValue));
  $("#contributionAssistValue") && ($("#contributionAssistValue").textContent = "+" + euro(assistValue));
  $("#contributionCupValue") && ($("#contributionCupValue").textContent = "+" + euro(cupValue));
  $("#contributionTotal") && ($("#contributionTotal").textContent = euro(total));
}

$("#calculateContribution")?.addEventListener("click", calculateContribution);
["contributionTournament","contributionGoals","contributionGym","contributionAssists","contributionCups"].forEach(id=>{
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

// Hataları sessizce yutma: üretimde bile geliştirici konsolunda görünür kalsın.
window.addEventListener("error",e=>console.error("[MortaLeague]",e.error||e.message));
window.addEventListener("unhandledrejection",e=>console.error("[MortaLeague async]",e.reason));


/* MortaLeague account system
   Backend: Supabase Auth. Username-only UI is mapped to a private synthetic email.
   Before publishing, replace the two placeholders below with your Supabase project values
   and run SUPABASE_SETUP.sql in the Supabase SQL editor.
*/
const MORTA_SUPABASE_URL = "https://hgogpczncecmnhbghogs.supabase.co";
const MORTA_SUPABASE_ANON_KEY = "sb_publishable_SDen1VfLk6M3V5V62lH9xw__p-ulv5O";

let mortaSupabase = null;
if (window.supabase && !MORTA_SUPABASE_URL.startsWith("YOUR_")) {
  mortaSupabase = window.supabase.createClient(MORTA_SUPABASE_URL, MORTA_SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });
  // Lig modülü ayrı bir dosyada çalıştığı için Supabase istemcisini açıkça paylaş.
  window.mortaSupabase = mortaSupabase;
  window.dispatchEvent(new Event("morta:supabase-ready"));
}
// V5 modülleri ayrı dosyalarda çalıştığı için istemciyi açıkça paylaş.
window.mortaSupabase = mortaSupabase;

const accountModal = $("#accountsModal");
const contactModal = $("#contactModal");
const loginForm = $("#loginForm");
const registerForm = $("#registerForm");
const accountMessage = $("#accountMessage");
const userPanel = $("#userPanel");
const accountActions = $("#accountActions");
const userMenu = $("#userMenu");

function showAccountMessage(text, error=false){
  if(!accountMessage) return;
  accountMessage.textContent=text;
  accountMessage.style.color=error ? "#f0a0b0" : "#bda7ce";
}
function accountOpen(mode="login"){
  accountModal?.classList.add("open");
  accountModal?.setAttribute("aria-hidden","false");
  loginForm.hidden = mode!=="login";
  registerForm.hidden = mode!=="register";
  $("#loginTab")?.classList.toggle("active", mode==="login");
  $("#registerTab")?.classList.toggle("active", mode==="register");
  showAccountMessage("");
}
function accountClose(){
  accountModal?.classList.remove("open");
  accountModal?.setAttribute("aria-hidden","true");
}
function syntheticEmail(username){
  return username.trim().toLowerCase().replace(/[^a-z0-9._-]/g,"") + "@accounts.mortaleague.local";
}
function normalizeUsername(v){ return v.trim().toLowerCase(); }

async function registerMorta(){
  if(!mortaSupabase){ showAccountMessage("Hesap sistemi henüz bağlantı bilgileriyle etkinleştirilmedi.", true); return; }
  const username=normalizeUsername($("#registerUsername").value);
  const p1=$("#registerPassword").value;
  const p2=$("#registerPassword2").value;
  if(!/^[a-z0-9_]{3,24}$/.test(username)){ showAccountMessage("Kullanıcı adı 3-24 karakter olmalı; sadece a-z, 0-9 ve _ kullan.", true); return; }
  if(p1.length<8){ showAccountMessage("Şifre en az 8 karakter olmalı.", true); return; }
  if(p1!==p2){ showAccountMessage("Şifreler eşleşmiyor.", true); return; }
  const accountType = $("#registerRole")?.value === "team" ? "team" : "player";
  const {data,error}=await mortaSupabase.auth.signUp({email:syntheticEmail(username),password:p1});
  if(error){ showAccountMessage(error.message, true); return; }
  if(data.user) {
    const {error: profileError}=await mortaSupabase.from("profiles").upsert({id:data.user.id,username,account_type:accountType},{onConflict:"id"});
    if(profileError && !data.session){
      console.warn("Profil kaydı e-posta doğrulaması tamamlanınca oluşturulmalı:", profileError.message);
    }else if(profileError){ showAccountMessage(`Hesap oluşturuldu fakat profil kaydı oluşturulamadı: ${profileError.message}`, true); return; }
  }
  showAccountMessage(data.session ? "Hesabın oluşturuldu. Giriş yapabilirsin." : "Hesabın oluşturuldu. E-posta doğrulaması gerekiyorsa önce onu tamamla.");
  setTimeout(()=>accountOpen("login"),700);
}

async function loginMorta(){
  if(!mortaSupabase){ showAccountMessage("Hesap sistemi henüz bağlantı bilgileriyle etkinleştirilmedi.", true); return; }
  const username=normalizeUsername($("#loginUsername").value);
  const password=$("#loginPassword").value;
  if(!username || !password){ showAccountMessage("Kullanıcı adı ve şifreyi doldur.", true); return; }
  const {error}=await mortaSupabase.auth.signInWithPassword({email:syntheticEmail(username),password});
  if(error){ showAccountMessage("Kullanıcı adı veya şifre hatalı.", true); return; }
  accountClose();
  await refreshMortaUser();
}

async function refreshMortaUser(){
  if(!mortaSupabase) return;
  const {data:{session}}=await mortaSupabase.auth.getSession();
  if(session?.user){
    const {data:profile}=await mortaSupabase.from("profiles").select("username").eq("id",session.user.id).single();
    $("#currentUsername").textContent=profile?.username || session.user.email.split("@")[0];
    userPanel.hidden=false; accountActions.hidden=true;
  }else{
    userPanel.hidden=true; accountActions.hidden=false;
  }
}

$("#openLogin")?.addEventListener("click",()=>accountOpen("login"));
$("#openRegister")?.addEventListener("click",()=>accountOpen("register"));
$("#loginTab")?.addEventListener("click",()=>accountOpen("login"));
$("#registerTab")?.addEventListener("click",()=>accountOpen("register"));
$("#loginSubmit")?.addEventListener("click",loginMorta);
$("#registerSubmit")?.addEventListener("click",registerMorta);
document.querySelectorAll("[data-close-account]").forEach(el=>el.addEventListener("click",accountClose));
$("#userMenuButton")?.addEventListener("click",()=>userMenu?.classList.toggle("open"));
$("#logoutButton")?.addEventListener("click",async()=>{
  if(mortaSupabase) await mortaSupabase.auth.signOut();
  userMenu?.classList.remove("open"); await refreshMortaUser();
});

$("#contactAdmin")?.addEventListener("click",()=>{
  userMenu?.classList.remove("open");
  $("#contactModal")?.classList.add("open");
  $("#contactModal")?.setAttribute("aria-hidden","false");
});
document.querySelectorAll("[data-close-contact]").forEach(el=>el.addEventListener("click",()=>{
  $("#contactModal")?.classList.remove("open");
  $("#contactModal")?.setAttribute("aria-hidden","true");
}));
$("#contactSubmit")?.addEventListener("click",async()=>{
  const status=$("#contactStatus");
  if(!mortaSupabase){ status.textContent="Hesap sistemi henüz etkinleştirilmedi."; return; }
  const {data:{user}}=await mortaSupabase.auth.getUser();
  if(!user){ status.textContent="Önce giriş yapmalısın."; return; }
  const message=$("#contactMessage").value.trim();
  if(message.length<5){ status.textContent="Mesajını biraz daha açık yaz."; return; }
  const {error}=await mortaSupabase.from("support_messages").insert({
    user_id:user.id,
    type:$("#contactType").value,
    message
  });
  status.textContent=error ? "Mesaj gönderilemedi." : "Mesajın admin'e iletildi.";
  if(!error) $("#contactMessage").value="";
});

if(mortaSupabase){
  mortaSupabase.auth.onAuthStateChange(()=>refreshMortaUser());
  refreshMortaUser();
}