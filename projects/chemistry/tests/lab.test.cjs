'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const lab = require('../dist/lab.js');

// Pure state transitions complement integration.test.cjs (DOM) and
// cross-module.test.cjs (independently computed chemistry quantities).
const copy = value => JSON.parse(JSON.stringify(value));
const experiment = id => lab.experiments.find(e => e.id === id);
function apply(state, action) { return lab.reduce(state, action); }
function prepared(id, overrides = {}) {
  const e = experiment(id);
  let state = lab.createState(id);
  for (const gear of e.gear) state = apply(state, { type: 'PLACE_GEAR', id: gear });
  for (const [a, b] of e.links) state = apply(state, { type: 'CONNECT', a, b });
  for (const reagent of e.reagents) {
    if (reagent.optional && !(reagent.id in overrides)) continue;
    state = apply(state, { type: 'ADD_MATERIAL', id: reagent.id, target: reagent.target, amount: overrides[reagent.id] ?? reagent.amount });
    assert.notEqual(state.feedback.type, 'error', `${id}: ${state.feedback.text}`);
  }
  assert.equal(lab.validateSetup(state).ok, true, id);
  return state;
}
function running(id = 'oxygen-peroxide') {
  let state = prepared(id);
  state = apply(state, { type: 'PREDICT', index: 0 });
  for (const op of experiment(id).operations) state = apply(state, { type: 'OPERATE', id: op.id });
  assert.equal(state.phase, 'running');
  return state;
}
function withoutFeedback(state) { const value = copy(state); delete value.feedback; return value; }
function rejected(state, action) {
  const before = copy(state), next = apply(state, action);
  assert.equal(next.feedback.type, 'error', `Expected rejection: ${JSON.stringify(action)}`);
  assert.deepEqual(withoutFeedback(next), withoutFeedback(before), 'Rejected action changed experiment state');
  assert.deepEqual(state, before, 'Reducer mutated its input');
  return next;
}
function near(actual, expected, tolerance = 1e-10) { assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance, `${actual} ≈ ${expected}`); }
function freezeTree(value) { if (value && typeof value === 'object') { Object.values(value).forEach(freezeTree); Object.freeze(value); } return value; }

test('12 experiment recipes contain valid apparatus, materials, targets, ranges and ordered operations', () => {
  assert.equal(lab.experiments.length, 12);
  assert.equal(new Set(lab.experiments.map(e => e.id)).size, 12);
  for (const e of lab.experiments) {
    assert.ok(e.operations.length >= 2);
    assert.equal(new Set(e.operations.map(o => o.id)).size, e.operations.length);
    for (const id of e.gear) assert.ok(lab.apparatus[id]);
    for (const r of e.reagents) {
      assert.ok(lab.materials[r.id]); assert.ok(e.gear.includes(r.target));
      assert.ok(r.min > 0 && r.amount >= r.min && r.amount <= r.max);
    }
    assert.equal(lab.validateSetup(prepared(e.id)).ok, true);
  }
});

test('invalid experiment/state/action identifiers fail explicitly and unknown actions do not mutate state', () => {
  assert.throws(() => lab.createState('unknown'), RangeError);
  assert.throws(() => apply(null, { type: 'RESET' }), TypeError);
  assert.throws(() => apply(lab.createState(), {}), TypeError);
  rejected(lab.createState(), { type: 'UNKNOWN' });
});

test('every experiment refuses operation before setup and before a prediction is recorded', () => {
  for (const e of lab.experiments) {
    rejected(lab.createState(e.id), { type: 'OPERATE', id: e.operations[0].id });
    const state = prepared(e.id);
    rejected(state, { type: 'OPERATE', id: e.operations[0].id });
    for (const index of [-1, 0.5, e.options.length, NaN]) rejected(state, { type: 'PREDICT', index });
  }
});

test('all 12 recipes reject skipped or repeated operations while keeping the prescribed next step', () => {
  for (const e of lab.experiments) {
    let state = apply(prepared(e.id), { type: 'PREDICT', index: 1 });
    rejected(state, { type: 'OPERATE', id: e.operations.at(-1).id });
    state = apply(state, { type: 'OPERATE', id: e.operations[0].id });
    assert.equal(state.phase, 'setup'); assert.equal(state.progress, 0);
    rejected(state, { type: 'OPERATE', id: e.operations[0].id });
    assert.equal(lab.getGuide(state).id, e.operations[1].id);
  }
});

