OB BRONCOS / BRYANTS-FUN-PROJECTS — V7

1. SQL 01 and 02 already ran in bryants-fun-projects; do not rerun them.
2. Verify Supabase Auth > Providers > Anonymous Sign-Ins is enabled IN bryants-fun-projects. (Auth is shared with travel app; don't disable/change its existing providers.)
3. In the Broncos Vercel project, replace old/deleted project environment variables using the NEW bryants-fun-projects Project URL, publishable key, and server-only secret/service-role key. Existing Supabase integration may still reference the deleted project. Check Settings > Environment Variables. Do not paste server secrets into code or chat.
4. Files: upload app.js and sw.js at repository root; upload api/public-team.js, api/join.js, api/approve.js and api/attendance.js under api; lib/server.js under lib. The ZIP has these paths. All other existing app files remain. If uploading on a phone, preserve directory names via GitHub Create new file path; GitHub mobile uploads do not necessarily support folders.
5. Redeploy Vercel. Open Broncos app on the same browser you will use as coach. Its new anonymous Auth user ID is different; use the new ID in sql/04-coach-bootstrap.sql and run that in bryants-fun-projects SQL Editor. Tap Check Again.
6. The 8 players are already in the football.players roster, first names + last initials only, no birth dates. Verify Team tab.
7. In a SECOND browser session, try Claim your player, then approve that parent in Team tab. Do not invite actual families until security, authentication recovery and invite controls have been tested.

Important: Current prototype is not family-ready; no invite-token or rate limiting, user identities are anonymous to individual browser, and some existing features have not been end-to-end tested against new schema. This package is a migration beta, not a guarantee of production readiness.
