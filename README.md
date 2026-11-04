# Team HQ — 8U Flag Football (V1 foundation)

Mobile-first, installable PWA preview with royal blue/orange theme and five working tabs: Home, Schedule, Chat, Drills, Team.

## Getting started

1. Extract this ZIP **as a folder**. Keep `index.html` named exactly `index.html` at the folder root.
2. Put folder contents at the **root** of a new GitHub repository (or upload the extracted directory's contents).
3. Import GitHub repo into Vercel: framework preset **Other**, leave build command blank, output directory **.** (project root).
4. Open the Vercel URL. On Android, choose `Install app` / `Add to Home screen`; on iPhone, use Safari `Share > Add to Home Screen`.
5. Customize team name/colors in `index.html`, `app.js`, `styles.css`, `manifest.webmanifest`, `icon.svg`.

## What actually works in this preview

- Home dashboard and upcoming event.
- Sample schedule, create test events, RSVP Yes/No.
- Local test chat.
- Five searchable-by-category flag football drills.
- Parent display name stored locally.
- App install manifest and service worker (offline fallback for previously loaded assets).

**Very important:** The preview is single-device only. `localStorage` saves data on the browser that entered it; nothing syncs between families. The form for creating events is intentionally open in preview. **Do not distribute to parents yet.** There is no production authentication, team invites, secure permissions, real-time sync, or actual push service in this first preview.

## Supabase roadmap

The file `supabase-schema.sql` defines a multi-team starting structure for teams, approved members, players, guardians, events, RSVPs, announcements, chat, and drills, with RLS policies to evolve and test. It is **not yet wired to the frontend**. It needs an invite/membership provisioning endpoint and additional security validation before production use.

Recommended build order:
1. Create Supabase project and run/review schema in a development instance.
2. Implement secure invite codes + anonymous Auth and approved memberships. Enrollment and coach permissions require trusted backend logic.
3. Link frontend to Supabase events, player-specific RSVPs, announcements, and messages; deploy Realtime.
4. Build coach dashboard and roster import, field addresses, calendar `.ics`, and announcement posting.
5. Add push subscription opt-in (iOS requires installed home-screen web app), VAPID keys, secure push service, notification preferences and test coverage.
6. Launch with a handful of parents; expand after testing permissions on two or more devices.

## V2 card system (intentionally NOT part of V1)

Design for future `card_catalog`, `card_editions`, `pack_awards`, `pack_opens`, `owned_cards`, and `team_seasons` tables referencing stable `teams.id` and `players.id`. A pack opening always gives that player **at least one own-player card** (with randomized edition/rarity), plus optional school-, local football-, college-, or pro-football-inspired ORIGINAL collectible designs. Cards/pack randomization should be awarded server-side, not controlled in client JavaScript. Obtain rights or permission before using official team trademarks, athlete likenesses, or school marks; get guardian permission before public use of children's photos. Avoid attendance shaming and purchases.

## Privacy and security

Children's information deserves conservative defaults. Use private team approvals, parent-only contact data, server-enforced coach roles, minimal roster details, private storage for player photos, and explicit guardian permission. Review schema triggers/constraints and team isolation before opening enrollment.