test('editing preparation after a preliminary operation resets the operation sequence', () => {
  let state = apply(prepared('oxygen-peroxide'), { type: 'PREDICT', index: 0 });
  state = apply(state, { type: 'OPERATE', id: 'check' });
  state = apply(state, { type: 'ADD_MATERIAL', id: 'peroxide', target: 'flask', amount: 1 });
  assert.deepEqual(state.performed, []); assert.equal(state.prediction, 0);
  rejected(state, { type: 'OPERATE', id: 'release' });
  assert.equal(lab.getGuide(state).id, 'check');
});

test('running experiments lock chemistry configuration while allowing schematic movement and playback speed', () => {
  const state = running();
  for (const action of [
    { type: 'ADD_MATERIAL', id: 'peroxide', target: 'flask', amount: 1 },
    { type: 'REMOVE_MATERIAL', id: 'peroxide', target: 'flask' },
    { type: 'PLACE_GEAR', id: 'beaker' }, { type: 'REMOVE_GEAR', id: 'flask' },
    { type: 'DISCONNECT', key: state.connections[0].key },
    { type: 'SET_CONTROL', name: 'fraction', value: 70 }, { type: 'PREDICT', index: 2 },
    { type: 'UNDO' }
  ]) rejected(state, action);
  const moved = apply(state, { type: 'MOVE_GEAR', id: 'flask', x: -1000, y: 1000 });
  assert.deepEqual(moved.gear.flask, { x: 108, y: 355 });
  assert.deepEqual(lab.calculateResult(moved), lab.calculateResult(state));
  assert.equal(apply(state, { type: 'SET_CONTROL', name: 'speed', value: 4 }).controls.speed, 4);
});

test('done experiments require a restart before changing materials', () => {
  const done = apply(running(), { type: 'TICK', ms: 1e6 });
  assert.equal(done.phase, 'done');
  rejected(done, { type: 'ADD_MATERIAL', id: 'peroxide', target: 'flask', amount: 1 });
  const again = apply(done, { type: 'RESTART' });
  assert.equal(apply(again, { type: 'ADD_MATERIAL', id: 'peroxide', target: 'flask', amount: 1 }).contents.flask.peroxide, 11);
});

test('every recipe material accepts its declared endpoints and rejects values outside its range', () => {
  for (const e of lab.experiments) for (const r of e.reagents) {
    const base = apply(lab.createState(e.id), { type: 'PLACE_GEAR', id: r.target });
    for (const amount of [r.min, r.max]) {
      const next = apply(base, { type: 'ADD_MATERIAL', id: r.id, target: r.target, amount });
      assert.equal(next.contents[r.target][r.id], amount, `${e.id}/${r.id}`);
    }
    for (const amount of [r.min / 2, r.max + 1, -1, 0, Infinity, NaN, ''])
      rejected(base, { type: 'ADD_MATERIAL', id: r.id, target: r.target, amount });
  }
});

test('repeated additions use cumulative quantities and cannot exceed the container material limit', () => {
  let state = apply(lab.createState(), { type: 'PLACE_GEAR', id: 'flask' });
  for (let i = 0; i < 3; i++) state = apply(state, { type: 'ADD_MATERIAL', id: 'peroxide', target: 'flask', amount: 10 });
  assert.equal(state.contents.flask.peroxide, 30);
  rejected(state, { type: 'ADD_MATERIAL', id: 'peroxide', target: 'flask', amount: 0.1 });
});

test('accepted floating-point endpoint tolerance is normalized to a valid material quantity', () => {
  let state = prepared('oxygen-peroxide');
  state = apply(state, { type: 'REMOVE_MATERIAL', id: 'peroxide', target: 'flask' });
  state = apply(state, { type: 'ADD_MATERIAL', id: 'peroxide', target: 'flask', amount: 30 + 9e-10 });
  assert.equal(state.feedback.type, 'success');
  assert.equal(state.contents.flask.peroxide, 30);
  assert.equal(lab.validateSetup(state).ok, true);
});

test('portions require integers and unknown material/container combinations remain unsupported', () => {
  const state = prepared('oxygen-peroxide');
  rejected(state, { type: 'ADD_MATERIAL', id: 'catalyst', target: 'flask', amount: 0.5 });
  const wrong = rejected(state, { type: 'ADD_MATERIAL', id: 'hcl', target: 'flask', amount: 1 });
  assert.match(wrong.feedback.text, /尚未支持/); assert.match(wrong.feedback.text, /不能据此判断现实是否反应/);
  rejected(state, { type: 'ADD_MATERIAL', id: 'unknown', target: 'flask', amount: 1 });
  rejected(state, { type: 'ADD_MATERIAL', id: 'peroxide', target: 'receiver', amount: 1 });
});

