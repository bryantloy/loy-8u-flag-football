/* OB Broncos V8: additive UI integration; leaves existing app, auth, and schema unchanged. */
(() => {
  'use strict';
  const games = [
    {day:'2026-12-05',week:1,time:'9:00 AM',opponent:'Coach Cooper',field:9,uniform:'Light'},
    {day:'2026-12-05',week:1,time:'10:00 AM',opponent:'Coach Self',field:9,uniform:'Dark'},
    {day:'2026-12-12',week:2,time:'12:00 PM',opponent:'Coach Engebos',field:12,uniform:'Light'},
    {day:'2027-01-09',week:3,time:'12:00 PM',opponent:'Coach Mills',field:12,uniform:'Light'},
    {day:'2027-01-16',week:4,time:'10:00 AM',opponent:'Coach Lizana',field:9,uniform:'Dark'},
    {day:'2027-01-16',week:4,time:'12:00 PM',opponent:'Coach Baker',field:12,uniform:'Dark'},
    {day:'2027-01-23',week:5,time:'9:00 AM',opponent:'Coach Betzhold',field:9,uniform:'Light'},
  ];
  const dayLabel = iso => new Date(iso+'T12:00:00Z').toLocaleDateString('en-US', {timeZone:'UTC',weekday:'short',month:'short',day:'numeric'});
  const localToday = () => new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const originalSchedule = schedule;
  schedule = function() {
    const next = games.find(g=>g.day>=localToday()) || games[games.length-1];
    const panel = `<section class="v8-season">
       <div class="v8-season-head"><span class="v8-mini">2026–27 FLAG FOOTBALL</span><h2>Broncos Game Days</h2><p>Coach Loy · 8U</p></div>
       <div class="v8-next"><span class="v8-mini">${next.day>=localToday()?'NEXT GAME':'LAST REGULAR-SEASON GAME'}</span><strong>${dayLabel(next.day)} · ${next.time}</strong><span>vs. ${esc(next.opponent)} · Field ${next.field}</span><span class="v8-jersey ${next.uniform==='Dark'?'v8-dark':'v8-light'}">${next.uniform==='Dark'?'● Dark / Home':'○ Light / Away'} jersey</span></div>
       <div class="v8-game-list">${games.map(g=>`<div class="v8-game"><div><span class="v8-mini">WEEK ${g.week} · ${dayLabel(g.day)}</span><strong>${g.time} vs. ${esc(g.opponent)}</strong><span>Field ${g.field}</span></div><span class="v8-jersey ${g.uniform==='Dark'?'v8-dark':'v8-light'}">${g.uniform}</span></div>`).join('')}</div>
       <div class="v8-tourney"><strong>🏆 Saturday, Jan 30 — End-of-season tournament</strong><p>Field 9 · Game time TBD by standings</p><p>9:00 AM: 1st vs. 4th · 10:00 AM: 2nd vs. 3rd · 11:00 AM: Winners play</p></div>
       <p class="v8-footnote">Times and fields are subject to league changes. Your calendar and RSVPs are shown below.</p>
     </section>`;
    return originalSchedule().replace('<main class="content">','<main class="content">'+panel);
  };

  const originalDrillDetail = drillDetail;
  drillDetail = function(d) {
    let html = originalDrillDetail(d);
    const meta = drillInfo[d.title];
    if (!meta || meta.mode!=='home') return html;
    if (!coach()) return html; // Parents retain the original guardian-restricted form.
    // The original form only lists own() guardians and can disappear entirely for coaches.
    html=html.replace(/<section class="panel home-log" id="home-practice-log">[\s\S]*?<\/section>/, '');
    const playerOrder = [...s.players].sort((a,b)=>(a.first_name==='Brooks'?-1:0)-(b.first_name==='Brooks'?-1:0));
    const score = meta.metric ? `<div class="field"><label>Result (${esc(meta.unit)}) — optional</label><input class="input" type="number" name="value" min="0" max="${meta.metric==='seconds'?300:1000}" step="${meta.metric==='seconds'?'0.01':'1'}" placeholder="${meta.metric==='seconds'?'e.g. 8.45':'e.g. 13'}"></div>`:'';
    const panel=`<section class="panel home-log v8-coach-log" id="v8-log"><div class="v8-log-head"><span class="v8-mini">COACH / PARENT LOG</span><h3>✓ Save this practice</h3><p>Record a session for Brooks or another player. A result is optional; completed practices still count.</p></div><form id="v8-home-log"><input type="hidden" name="drill" value="${esc(d.id)}"><div class="field"><label>Player</label><select class="input" name="player" required>${playerOrder.map(p=>`<option value="${esc(p.id)}">${esc(p.first_name)} ${esc(p.last_initial||'')}</option>`).join('')}</select></div><div class="field"><label>Minutes practiced</label><input class="input" name="minutes" type="number" required min="1" max="180" value="${Number(d.duration_minutes)||5}"></div>${score}<div class="field"><label>Notes (optional)</label><input class="input" name="notes" maxlength="500" placeholder="e.g. Brooks completed three rounds"></div><button class="btn orange-btn v8-save" type="submit">✓ Log practice & save result</button><p class="muted">Session records go to coach review; scores are saved to the player's progress history.</p></form></section>`;
    html = html.replace('<div class="timer-panel">','<div class="timer-panel"><button type="button" class="btn orange-btn v8-log-jump" data-v8-jump="1">✎ Log Brooks’ practice after the timer ↓</button>');
    return html + panel;
  };
  document.addEventListener('click', e => {
    if(!e.target.closest('[data-v8-jump]')) return;
    const panel=document.getElementById('v8-log');if(panel){panel.scrollIntoView({behavior:'smooth',block:'start'});panel.querySelector('[name="minutes"]')?.focus({preventScroll:true});}
  },true);
  document.addEventListener('submit', async e => {
    if(e.target.id!=='v8-home-log')return;
    e.preventDefault();e.stopImmediatePropagation();
    const form=e.target;if(form.dataset.busy==='yes')return;
    if(!coach()){s.err=true;s.message='Coach access required';render();return;}
    const d=new FormData(form),drill=s.drills.find(v=>v.id===d.get('drill')),
          player=String(d.get('player')),mins=Number(d.get('minutes')),
          metric=drillInfo[drill?.title],raw=String(d.get('value')??'').trim();
    if(!drill||metric?.mode!=='home'||!s.players.some(p=>p.id===player)){s.err=true;s.message='Choose a team player and home drill';render();return;}
    if(!Number.isInteger(mins)||mins<1||mins>180){s.err=true;s.message='Minutes must be between 1 and 180';render();return;}
    let value=null;
    if(raw!=='') {value=Number(raw);if(!metric.metric||!Number.isFinite(value)||value<0||value>(metric.metric==='seconds'?300:1000)||(metric.metric!=='seconds'&&!Number.isInteger(value))){s.err=true;s.message='Enter a valid result';render();return;}}
    form.dataset.busy='yes';form.querySelector('[type="submit"]').disabled=true;
    try {
      const r=await s.db.from('drill_submissions').insert({team_id:s.team.id,player_id:player,drill_id:drill.id,drill_name:drill.title,minutes_practiced:mins,notes:String(d.get('notes')||'').trim(),submitted_by:s.user.id});
      if(r.error)throw r.error;
      if(value!==null){const score=await s.db.from('drill_results').insert({team_id:s.team.id,drill_id:drill.id,player_id:player,metric:metric.metric,value,submitted_by:s.user.id});if(score.error)throw Error('Practice saved, but result failed: '+score.error.message+' (do not submit again)');}
      await load();s.err=false;s.message=value!==null?'Practice and score saved!':'Practice logged!';render();
    }catch(err){s.err=true;s.message=err.message||'Could not save practice';render();}
  },true);
})();