const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
function renderData({name,location,notes,label}) {
  const start = source.indexOf('let steps = []');
  const end = source.indexOf('// ── INIT ──', start);
  const elements = {};
  const chain = {on(){return this},subscribe(){return this}};
  const context = {console, sb:{channel(){return chain}}, document:{
    activeElement:null,
    getElementById(id){return elements[id] ||= {innerHTML:'',style:{}}},
  }};
  vm.createContext(context);
  vm.runInContext(source.slice(start,end),context);
  vm.runInContext('steps='+JSON.stringify([{id:'11111111-1111-4111-8111-111111111111',label,required:true}])+
    ';franchisees='+JSON.stringify([{id:'22222222-2222-4222-8222-222222222222',name,location,notes}])+
    ';render();renderEditor();',context);
  return {grid:elements.grid.innerHTML,editor:elements.stepsEditor.innerHTML};
}
test('stored markup stays text in cards, notes and labels',()=>{
  const attack='<img src=x onerror="window.testMarker=1">';
  const r=renderData({name:attack,location:attack,label:attack,notes:'</textarea>'+attack+'<textarea>'});
  for(const html of [r.grid,r.editor]) {
    assert.ok(!html.includes('<img'));
    assert.ok(html.includes('&lt;img'));
  }
  assert.ok(r.grid.includes('&lt;/textarea&gt;'));
  assert.equal((r.grid.match(/<textarea\b/g)||[]).length,1);
  assert.equal((r.grid.match(/<\/textarea>/g)||[]).length,1);
});
test('a saved label cannot break out of the editor input attribute',()=>{
  const r=renderData({name:'Lab',location:'Lab',label:'" autofocus onfocus="window.testMarker=1',notes:''});
  assert.ok(r.editor.includes('value="&quot; autofocus onfocus=&quot;window.testMarker=1"'));
  assert.ok(!r.editor.includes('value="" autofocus'));
});
test('ordinary business text and multiline notes are preserved as text',()=>{
  const r=renderData({name:'A & B',location:'O\'Fallon',label:'Sign <agreement>',notes:'First line\nSecond line'});
  assert.ok(r.grid.includes('A &amp; B'));
  assert.ok(r.grid.includes('O&#39;Fallon'));
  assert.ok(r.grid.includes('First line\nSecond line'));
  assert.ok(r.editor.includes('Sign &lt;agreement&gt;'));
});
