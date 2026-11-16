-- OB Broncos V8: 2026–27 game schedule from the coach-supplied master schedule.
-- Run in bryants-fun-projects -> SQL Editor. Idempotent per team, time and event type.
-- Tournament Jan 30: TBD start time, so no fabricated calendar event is added.
WITH fixtures(local_start, opponent, field_number, uniform) AS (
  VALUES
  (timestamp '2026-12-05 09:00', 'Coach Cooper', 9, 'Light / Away'),
  (timestamp '2026-12-05 10:00', 'Coach Self', 9, 'Dark / Home'),
  (timestamp '2026-12-12 12:00', 'Coach Engebos', 12, 'Light / Away'),
  (timestamp '2027-01-09 12:00', 'Coach Mills', 12, 'Light / Away'),
  (timestamp '2027-01-16 10:00', 'Coach Lizana', 9, 'Dark / Home'),
  (timestamp '2027-01-16 12:00', 'Coach Baker', 12, 'Dark / Home'),
  (timestamp '2027-01-23 09:00', 'Coach Betzhold', 9, 'Light / Away')
)
INSERT INTO football.team_events (team_id, title, event_type, starts_at, location, notes)
SELECT t.id,
       'OB Broncos vs. ' || f.opponent,
       'game',
       f.local_start AT TIME ZONE 'America/Chicago',
       'Orange Beach Sportsplex - Field ' || f.field_number,
       'Uniform: ' || f.uniform || '. Field ' || f.field_number || '. Arrive early and bring water and flag belt.'
FROM football.teams t CROSS JOIN fixtures f
WHERE t.slug='loy-8u'
  AND NOT EXISTS (
    SELECT 1 FROM football.team_events e
    WHERE e.team_id=t.id AND e.event_type='game'
      AND e.starts_at=f.local_start AT TIME ZONE 'America/Chicago'
  );

-- Verify the scheduled games:
SELECT title, starts_at AT TIME ZONE 'America/Chicago' AS central_start,
       location, notes
FROM football.team_events
WHERE event_type='game'
  AND team_id=(SELECT id FROM football.teams WHERE slug='loy-8u')
ORDER BY starts_at;
