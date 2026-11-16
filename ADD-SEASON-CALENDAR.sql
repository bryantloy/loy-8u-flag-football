-- OB Broncos 8U V9: verified 2026–27 games and two requested practices.
-- Run ONCE in bryants-fun-projects / Supabase SQL Editor.
-- SAFE TO RERUN: inserts only when no same-type event exists at that team's exact start time.
-- Existing events/RSVPs/attendance are left untouched.
-- Time zone: America/Chicago. Unspecified practice field is deliberately not assumed.
WITH fixtures (local_start, kind, title, place, detail) AS (
 VALUES
 (timestamp '2026-11-21 09:00','practice','OB Broncos 8U Practice','Orange Beach Sportsplex - field TBD','9:00 AM Saturday practice. Confirm exact field with Coach Loy. Bring water, cleats and flag belt.'),
 (timestamp '2026-11-28 11:30','practice','OB Broncos 8U Practice','Orange Beach Sportsplex - field TBD','11:30 AM Saturday practice. Confirm exact field with Coach Loy. Bring water, cleats and flag belt.'),
 (timestamp '2026-12-05 09:00','game','OB Broncos vs. Coach Cooper','Orange Beach Sportsplex - Field 9','Light / Away jersey. Field 9. Arrive early, bring water and flag belt.'),
 (timestamp '2026-12-05 10:00','game','OB Broncos vs. Coach Self','Orange Beach Sportsplex - Field 9','Dark / Home jersey. Field 9. Arrive early, bring water and flag belt.'),
 (timestamp '2026-12-12 12:00','game','OB Broncos vs. Coach Engebos','Orange Beach Sportsplex - Field 12','Light / Away jersey. Field 12. Arrive early, bring water and flag belt.'),
 (timestamp '2027-01-09 12:00','game','OB Broncos vs. Coach Mills','Orange Beach Sportsplex - Field 12','Light / Away jersey. Field 12. Arrive early, bring water and flag belt.'),
 (timestamp '2027-01-16 10:00','game','OB Broncos vs. Coach Lizana','Orange Beach Sportsplex - Field 9','Dark / Home jersey. Field 9. Arrive early, bring water and flag belt.'),
 (timestamp '2027-01-16 12:00','game','OB Broncos vs. Coach Baker','Orange Beach Sportsplex - Field 12','Dark / Home jersey. Field 12. Arrive early, bring water and flag belt.'),
 (timestamp '2027-01-23 09:00','game','OB Broncos vs. Coach Betzhold','Orange Beach Sportsplex - Field 9','Light / Away jersey. Field 9. Arrive early, bring water and flag belt.')
)
INSERT INTO football.team_events (team_id,title,event_type,starts_at,location,notes)
SELECT t.id,f.title,f.kind,
       f.local_start AT TIME ZONE 'America/Chicago', f.place,f.detail
FROM football.teams t CROSS JOIN fixtures f
WHERE t.slug='loy-8u'
 AND NOT EXISTS (
   SELECT 1 FROM football.team_events x
   WHERE x.team_id=t.id AND x.event_type=f.kind
     AND x.starts_at=(f.local_start AT TIME ZONE 'America/Chicago')
 );

-- Verification; if prior entries exist at these times, they are retained as-is.
SELECT event_type,title,
       starts_at AT TIME ZONE 'America/Chicago' AS central_time,
       location,notes
FROM football.team_events
WHERE team_id=(SELECT id FROM football.teams WHERE slug='loy-8u')
 AND starts_at >= (timestamp '2026-11-21 00:00' AT TIME ZONE 'America/Chicago')
 AND event_type IN ('game','practice')
ORDER BY starts_at;
