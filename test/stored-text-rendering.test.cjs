const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync(new URL('../index.html',`file://${__filename}`),'utf8');
test('legacy bookmark points only to the fixed protected dashboard route',()=>{
  const destination='https://aira-admin-three.vercel.app/franchisee-onboarding';
  assert.ok(html.includes(`0;url=${destination}`));
  assert.ok(html.includes(`href="${destination}"`));
  assert.ok(html.includes('Super Admin → Franchisee Onboarding'));
});
test('legacy page contains no sign-in, database client, executable script or key',()=>{
  assert.doesNotMatch(html,/<script|supabase|localStorage|access_token|service_role|eyJ/i);
  assert.match(html,/default-src 'none'/);
  assert.match(html,/name="referrer" content="no-referrer"/);
});
