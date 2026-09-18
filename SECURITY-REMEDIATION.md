# Onboarding tracker security work — September 17, 2026

The owner confirmed this tracker is still used and requested protected sign-in.
Do not retire it or remove its current data access without a coordinated cutover.

The current page has no sign-in. Its three Supabase tables grant anonymous and
authenticated roles access, with permissive public ALL policies. This remains
an urgent open finding (F02); safe HTML rendering alone does not resolve it.

The stored-text fix escapes names, locations, notes and checklist labels in
HTML text, textarea contents and input attributes. PostgreSQL schema verification
confirmed the identifiers used in inline handlers are UUID columns. The tests
use synthetic strings and the actual rendering functions without database,
network, login, or production writes. Run `node --test test/*.test.cjs`.

Before sign-in rollout:

1. Confirm which owner/staff accounts may view and edit all checklists; do not
   automatically give every signed-in gym member or staff account access.
2. Prefer existing verified Aira staff identity and an explicit server-enforced
   authorization list. Do not rely on hidden UI, a public key, user-editable
   metadata, or a password embedded in this page.
3. Choose a protected first-party app origin for privileged sign-in. GitHub Pages
   project paths under the same account share an origin; a separate repository
   path is not isolation for browser-stored tokens.
4. Test permitted read/edit/reorder/add/remove operations and denied anonymous,
   unapproved, expired-session, and cross-scope requests offline. Preserve drafts
   and show save failures rather than pretending an optimistic change was saved.
5. Prepare the exact permission restriction and rollback. Obtain owner approval
   for the combined production credential/access/policy cutover after testing.
6. Verify new sign-in and normal checklist usage, then confirm the old public
   Data API no longer reads or writes the three tables. Preserve backups.

No account invitations, passwords, provider auth settings, or database grants
have been changed by this source patch.