test('removing apparatus also removes its contents and connections; undo restores a complete valid setup', () => {
  const original = prepared('distillation');
  const state = apply(original, { type: 'REMOVE_GEAR', id: 'flask' });
  assert.equal(state.gear.flask, undefined); assert.equal(state.contents.flask, undefined);
  assert.equal(state.connections.some(c => [c.a, c.b].some(p => p.startsWith('flask.'))), false);
  assert.equal(lab.validateSetup(state).ok, false);
  const restored = apply(state, { type: 'UNDO' });
  assert.deepEqual(restored.gear, original.gear); assert.deepEqual(restored.contents, original.contents);
  assert.deepEqual(restored.connections, original.connections); assert.equal(lab.validateSetup(restored).ok, true);
});

test('removing a required material invalidates preparation and undo restores its exact quantity', () => {
  const original = prepared('neutralization');
  const state = apply(original, { type: 'REMOVE_MATERIAL', id: 'hcl', target: 'beaker' });
  assert.equal(lab.validateSetup(state).ok, false);
  assert.equal(lab.getGuide(state).id, 'hcl');
  assert.deepEqual(apply(state, { type: 'UNDO' }).contents, original.contents);
});

test('connection direction follows physical port identities even when the destination is selected first', () => {
  let state = lab.createState('distillation');
  for (const id of experiment('distillation').gear) state = apply(state, { type: 'PLACE_GEAR', id });
  state = apply(state, { type: 'CONNECT', a: 'condenser.cool-low', b: 'cooling-water.out' });
  assert.equal(state.connections[0].a, 'cooling-water.out');
  assert.equal(state.connections[0].b, 'condenser.cool-low');
  const duplicate = apply(state, { type: 'CONNECT', a: 'cooling-water.out', b: 'condenser.cool-low' });
  assert.equal(duplicate.connections.length, 1); assert.equal(duplicate.feedback.type, 'info');
});

test('wrong cooling-water connections and reversed electrode polarity are blocked with useful feedback', () => {
  const setups = [
    ['distillation', 'cooling-water.out', 'condenser.cool-high', /低口/],
    ['distillation', 'cooling-water.out', 'condenser.vapor-in', /外套/],
    ['electrolysis', 'battery.negative', 'electrolyzer.anode', /负极连阴极/]
  ];
  for (const [id, a, b, pattern] of setups) {
    let state = lab.createState(id);
    for (const gear of experiment(id).gear) state = apply(state, { type: 'PLACE_GEAR', id: gear });
    assert.match(rejected(state, { type: 'CONNECT', a, b }).feedback.text, pattern);
    rejected(state, { type: 'CONNECT', a, b: a });
  }
});

test('model controls enforce finite bounds, integer heat settings and available options', () => {
  for (const [id, name, lo, hi] of [['distillation', 'fraction', 10, 70], ['distillation', 'heat', 1, 3], ['electrolysis', 'charge', 40, 1200]]) {
    const state = lab.createState(id);
    for (const value of [lo, hi]) assert.equal(apply(state, { type: 'SET_CONTROL', name, value }).controls[name], value);
    for (const value of [lo - 1, hi + 1, Infinity, NaN, '']) rejected(state, { type: 'SET_CONTROL', name, value });
  }
  rejected(lab.createState('distillation'), { type: 'SET_CONTROL', name: 'heat', value: 1.5 });
  rejected(lab.createState('oxygen-peroxide'), { type: 'SET_CONTROL', name: 'fraction', value: 50 });
  rejected(lab.createState('phosphorus'), { type: 'SET_CONTROL', name: 'oxygen', value: 'maybe' });
  rejected(lab.createState('phosphorus'), { type: 'SET_CONTROL', name: 'charge', value: 100 });
});

test('more catalyst accelerates the demonstration without increasing theoretical oxygen yield', () => {
  const slow = prepared('oxygen-peroxide', { catalyst: 1 });
  const fast = prepared('oxygen-peroxide', { catalyst: 3 });
  assert.ok(lab.duration(fast) < lab.duration(slow));
  assert.deepEqual(lab.calculateResult(fast).products, lab.calculateResult(slow).products);
  assert.deepEqual(lab.calculateResult(fast).mass, lab.calculateResult(slow).mass);
});

