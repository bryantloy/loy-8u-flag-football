# OB Broncos V8 — Game Schedule + Coach Drill Logging

This is a SMALL ADD-ON to your existing V7 app, not a new database or a full replacement.

## In GitHub (root folder)
1. Replace `index.html` with the one in this ZIP. It is the same existing HTML with only 2 additional references.
2. Add `broncos-v8.js` and `broncos-v8.css` to the root (alongside `app.js`).
3. Keep `app.js`, `styles.css`, `api/`, `lib/`, icons, etc. exactly as they are.
4. Vercel deploys from GitHub. Refresh the site (the two new versioned files should load). Don't clear app/browser data; anonymous auth depends on it.

## In Supabase
5. Open `bryants-fun-projects` -> SQL Editor and run `ADD-GAME-SCHEDULE.sql` ONCE. It is safe to re-run and will skip game dates/times already present. The Jan 30 tournament stays informational because the kickoff time is TBD.

## Test
6. Open Schedule: the top of the page now has the compact season matchup cards. The 7 games also show in the existing calendar after running SQL.
7. Open Drills -> At home -> Cone Touch Challenge (or another home drill). Start/stop a timer, then tap 'Log Brooks’ practice after the timer'. Choose Brooks, minutes and optionally a score (touches); save.
8. Open Team -> Player progress -> Brooks to check saved sessions / best scores. A pending coach review may still be required for points.

## Note
Coaches can log for any rostered player; regular parents remain guardian-restricted. This addresses a front-end authorization check that previously hid the logging form for coaches. Backend Supabase row-level policies must also permit coaches to insert into drill_submissions and drill_results. If a 'permission denied' error appears when saving, we should inspect those policies rather than disable RLS. The V8 JS displays database errors.

The app is still using browser-based anonymous authentication. Do not clear browser data or reinstall before account recovery is implemented.
