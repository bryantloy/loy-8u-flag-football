# OB Broncos 8U — Team HQ Live Supabase Beta

This is the next version of the original Team HQ PWA. It retains the original `index.html` and app structure, with a new OB Broncos theme, navy/orange styling, and phone icon and installable web-app structure, but now uses Supabase for actual data.

**This is a private pilot, not a parent-ready public release.** Test coach/parent permissions, approval flows, device recovery, rate limiting, and privacy before inviting team families.

## Deploy

1. Extract the ZIP. Upload **everything inside the project folder** to the **root** of `bryantloy/loy-8u-flag-football`, replacing `index.html`, `app.js`, `styles.css`, `sw.js`, and `README.md`; adding `api/` and `sql/`. Do not upload the ZIP itself.
2. Vercel should use the existing GitHub project, framework `Other`, no build command, root as output directory. Vercel Serverless Functions are in `api/`.
3. Existing Supabase Vercel integration has `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_PUBLISHABLE_KEY` (or the listed NEXT_PUBLIC fallbacks). **Never put service-role/secret/database credentials in frontend files.** `/api/config` exposes only the public project URL and publishable key.
4. In Supabase Authentication → Providers, enable Anonymous Sign-Ins. The app signs visitors in anonymously automatically.
5. Supabase SQL Editor: after the two SQL scripts already executed, run **`sql/02-live-onboarding.sql`**. This adds the join request table and enforces event/player team agreement.
6. Open your deployed app on the device you intend to use as coach. The first screen shows an account UUID; copy it.
7. Open **`sql/03-first-coach.sql`**, replace `PASTE-USER-UUID-HERE` with that UUID, and run it in Supabase SQL Editor. This creates team slug `loy-8u` and names the team `OB Broncos 8U` and grants that device's user `owner` membership.
8. Return to the app and tap **Check again**. Open Team and add roster players (first names only), then Schedule to add practices/games and Drills to load the five starter drills.
9. Test joining using a second device/incognito browser: enter parent name and child's name, then have the coach open Team → Parent Join Requests, select the correct roster player, and approve.
10. Test RSVP and drill logging from the parent; coach attendance confirmation and drill approval will award points.

## Functions
- `api/config.js`: supplies **public** project URL and key to browser.
- `api/public-team.js`: returns only public team ID/name for initial onboarding.
- `api/join.js`: creates a pending request based on an Auth-verified bearer token.
- `api/approve.js`: requires an approved coach and links approved guardian to player.
- `api/attendance.js`: coach-confirmed attendance and idempotent point award.
- `api/review-drill.js`: coach review and points award for home activities.

The private service-role key stays server-side. All other reads/writes use the user's Supabase auth identity and Row Level Security.

## Current limitations

- No push notifications, scheduled reminders, or automatic live chat updates yet. Refresh chat to see new messages.
- Parent identities are anonymous browser sessions without cross-device recovery. Clearing site data means a new request; this is a critical usability issue to address before launch.
- The join request endpoint doesn't yet require a separate invitation token; access remains **pending until coach approves**. Add private invite codes and rate limiting before parent rollout.
- The existing base RLS schema is a foundation, not a production security audit. Verify team separation and role privileges with two or more accounts and add stronger invitation/recovery protection.
- Rewards use +10 points for confirmed practice/game attendance, +5 for approved at-home drills by default; no monthly/weekly filters yet. The data model supports future seasons and card packs.
- At-home logs require coach approval; duplicate submissions are not yet rate-limited or capped. Confirm limits before public launch.
- Kids' photos and trading cards are intentionally not included in this version.

## Troubleshooting

- `Missing Supabase configuration`: ensure Vercel variables are assigned to Production, then redeploy; see `/api/config` response.
- `Anonymous sign-ins are disabled`: enable them in Supabase Authentication → Providers.
- `join_requests not found`: run `sql/02-live-onboarding.sql`.
- No team after SQL: the first coach UUID was not pasted correctly, or the app is on a different browser/device than the one whose UUID was used.
- Parent join request not showing: ensure the parent used another browser session, that their request is pending, and that the coach refreshed Team.
- 403 from GitHub integration: current ChatGPT GitHub connection has read access but returned "Resource not accessible by integration" when attempting to write; use manual GitHub upload or update integration permissions.

## Broncos branding update

- `broncos-logo.png`: complete square OB Broncos crest for the home/header.
- `icon-192.png`, `icon-512.png`: actual installable Android/PWA icon.
- `apple-touch-icon.png`: iPhone Add to Home Screen icon.
- `manifest.webmanifest`: OB Broncos display name, navy app background.
- `styles.css`: orange and navy color system for all app screens.
- `sw.js`: cache version bumped so installed apps fetch the new assets.
- Existing Supabase team slug remains `loy-8u` to avoid breaking existing connections; the public-facing team name is OB Broncos 8U. If you **already ran** the first-coach SQL with another team name, you can rename it with `update public.teams set name='OB Broncos 8U',primary_color='#071c3c',accent_color='#ff7900' where slug='loy-8u';` in SQL Editor.
- The logo is original Broncos-inspired artwork, not the official NFL logo or a claim of NFL endorsement.
- If the previous version is already installed on a phone, remove that old home-screen shortcut after deployment and reinstall to refresh the icon.
