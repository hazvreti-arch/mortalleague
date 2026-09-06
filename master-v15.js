(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const fmtEUR = n => '€' + new Intl.NumberFormat('tr-TR', {maximumFractionDigits:0}).format(Number(n)||0);
  const esc = s => String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function insertAfter(node, html){ const t=document.createElement('template'); t.innerHTML=html.trim(); node.after(t.content.cloneNode(true)); }
  function toast(msg, type='info') { try { window.MortaUI?.toast(msg,type); return; } catch {} const el=document.createElement('div'); el.textContent=msg; el.style.cssText='position:fixed;right:16px;bottom:90px;z-index:99999;padding:11px 14px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:#17101f;color:#fff;font:700 12px Inter'; document.body.appendChild(el); setTimeout(()=>el.remove(),2400); }

  function buildHomeEnhancements(){
    const home = $('#home'); if(!home || $('#ml15-dashboard')) return;
    const html = `<div class="ml15-shell" id="ml15-dashboard" aria-label="MortaLeague kontrol merkezi">
      <div class="ml15-grid">
        <article class="ml15-card">
          <span class="ml15-kicker">MORTALEAGUE · DASHBOARD</span>
          <h3 class="ml15-title">OYUNUNU VERİYE DÖNÜŞTÜR.</h3>
          <p class="ml15-copy">Oyuncu değerini takip et, gelişimini gör ve MortaLeague'deki ilerlemeni tek merkezden yönet.</p>
          <div class="ml15-actions"><span class="ml15-chip">⚡ Hızlı işlemler</span><span class="ml15-chip">📊 Canlı istatistikler</span><span class="ml15-chip">🏆 Başarılar</span></div>
          <div class="ml15-statgrid" id="ml15-globalStats"><div class="ml15-stat"><span>OYUNCULAR</span><b>—</b></div><div class="ml15-stat"><span>EN YÜKSEK DEĞER</span><b>—</b></div><div class="ml15-stat"><span>ORTALAMA DEĞER</span><b>—</b></div><div class="ml15-stat"><span>SİSTEMLER</span><b>16</b></div></div>
          <div class="ml15-quick"><button data-scroll="players"><b>Oyuncuları incele</b><span>Arama ve filtrelerle oyuncu havuzuna geç.</span></button><button data-scroll="playerCalculator"><b>Katkı değerini hesapla</b><span>Performansını MortaLeague kurallarıyla hesapla.</span></button><button data-scroll="systems"><b>Sistemleri oku</b><span>Kuralları ve puanlama mantığını keşfet.</span></button></div>
        </article>
        <article class="ml15-card"><div class="ml15-sectionbar"><div><span class="ml15-kicker">ÖNE ÇIKANLAR</span><h3 style="margin:7px 0 0;font-size:18px">DEĞER ZİRVESİ</h3></div><span class="ml15-badge">CANLI</span></div><div class="ml15-list" id="ml15TopPlayers"><div class="ml15-note">Oyuncular yükleniyor...</div></div></article>
      </div>
      <div class="ml15-grid">
        <article class="ml15-card"><span class="ml15-kicker">KARİYER</span><h3 style="margin:7px 0 0;font-size:20px">GELİŞİM İZİN</h3><p class="ml15-copy" id="ml15CareerText">Giriş yaptığında kişisel ilerleme özetin burada görünecek.</p><div class="ml15-progress"><i id="ml15CareerProgress"></i></div><div class="ml15-pills"><span class="ml15-chip" id="ml15Tier">GİRİŞ YAPILMADI</span><span class="ml15-chip" id="ml15CareerValue">€—</span></div><div class="ml15-achievements" id="ml15Achievements"></div></article>
        <article class="ml15-card"><span class="ml15-kicker">SIRALAMALAR</span><h3 style="margin:7px 0 0;font-size:20px">OYUNCU LİDERLERİ</h3><div class="ml15-tabs"><button class="ml15-tab is-active" data-rank-mode="value">Değer</button><button class="ml15-tab" data-rank-mode="username">Alfabetik</button></div><div class="ml15-list" id="ml15Ranking"><div class="ml15-note">Veriler yükleniyor...</div></div><p class="ml15-note">Sıralama mevcut profil verilerine göre hazırlanır.</p></article>
      </div>
    </div>`;
    home.insertAdjacentHTML('beforeend', html);
  }

  function buildPlayersEnhancements(){
    const sec=$('#players'); if(!sec || $('#ml15-playerTools')) return;
    const dir=$('.playerDirectory',sec); if(!dir) return;
    dir.insertAdjacentHTML('afterbegin', `<div id="ml15-playerTools" class="ml15-card" style="margin-bottom:14px;padding:15px"><div class="ml15-sectionbar"><div><span class="ml15-kicker">OYUNCU ANALİTİĞİ</span><h3 style="margin:6px 0 0;font-size:18px">ARAMA & KEŞİF</h3></div><span class="ml15-chip" id="ml15FilteredCount">—</span></div><p class="ml15-note">İsim, mevki ve mevcut değer üzerinden hızlıca filtrele. Bir oyuncuya dokunduğunda detay profilini açabilirsin.</p></div>`);
  }

  function buildSystemsEnhancements(){
    const sec=$('#systems'); if(!sec || $('#ml15SystemGuide')) return;
    const head=$('.sectionHead',sec); if(!head) return;
    head.insertAdjacentHTML('afterend', `<div id="ml15SystemGuide" class="ml15-card" style="margin-bottom:14px"><span class="ml15-kicker">NASIL ÇALIŞIR?</span><h3 style="margin:7px 0 0;font-size:20px">MORTALLEAGUE SİSTEM HARİTASI</h3><p class="ml15-copy" style="margin-top:7px">Sistemler birbirinden bağımsız değil; oyuncu verisi → katkı hesaplama → değer → başarı/ilerleme zinciriyle birbirini tamamlar.</p><div class="ml15-actions"><span class="ml15-chip">01 · Veri</span><span class="ml15-chip">02 · Hesap</span><span class="ml15-chip">03 · Değer</span><span class="ml15-chip">04 · Başarı</span></div></div>`);
  }

  async function loadProfiles(){
    if(typeof mortaSupabase==='undefined' || !mortaSupabase) return [];
    try{
      const {data,error}=await mortaSupabase.from('profiles').select('id,username,avatar_url,position,team,player_value,account_type').order('player_value',{ascending:false,nullsLast:true}).limit(100);
      if(error) throw error; return (data||[]).filter(x=>(x.account_type||'player')==='player');
    }catch(e){ console.warn('[MortaLeague master]',e); return []; }
  }

  function renderRows(el, rows, mode='value'){
    if(!el) return;
    if(!rows.length){el.innerHTML='<div class="ml15-note">Henüz yeterli oyuncu verisi yok.</div>';return;}
    const sorted=[...rows]; if(mode==='username') sorted.sort((a,b)=>String(a.username||'').localeCompare(String(b.username||''),'tr')); else sorted.sort((a,b)=>(Number(b.player_value)||0)-(Number(a.player_value)||0));
    el.innerHTML=sorted.slice(0,6).map((p,i)=>`<button class="ml15-row" type="button" data-public-player="${esc(p.id)}" style="text-align:left"><span class="ml15-rank">${String(i+1).padStart(2,'0')}</span><span class="ml15-avatar">${p.avatar_url?`<img src="${esc(p.avatar_url)}" alt="">`:esc((p.username||'M').slice(0,1).toUpperCase())}</span><span class="ml15-rowmain"><b>${esc(p.username||'Oyuncu')}</b><small>${esc(p.position||'Mevki belirtilmemiş')}${p.team?' · '+esc(p.team):''}</small></span><span class="ml15-value">${fmtEUR(p.player_value)}</span></button>`).join('');
  }

  function fillAchievements(value){
    const el=$('#ml15Achievements'); if(!el) return;
    const v=Number(value)||0; const defs=[['⚽','YÜKSELEN','€5M',v>=5e6],['🔥','PRO','€10M',v>=1e7],['💎','ELITE','€25M',v>=25e6],['🏆','LEGEND','€50M',v>=5e7]];
    el.innerHTML=defs.map(d=>`<div class="ml15-achievement" style="opacity:${d[3]?1:.45}"><div class="ico">${d[0]}</div><b>${d[1]}</b><small>${d[3]?'Kazanıldı':'Hedef '+d[2]}</small></div>`).join('');
  }

  async function refreshMasterData(){
    const profiles=await loadProfiles();
    const values=profiles.map(p=>Number(p.player_value)||0).filter(v=>v>0);
    const avg=values.length?values.reduce((a,b)=>a+b,0)/values.length:0;
    const gs=$('#ml15-globalStats'); if(gs){ const bs=$$('b',gs); bs[0].textContent=String(profiles.length); bs[1].textContent=fmtEUR(Math.max(...values,0)); bs[2].textContent=fmtEUR(avg); }
    renderRows($('#ml15TopPlayers'),profiles,'value'); renderRows($('#ml15Ranking'),profiles,'value');
    const pc=$('#ml15FilteredCount'); if(pc) pc.textContent=profiles.length+' oyuncu';
    try{
      const {data:{user}}=await mortaSupabase.auth.getUser();
      const mine=user?profiles.find(p=>p.id===user.id):null;
      const val=Number(mine?.player_value)||0;
      const tier=val>=5e7?'LEGEND':val>=2.5e7?'ELITE':val>=1e7?'PRO':val>=5e6?'RISING':'DEVELOPING';
      $('#ml15Tier')?.replaceChildren(document.createTextNode(user?tier:'GİRİŞ YAPILMADI'));
      $('#ml15CareerValue')?.replaceChildren(document.createTextNode(user?fmtEUR(val):'€—'));
      const prog=Math.min(100,Math.max(2,(Math.log10(Math.max(val,1e6))-6)/1.7*100)); if($('#ml15CareerProgress')) $('#ml15CareerProgress').style.width=`${user?prog:0}%`;
      if($('#ml15CareerText')) $('#ml15CareerText').textContent=user?`${mine?.username||'Oyuncu'}, mevcut değerine göre ${tier} seviyesinde. Hedeflerini büyütmek için katkı değerini geliştirmeye devam et.`:'Giriş yaptığında kişisel ilerleme özetin burada görünecek.';
      fillAchievements(val);
    }catch{}
  }

  function bind(){
    $$('#ml15-dashboard [data-scroll]').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>window.MortaLeagueViews?.show(b.dataset.scroll),0)));
    document.addEventListener('click',e=>{const row=e.target.closest('[data-public-player]'); if(row && window.openPublicProfile){window.openPublicProfile(row.dataset.publicPlayer);}});
    document.addEventListener('click',e=>{const t=e.target.closest('[data-rank-mode]');if(!t)return;$$('[data-rank-mode]').forEach(x=>x.classList.remove('is-active'));t.classList.add('is-active');loadProfiles().then(rows=>renderRows($('#ml15Ranking'),rows,t.dataset.rankMode));});
    $('#playerSearch')?.addEventListener('input',()=>{const cards=$$('#playerList .directoryPlayer');const q=$('#playerSearch').value.trim().toLocaleLowerCase('tr-TR');let n=0;cards.forEach(c=>{const hit=!q||c.textContent.toLocaleLowerCase('tr-TR').includes(q);c.style.display=hit?'':'none';if(hit)n++;});const el=$('#ml15FilteredCount');if(el)el.textContent=n+' sonuç';});
    window.addEventListener('online',()=>toast('Bağlantı geri geldi.','success'));
    window.addEventListener('offline',()=>toast('Çevrimdışısın. Kaydetmeden önce bağlantıyı kontrol et.','error'));
  }

  buildHomeEnhancements(); buildPlayersEnhancements(); buildSystemsEnhancements(); bind();
  setTimeout(refreshMasterData,900);
  document.addEventListener('morta-profile-saved',()=>setTimeout(refreshMasterData,300));
  document.addEventListener('morta-auth-ready',()=>setTimeout(refreshMasterData,300));
})();
