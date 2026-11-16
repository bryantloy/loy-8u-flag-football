/* OB Broncos 8U V9.1 — reliable bulk calendar exports.
   Uses database events and a verified fixture fallback when the game sync is incomplete.
   The fallback affects exports only; Supabase remains the schedule feed source. */
(() => {
  'use strict';
  const fixtures = [
    ['2026-12-05T09:00:00-06:00','Cooper',9,'LIGHT / AWAY'],
    ['2026-12-05T10:00:00-06:00','Self',9,'DARK / HOME'],
    ['2026-12-12T12:00:00-06:00','Engebos',12,'LIGHT / AWAY'],
    ['2027-01-09T12:00:00-06:00','Mills',12,'LIGHT / AWAY'],
    ['2027-01-16T10:00:00-06:00','Lizana',9,'DARK / HOME'],
    ['2027-01-16T12:00:00-06:00','Baker',12,'DARK / HOME'],
    ['2027-01-23T09:00:00-06:00','Betzhold',9,'LIGHT / AWAY']
  ];
  function upcoming(e){ return Date.parse(e.starts_at) >= Date.now(); }
  function allEvents(){
    const current = Array.isArray(s.events) ? s.events : [];
    const existing = current.filter(e=>e.event_type==='game');
    const base = fixtures.map(([starts_at,opponent,field,jersey])=>{
      const actual = existing.find(e=>Math.abs(Date.parse(e.starts_at)-Date.parse(starts_at))<60000);
      return actual || {
        id:'official-'+starts_at.replace(/[^0-9]/g,''),team_id:s.team?.id||'',
        starts_at,event_type:'game',title:'OB Broncos vs. Coach '+opponent,
        location:'Orange Beach Sportsplex - Field '+field,
        notes:jersey+' jersey. Check for league updates.'
      };
    });
    // A single match for each official game; retain any additional events added by the coach.
    const merged=current.filter(e=>e.event_type!=='game').concat(base,existing.filter(e=>
      !fixtures.some(([ts])=>Math.abs(Date.parse(e.starts_at)-Date.parse(ts))<60000)
    ));
    return uniqueEvents(merged.filter(e=>['game','practice'].includes(e.event_type)&&upcoming(e)))
      .sort((a,b)=>Date.parse(a.starts_at)-Date.parse(b.starts_at));
  }
  const previousSchedule=schedule;
  schedule=function(){
    let html=previousSchedule();
    const all=allEvents(),games=all.filter(e=>e.event_type==='game').length,
      practices=all.filter(e=>e.event_type==='practice').length;
    const box=`<section class="v9-export" aria-label="Bulk calendar export">
      <div class="v9-total">ONE-TAP CALENDAR EXPORT</div>
      <h3>📅 Put the season on your phone</h3>
      <p>${games} upcoming games · ${practices} upcoming practices, with field and jersey notes.</p>
      <button type="button" class="btn" data-v9-export="all">＋ Add all games + practices</button>
      <button type="button" class="btn v9-small" data-v9-export="games">Add games only</button>
      <button type="button" class="btn v9-small" data-v9-export="practices">Add practices only</button>
      <p class="v9-footer">Downloads a .ics file for your calendar. Events use a provisional 60-minute duration; the Jan 30 tournament remains TBD.</p>
    </section>`;
    html=html.replace(/<div class="calendar-export-bar">[\s\S]*?<\/div>/,'');
    return html.replace('<main class="content">','<main class="content">'+box);
  };
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-v9-export]');if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();
    const mode=b.dataset.v9Export;
    const list=allEvents().filter(ev=>mode==='all'||ev.event_type===(mode==='games'?'game':'practice'));
    if(!list.length){s.err=true;s.message='No upcoming '+mode+' to export. Refresh Schedule after importing events.';render();return;}
    try{saveCalendarEvents(list,'OB-Broncos-2026-27-'+mode+'.ics');}
    catch(err){s.err=true;s.message='Calendar download failed: '+(err?.message||String(err));render();}
  },true);
})();