test('virtual heating speed does not change the selected distillation recovery or oxygen stoichiometry', () => {
  for (const id of ['distillation', 'oxygen-permanganate']) {
    const slow = prepared(id), fast = apply(slow, { type: 'SET_CONTROL', name: 'heat', value: 3 });
    assert.ok(lab.duration(fast) < lab.duration(slow));
    assert.deepEqual(lab.calculateResult(fast), lab.calculateResult(slow));
  }
});

test('invalid clock increments and playback speeds cannot corrupt progress', () => {
  const state = running();
  for (const ms of [-1, NaN, Infinity]) rejected(state, { type: 'TICK', ms });
  for (const value of [0, -1, 3, 8, NaN, Infinity]) rejected(state, { type: 'SET_CONTROL', name: 'speed', value });
  assert.equal(apply(state, { type: 'TICK', ms: 0 }).progress, 0);
  const fast = apply(state, { type: 'SET_CONTROL', name: 'speed', value: 4 });
  near(apply(fast, { type: 'TICK', ms: 100 }).elapsed, 400);
});

test('pause holds the exact clock and overshoot ends once at 100 percent', () => {
  const state = apply(running(), { type: 'TICK', ms: 100 });
  const paused = apply(state, { type: 'PAUSE' });
  assert.strictEqual(apply(paused, { type: 'TICK', ms: 1e6 }), paused);
  const done = apply(apply(paused, { type: 'PAUSE' }), { type: 'TICK', ms: 1e6 });
  assert.equal(done.phase, 'done'); assert.equal(done.progress, 1); near(done.elapsed, lab.duration(done));
  assert.strictEqual(apply(done, { type: 'TICK', ms: 1000 }), done);
  assert.equal(lab.getGuide(done).stage, 'done');
});

test('restart keeps the experimental comparison inputs but clears prediction, progress and performed steps', () => {
  let state = running('distillation');
  state = apply(state, { type: 'SET_CONTROL', name: 'speed', value: 4 });
  state = apply(state, { type: 'TICK', ms: 400 });
  const again = apply(state, { type: 'RESTART' });
  for (const key of ['gear', 'contents', 'connections', 'controls']) assert.deepEqual(again[key], state[key]);
  assert.equal(again.phase, 'setup'); assert.equal(again.progress, 0); assert.equal(again.elapsed, 0);
  assert.equal(again.prediction, null); assert.equal(again.paused, false); assert.deepEqual(again.performed, []); assert.deepEqual(again.history, []);
});

test('reset empties the workbench and switching recipes cannot leak previous materials or controls', () => {
  const state = running('distillation');
  const reset = apply(state, { type: 'RESET' });
  assert.deepEqual(reset, lab.createState('distillation'));
  const switched = apply(state, { type: 'RESET', experimentId: 'phosphorus' });
  assert.deepEqual(switched, lab.createState('phosphorus'));
});

test('reducer transitions work with deeply frozen inputs and undo does not alias restored contents', () => {
  const initial = freezeTree(prepared('oxygen-peroxide'));
  const changed = apply(initial, { type: 'ADD_MATERIAL', id: 'peroxide', target: 'flask', amount: 1 });
  assert.equal(initial.contents.flask.peroxide, 10); assert.equal(changed.contents.flask.peroxide, 11);
  const undo = apply(freezeTree(changed), { type: 'UNDO' });
  assert.equal(undo.contents.flask.peroxide, 10);
  undo.contents.flask.peroxide = 12;
  assert.equal(initial.contents.flask.peroxide, 10); assert.equal(changed.contents.flask.peroxide, 11);
});

test('the phosphorus scenario exposes conceptual oxygen choice and no quantitative product recipe', () => {
  const e = experiment('phosphorus'); assert.equal(e.virtualOnly, true);
  assert.deepEqual(e.controls, ['oxygen']); assert.ok(e.reagents.every(r => r.unit === '份' && r.min === 1 && r.max === 1));
  let state = prepared('phosphorus');
  const withOxygen = lab.calculateResult(state);
  state = apply(state, { type: 'SET_CONTROL', name: 'oxygen', value: 'absent' });
  const withoutOxygen = lab.calculateResult(state);
  assert.equal(withOxygen.burning, true); assert.equal(withoutOxygen.burning, false);
  for (const r of [withOxygen, withoutOxygen]) { assert.equal(r.kind, 'qualitative'); assert.equal(r.mass, undefined); assert.equal(r.products, undefined); }
});
