# Protected onboarding tracker — September 17, 2026

The owner approved activation for Mike Bell and Alyssa Kathan only. The tracker
now lives under **Super Admin → Franchisee Onboarding** in Aira Admin:
https://aira-admin-three.vercel.app/franchisee-onboarding

This repository is a fixed redirect and fallback link. It contains no Supabase
client, database key, script, or privileged sign-in. Existing Aira staff login
is required at the destination. Other staff or owner roles gain no implicit
access; the server checks an exact two-account allowlist on every operation.
Role-preview mode is denied; return to the real owner view before opening it.

## Live cutover verification

- The three onboarding tables no longer grant PUBLIC, anonymous, or ordinary
  authenticated users read/write access. Anonymous REST probes returned 401.
- The restricted server role has only the required four CRUD privileges, with
  verified TLS through the IPv4-compatible session pooler. It cannot bypass RLS,
  read Auth, create objects, truncate tables, or become an owner/service role.
- The existing independent backup reader remains read-only. A fresh export
  after restriction succeeded and its archive catalog includes all three tables.
- The real owner browser session loaded the tracker, created a clearly labeled
  temporary checklist, saved a note and completed step, reloaded both changes,
  and removed the temporary checklist through its confirmation dialog.
- All original row counts and hashes match the checkpoint: 4 franchisees,
  21 steps, and 81 completion records. Alyssa's active identity and allowlist
  entry were verified; her separate interactive sign-in remains unobserved.

The exact operation and recovery procedure live in
`aira-api/docs/franchisee-onboarding-security.md`. Never restore the former
anonymous policies as a page rollback. Disable the tracker feature if needed
while preserving restricted access and independent backups. Historical access
review remains a separate follow-up; closing public access cannot establish
whether earlier data was viewed or copied.

Run the static bookmark checks with `node --test test/*.test.cjs`.
