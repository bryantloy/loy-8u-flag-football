# OB Broncos V9 — One-tap season calendar

## One-time database update (coach)
In Supabase **bryants-fun-projects → SQL Editor**, execute `ADD-SEASON-CALENDAR.sql`. This adds the seven master-schedule games and both specifically requested practices (Nov 21 at 9 AM, Nov 28 at 11:30 AM Central). No invented end times or practice field assignments. Running it again will not create another same-type event at those times. If an older event already exists at the same time, it is preserved, not overwritten.

## Update GitHub / Vercel
At the root of `bryantloy/loy-8u-flag-football`, upload/re-upload:
- `index.html` (must have this exact filename)
- `broncos-v8.js` and `broncos-v8.css` (if not already uploaded)
- `broncos-v9.js` and `broncos-v9.css` (new)

Keep existing `app.js`, `styles.css`, `sw.js`, logo/icon files, `api/`, `lib/` and other files unchanged. No need to upload SQL or `.ics` to GitHub. Vercel will deploy after the commit. Refresh the app, then open Schedule. If a home-screen app shows an old version, force-refresh the browser page; `sw.js` already uses network-first fetching.

## Parent instructions
Open **Schedule → Add all games + practices**. This downloads a single `.ics` calendar file containing all future stored games/practices. Parents can choose only games or only practices. Each event card still has individual Add to Calendar and Google Calendar options. The calendar is an export snapshot, not an automatically synchronized subscription; re-export when the league changes times or fields. Some phone calendar apps may need the downloaded ICS file opened from Files or imported into their calendar settings.

## Optional direct family download
Share `OB-Broncos-2026-27-All-Games-and-2-Practices.ics` if you want all nine known events even before the app database is updated. Importing the app-generated version later may create duplicate entries in certain calendar apps (different UID formats), so recommend ONE route to parents.

## Source and decisions
Seven games verified against the 2026–27 8U Master Schedule PDF. Nov 21 at 9:00 and Nov 28 at 11:30 were supplied by coach. Practices use Orange Beach Sportsplex, but no confirmed field is provided for these two dates. All event end times are provisional 60 minutes. Jan 30 tournament has unknown game time and is deliberately excluded.
