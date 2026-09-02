(() => {
  const sb = () => window.mortaSupabase || null;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const state = { profile:null, seasons:[], leagues:[], teams:[], matches:[] };
  const toast = msg => { if (window.showToast) window.showToast(msg); else alert(msg); };

  function esc(v){ return String(v ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  async function currentProfile(){
    const client=sb(); if(!client) return null;
    const {data:{user}}=await client.auth.getUser(); if(!user) return null;
    const {data,error}=await client.from('profiles').select('id,username,is_admin,account_type').eq('id',user.id).single();
    if(error) return null; return data;
  }
  function adminOpen(){ $('#leagueAdminModal')?.classList.add('open'); $('#leagueAdminModal')?.setAttribute('aria-hidden','false'); }
  function adminClose(){ $('#leagueAdminModal')?.classList.remove('open'); $('#leagueAdminModal')?.setAttribute('aria-hidden','true'); }

  async function loadAll(){
    const client=sb();
    const loadingName=$('#activeSeasonName');
    const loadingMeta=$('#activeSeasonMeta');
    if(!client){
      if(loadingName) loadingName.textContent='Bağlantı hazırlanıyor...';
      if(loadingMeta) loadingMeta.textContent='Hesap ve lig sistemi başlatılamadı.';
      console.error('[MortaLeague V5] Supabase istemcisi bulunamadı.');
      return;
    }
    if(loadingName) loadingName.textContent='Sezon yükleniyor...';
    if(loadingMeta) loadingMeta.textContent='Lig verileri hazırlanıyor.';
    const [s,l,t,m]=await Promise.all([
      client.from('seasons').select('*').order('created_at',{ascending:false}),
      client.from('leagues').select('*').order('name'),
      client.from('league_teams').select('*').order('name'),
      client.from('matches').select('*').order('played_at',{ascending:false})
    ]);
    const firstError=s.error||l.error||t.error||m.error;
    if(firstError){
      console.error('[MortaLeague V5] Lig verisi yüklenemedi:',firstError);
      if(loadingName) loadingName.textContent='Lig verileri yüklenemedi';
      if(loadingMeta) loadingMeta.textContent=firstError.message || 'Supabase tablolarını ve V5 SQL kurulumunu kontrol et.';
      return;
    }
    state.seasons=s.data||[];
    state.leagues=l.data||[];
    state.teams=t.data||[];
    state.matches=m.data||[];
    render();
  }
  function activeSeason(){ return state.seasons.find(x=>x.is_active) || state.seasons[0] || null; }
  function leagueForActive(){ const s=activeSeason(); return state.leagues.find(x=>x.season_id===s?.id) || state.leagues[0] || null; }
  function team(id){ return state.teams.find(x=>x.id===id); }
  function fillSelect(sel,items,label,empty='Seç...'){
    const el=$(sel); if(!el) return; const old=el.value;
    el.innerHTML=`<option value="">${empty}</option>`+items.map(x=>`<option value="${esc(x.id)}">${esc(label(x))}</option>`).join('');
    if(items.some(x=>x.id===old)) el.value=old;
  }
  function standings(lid){
    const teams=state.teams.filter(t=>t.league_id===lid).map(t=>({team:t,p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0}));
    const map=new Map(teams.map(x=>[x.team.id,x]));
    state.matches.filter(m=>m.league_id===lid && m.status==='played').forEach(m=>{
      const h=map.get(m.home_team_id), a=map.get(m.away_team_id); if(!h||!a) return;
      const hg=Number(m.home_score)||0, ag=Number(m.away_score)||0;
      h.p++;a.p++;h.gf+=hg;h.ga+=ag;a.gf+=ag;a.ga+=hg;
      if(hg>ag){h.w++;a.l++;h.pts+=3}else if(hg<ag){a.w++;h.l++;a.pts+=3}else{h.d++;a.d++;h.pts++;a.pts++}
    });
    return teams.sort((a,b)=>b.pts-a.pts||((b.gf-b.ga)-(a.gf-a.ga))||b.gf-a.gf||a.team.name.localeCompare(b.team.name));
  }
  function render(){
    const active=activeSeason(), league=leagueForActive();
    $('#activeSeasonName').textContent=active?.name || 'Henüz sezon oluşturulmadı';
    $('#activeSeasonMeta').textContent=league ? `${league.name} · ${state.teams.filter(t=>t.league_id===league.id).length} takım` : 'Admin panelinden sezon ve lig oluşturabilirsin.';
    $('#adminSeasonCount').textContent=state.seasons.length; $('#adminLeagueCount').textContent=state.leagues.length; $('#adminTeamCount').textContent=state.teams.length;
    const rows=league?standings(league.id):[];
    $('#leagueStandings').innerHTML=!league?'<div class="leagueEmpty">Henüz aktif bir lig yok.</div>':rows.length?`<table class="standingsTable"><thead><tr><th>#</th><th>TAKIM</th><th>O</th><th>G</th><th>B</th><th>M</th><th>AV</th><th>PUAN</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${i+1}</td><td><div class="teamCell">${r.team.logo_url?`<img class="teamLogoMini" src="${esc(r.team.logo_url)}" alt="">`:''}<b>${esc(r.team.name)}</b></div></td><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf-r.ga}</td><td><b>${r.pts}</b></td></tr>`).join('')}</tbody></table>`:'<div class="leagueEmpty">Bu ligde henüz takım yok.</div>';
    $('#leagueTeams').innerHTML=league?state.teams.filter(t=>t.league_id===league.id).map(t=>`<article class="leagueTeamCard">${t.logo_url?`<img src="${esc(t.logo_url)}" alt="">`:'<div class="teamLogoMini"></div>'}<div><b>${esc(t.name)}</b><small>${esc(league.name)}</small></div></article>`).join('')||'<div class="leagueEmpty">Henüz takım eklenmedi.</div>':'<div class="leagueEmpty">Önce bir lig oluştur.</div>';
    const matches=league?state.matches.filter(m=>m.league_id===league.id):[];
    $('#leagueMatches').innerHTML=matches.map(m=>{const h=team(m.home_team_id),a=team(m.away_team_id);return `<article class="matchCard"><div class="matchSide"><b>${esc(h?.name||'Bilinmeyen')}</b></div><div class="matchScore">${m.status==='played'?`${m.home_score} - ${m.away_score}`:'VS'}</div><div class="matchSide"><b>${esc(a?.name||'Bilinmeyen')}</b><small>${m.played_at?new Date(m.played_at).toLocaleDateString('tr-TR'):''}</small></div></article>`}).join('')||'<div class="leagueEmpty">Henüz maç bulunmuyor.</div>';
    $('#seasonArchive').innerHTML=state.seasons.map(s=>`<article class="archiveCard"><b>${esc(s.name)}</b><small>${s.is_active?'AKTİF SEZON':'Arşiv'} · ${esc(s.start_date||'')} ${s.end_date?'— '+esc(s.end_date):''}</small></article>`).join('')||'<div class="leagueEmpty">Henüz sezon arşivi yok.</div>';
    fillSelect('#leagueSeasonSelect',state.seasons,x=>x.name,'Sezon seç');
    fillSelect('#teamLeagueSelect',state.leagues,x=>x.name,'Lig seç');
    fillSelect('#matchLeagueSelect',state.leagues,x=>x.name,'Lig seç');
    renderAdminLists();
  }
  function renderAdminLists(){
    $('#adminSeasons').innerHTML=state.seasons.map(s=>`<div class="adminDataItem"><div><b>${esc(s.name)}</b><small>${s.is_active?'Aktif':'Arşiv'}</small></div></div>`).join('')||'<div class="adminEmpty">Sezon yok.</div>';
    $('#adminLeagues').innerHTML=state.leagues.map(l=>`<div class="adminDataItem"><div><b>${esc(l.name)}</b><small>${esc(l.code||'Lig')}</small></div></div>`).join('')||'<div class="adminEmpty">Lig yok.</div>';
    $('#adminTeams').innerHTML=state.teams.map(t=>`<div class="adminDataItem"><div><b>${esc(t.name)}</b><small>${esc(state.leagues.find(l=>l.id===t.league_id)?.name||'')}</small></div></div>`).join('')||'<div class="adminEmpty">Takım yok.</div>';
    $('#adminMatches').innerHTML=state.matches.slice(0,20).map(m=>`<div class="adminDataItem"><div><b>${esc(team(m.home_team_id)?.name||'?')} ${m.home_score??'-'} - ${m.away_score??'-'} ${esc(team(m.away_team_id)?.name||'?')}</b><small>${m.status==='played'?'Oynandı':'Bekliyor'}</small></div></div>`).join('')||'<div class="adminEmpty">Maç yok.</div>';
  }
  async function save(table,payload,success){
    const client=sb(); if(!client) return toast('Supabase bağlantısı bulunamadı.');
    const {error}=await client.from(table).insert(payload); if(error){console.error(error);toast('İşlem başarısız: '+error.message);return false;} toast(success); await loadAll(); return true;
  }
  function bind(){
    $('#leagueRefresh')?.addEventListener('click',loadAll);
    $$('[data-league-view]').forEach(b=>b.addEventListener('click',()=>{$$('[data-league-view]').forEach(x=>x.classList.remove('active'));$$('.leagueView').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#leagueView-'+b.dataset.leagueView)?.classList.add('active')}));
    $('#openLeagueAdmin')?.addEventListener('click',adminOpen); $$('[data-close-league-admin]').forEach(x=>x.addEventListener('click',adminClose));
    $$('[data-admin-tab]').forEach(b=>b.addEventListener('click',()=>{$$('[data-admin-tab]').forEach(x=>x.classList.remove('active'));$$('.adminTabPane').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#adminTab-'+b.dataset.adminTab)?.classList.add('active')}));
    $('#matchLeagueSelect')?.addEventListener('change',e=>{const ts=state.teams.filter(t=>t.league_id===e.target.value);fillSelect('#homeTeamSelect',ts,x=>x.name,'Ev sahibi');fillSelect('#awayTeamSelect',ts,x=>x.name,'Deplasman');});
    $('#seasonForm')?.addEventListener('submit',async e=>{e.preventDefault();const name=$('#seasonName').value.trim();if(!name)return; if($('#seasonActive').checked){const c=sb();await c.from('seasons').update({is_active:false}).eq('is_active',true)}await save('seasons',{name,start_date:$('#seasonStart').value||null,end_date:$('#seasonEnd').value||null,is_active:$('#seasonActive').checked},'Sezon oluşturuldu.');e.target.reset();});
    $('#leagueForm')?.addEventListener('submit',async e=>{e.preventDefault();await save('leagues',{season_id:$('#leagueSeasonSelect').value,name:$('#leagueName').value.trim(),code:$('#leagueCode').value.trim()||null},'Lig oluşturuldu.');e.target.reset();});
    $('#teamForm')?.addEventListener('submit',async e=>{e.preventDefault();await save('league_teams',{league_id:$('#teamLeagueSelect').value,name:$('#teamName').value.trim(),logo_url:$('#teamLogo').value.trim()||null},'Takım lige eklendi.');e.target.reset();});
    $('#matchForm')?.addEventListener('submit',async e=>{e.preventDefault();const h=$('#homeTeamSelect').value,a=$('#awayTeamSelect').value;if(!h||!a||h===a)return toast('İki farklı takım seç.');await save('matches',{league_id:$('#matchLeagueSelect').value,home_team_id:h,away_team_id:a,home_score:Number($('#homeScore').value)||0,away_score:Number($('#awayScore').value)||0,played_at:$('#matchDate').value||new Date().toISOString(),status:'played'},'Maç sonucu kaydedildi.');});
  }
  async function init(){
    // Butonlar veri bağlantısından bağımsız olarak hemen çalışsın.
    bind();

    // script.js önce istemciyi oluştursa da tarayıcı/önbellek gecikmesine karşı kısa süre bekle.
    let tries=0;
    while(!sb() && tries<20){
      await new Promise(r=>setTimeout(r,150));
      tries++;
    }

    if(!sb()){
      $('#activeSeasonName').textContent='Bağlantı kurulamadı';
      $('#activeSeasonMeta').textContent='Supabase başlatılamadı. Sayfayı önbelleksiz yenileyip tekrar dene.';
      return;
    }

    state.profile=await currentProfile();
    if(state.profile?.is_admin) $('#openLeagueAdmin').hidden=false;
    await loadAll();
  }
  document.addEventListener('DOMContentLoaded',init);
})();