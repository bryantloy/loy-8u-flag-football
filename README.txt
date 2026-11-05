OB BRONCOS 8U — V6 CALENDAR + PARENT DRILL LOGGING

This package includes all V5 calendar improvements AND the new V6 parent drill logging.

On your phone: unzip, upload and replace ONLY these THREE files at the GitHub repository root:
  app.js
  styles.css
  sw.js

Keep the rest of your repository (index.html, images, api/, lib/, manifest, etc.) unchanged.
Commit to main; Vercel deploys automatically. Refresh the installed app after deployment.

WHAT'S NEW
- Choose a home drill and tap "We practiced this!"
- Parents select their linked child, enter minutes, optional performance score and notes.
- One form saves the drill submission for coach approval and, when entered, the numeric score for progress tracking.
- Individual player progress area under Team: completed home sessions, coach approvals, points and personal bests.
- Recent submission history and personal-best chart after selecting the drill.
- Keep parent/home sessions separate from verified point awards.
- Retains the V5 month calendar and add-to-phone-calendar exports.
- Weekly-repeat creation remains paused while duplicates are being resolved.

DATABASE
No additional SQL is needed IF your previous drill_submissions, drill_results and point_awards tables and policies have been created as discussed. Parents must already have approved memberships and player-guardian relationships.
If the drill results table was never created, complete that prior SQL setup first.

NOTES
- A numeric score is optional; completing a drill is still a valid parent submission.
- Coach approval governs participation points. A submitted numerical score is not automatically an award.
- For our testing beta only. Before inviting families, tighten RLS on raw drill results to guardians and coaches and finish invitation protections and account recovery.
