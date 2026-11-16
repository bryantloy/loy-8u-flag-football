/* V9: calendar export actions for approved team members. Depends on existing app.js. */
(() => {
  'use strict';
  // Keep the original event cards and their individual Add to Calendar buttons.
  const original = schedule;
  schedule = function() {
    let html = original();
    const now = Date.now();
    const planned = uniqueEvents(s.events.filter(e =>
      ['game','practice'].includes(e.event_type) && new Date(e.starts_at).getTime() >= now
    ));
    const games=planned.filter(e=>e.event_type==='game').length;
    const practices=planned.filter(e=>e.event_type==='practice').length;
    const exportBox = `<section class="v9-export" aria-label="Bulk calendar export">
      <div class="v9-total">ONE-TAP CALENDAR EXPORT</div>
      <h3>📅 Put the season on your phone</h3>
      <p>${games} upcoming games · ${practices} upcoming practices. Includes times, fields, and uniform notes from your team calendar.</p>
      <button type="button" class="btn" data-v9-export="all">＋ Add all games + practices</button>
      <button type="button" class="btn v9-small" data-v9-export="games">Add games only</button>
      <button type="button" class="btn v9-small" data-v9-export="practices">Add practices only</button>
      <p class="v9-footer">Downloads a calendar (.ics) file. Tap to import it into Google Calendar, Apple Calendar or another calendar app. Event end times are provisional 60-minute placeholders. Tournament kickoff is TBD and is not exported.</p>
    </section>`;
    // Place above the schedule; remove the older ambiguous bulk button to avoid two competing actions.
    html=html.replace(/<div class="calendar-export-bar">[\s\S]*?<\/div>/,'');
    return html.replace('<main class="content">','<main class="content">'+exportBox);
  };
  document.addEventListener('click', e=>{
    const b=e.target.closest('[data-v9-export]'); if(!b)return;
    e.preventDefault();
    const mode=b.dataset.v9Export;
    const list=uniqueEvents(s.events.filter(ev=>
      ['game','practice'].includes(ev.event_type) && new Date(ev.starts_at).getTime()>=Date.now() &&
      (mode==='all'||(mode==='games'&&ev.event_type==='game')||(mode==='practices'&&ev.event_type==='practice'))
    )).sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
    if(!list.length){s.err=true;s.message='No upcoming '+(mode==='all'?'games or practices':mode)+' found. Ask your coach to run the season calendar SQL and refresh this page.';render();return;}
    saveCalendarEvents(list,'OB-Broncos-2026-27-'+mode+'.ics');
  }, true);
})();
