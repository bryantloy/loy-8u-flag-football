OB BRONCOS V9.1 - FIX NONRESPONSIVE GAME EXPORT BUTTONS
1. In GitHub repository root, REPLACE broncos-v9.js with the included file.
2. Check index.html includes <script defer src="broncos-v9.js"></script> after app.js (and after broncos-v8.js if installed). If not, replace index.html with the included copy.
3. Commit, let Vercel deploy, refresh app Schedule tab. Try Add games only / Add all games + practices.
4. Run the pasted games SQL in Supabase to save games in the actual feed; this patch also has an official master-schedule fallback for exports only.
5. No SQL change is needed to fix the button itself. No changes to existing practices.
Note: these are one-time .ics imports, not subscribed calendars. Game end times provisional one hour.
