'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const data = require('../dist/data.js');
const core = require('../dist/core.js');

function near(actual, expected, absolute = 1e-9) {
  assert.ok(Number.isFinite(actual), `Expected finite number, received ${actual}`);
  assert.ok(Math.abs(actual - expected) <= absolute, `${actual} differs from independently expected ${expected} by > ${absolute}`);
}
function byId(id) { return data.reactions.find(r => r.id === id); }
function product(result, formula) { return result.products.find(s => s.formula === formula); }
function reactant(result, formula) { return result.reactants.find(s => s.formula === formula); }
function input(value, unit = 'mol') { return { value, unit }; }

test('118 elements have consecutive unique atomic numbers, symbols, Chinese names and positions', () => {
  assert.equal(data.elements.length, 118);
  assert.deepEqual(data.elements.map(e => e.number), Array.from({ length: 118 }, (_, i) => i + 1));
  for (const field of ['symbol', 'name']) assert.equal(new Set(data.elements.map(e => e[field])).size, 118);
  assert.equal(new Set(data.elements.map(e => `${e.position.row}:${e.position.col}`)).size, 118);
  for (const e of data.elements) {
    assert.ok(/^[A-Z][a-z]?$/.test(e.symbol), e.symbol);
    assert.ok(e.period >= 1 && e.period <= 7, e.symbol);
    assert.ok(e.position.col >= 1 && e.position.col <= 18, e.symbol);
    assert.ok(data.categories[e.category], e.symbol);
    assert.ok(e.summary && e.properties && e.uses && e.kids && e.reference, e.symbol);
    assert.ok(['气态', '液态', '固态', '未知'].includes(e.phase), e.symbol);
    assert.ok(e.mass > 0 && Number.isFinite(e.mass), e.symbol);
    if (e.group === null) assert.ok((e.number >= 57 && e.number <= 71) || (e.number >= 89 && e.number <= 103));
    else assert.ok(e.group >= 1 && e.group <= 18);
  }
});

test('known independent periodic positions include helium and displaced f-block', () => {
  const expected = { H: [1, 1], He: [1, 18], B: [2, 13], Ne: [2, 18], Fe: [4, 8], Zn: [4, 12], Xe: [5, 18], Hf: [6, 4], Rn: [6, 18], Rf: [7, 4], Og: [7, 18] };
  for (const [symbol, position] of Object.entries(expected)) {
    const e = data.elements.find(e => e.symbol === symbol);
    assert.deepEqual([e.period, e.group], position, symbol);
  }
  assert.deepEqual(data.elements.find(e => e.symbol === 'La').position, { row: 9, col: 3 });
  assert.deepEqual(data.elements.find(e => e.symbol === 'Lu').position, { row: 9, col: 17 });
  assert.deepEqual(data.elements.find(e => e.symbol === 'Ac').position, { row: 10, col: 3 });
  assert.deepEqual(data.elements.find(e => e.symbol === 'Lr').position, { row: 10, col: 17 });
  assert.equal(data.elements.find(e => e.symbol === 'Og').phase, '未知');
});

test('standard atomic weights are distinguished from representative isotope mass numbers', () => {
  const get = symbol => data.elements.find(e => e.symbol === symbol);
  near(get('Zr').mass, 91.222);
  near(get('Gd').mass, 157.249);
  near(get('Lu').mass, 174.96669);
  assert.equal(get('Tc').massDisplay, '[97]');
  assert.equal(get('Lr').massDisplay, '[262]');
  assert.equal(get('Fl').massDisplay, '[290]');
  assert.equal(get('U').hasStandardWeight, true);
  assert.equal(get('Bi').hasStandardWeight, true);
  assert.equal(get('Tc').hasStandardWeight, false);
  for (const e of data.elements) assert.equal(e.massDisplay.startsWith('['), !e.hasStandardWeight);
  assert.throws(() => core.molarMass('TcO2'), /没有标准原子量/);
});

test('all data references resolve to unique sources and immutable records', () => {
  const ids = new Set(data.sources.map(s => s.id));
  assert.equal(ids.size, data.sources.length);
  for (const s of data.sources) assert.ok(s.url.startsWith('https://') && s.title && s.scope, s.id);
  for (const row of [...data.elements, ...data.reactions, ...data.isotopes, ...data.radiation]) {
    for (const id of row.sourceIds) assert.ok(ids.has(id), id);
    assert.ok(Object.isFrozen(row));
  }
  assert.ok(Object.isFrozen(data));
  assert.throws(() => { data.elements[0].mass = 2; }, TypeError);
});

const parseCases = [
  ['H2O', { H: 2, O: 1 }],
  ['CO2', { C: 1, O: 2 }],
  ['Ca(OH)2', { Ca: 1, O: 2, H: 2 }],
  ['(NH4)2SO4', { N: 2, H: 8, S: 1, O: 4 }],
  ['Fe2(SO4)3', { Fe: 2, S: 3, O: 12 }],
  ['K4[Fe(CN)6]', { K: 4, Fe: 1, C: 6, N: 6 }],
  ['CH3COOH', { C: 2, H: 4, O: 2 }],
  ['CH3COONa', { C: 2, H: 3, O: 2, Na: 1 }],
  ['CuSO4·5H2O', { Cu: 1, S: 1, O: 9, H: 10 }],
  ['Na2CO3·10H2O', { Na: 2, C: 1, O: 13, H: 20 }],
  ['H₂O', { H: 2, O: 1 }],
  ['  Ca(OH)₂  ', { Ca: 1, O: 2, H: 2 }],
  ['(OH)2(OH)2', { O: 4, H: 4 }],
  ['He', { He: 1 }],
  ['Og', { Og: 1 }],
  // 解析器只数原子，不凭化学式判断化合物是否存在；Na + N 都是合法符号。
  ['NaN', { Na: 1, N: 1 }]
];
for (const [formula, expected] of parseCases) {
  test(`formula parser independently counts ${formula}`, () => assert.deepEqual(core.parseFormula(formula), expected));
}

test('formula parser rejects malformed, unsupported and overflow inputs without partial parsing', () => {
  const invalid = ['', ' ', null, undefined, 42, NaN, {}, [], 'water', 'h2o', 'Xx2', 'H0', 'H02', 'H2O0', '0H2O', '2H2O', 'H2 O', 'H2\nO', 'H2O!', '(H2O', 'H2O)', 'Ca(OH]2', 'Ca()2', '[]', '[H2)', 'H2O+', 'Na+', 'SO4^2-', 'H2O(aq)', 'H2O.5', '·H2O', 'H2O·', 'H2O··H2O', 'H2O·0H2O', 'H2O·5', 'H1000001', '(H1000000)1000000', '('.repeat(17) + 'H' + ')'.repeat(17), 'H'.repeat(301), '<script>', 'Infinity', '__proto__'];
  for (const formula of invalid) assert.throws(() => core.parseFormula(formula), undefined, String(formula));
});

test('formula formatting retains hydrate coefficients on baseline', () => {
  assert.equal(core.formatFormula('Ca(OH)2'), 'Ca(OH)₂');
  assert.equal(core.formatFormula('CuSO4·5H2O'), 'CuSO₄·5H₂O');
  assert.equal(core.formatFormula('Na2CO3·10H2O'), 'Na₂CO₃·10H₂O');
});

test('molar masses match independent conventional arithmetic', () => {
  const expected = { H2O: 18.015, CO2: 44.009, H2O2: 34.014, 'Ca(OH)2': 74.092, '(NH4)2SO4': 132.134, 'CuSO4·5H2O': 249.677, NaHCO3: 84.00576928, CH3COOH: 60.052, CH3COONa: 82.03376928, KMnO4: 158.032343 };
  for (const [formula, mass] of Object.entries(expected)) near(core.molarMass(formula), mass, 1e-8);
});

test('every curated reaction is atom-balanced; catalysts remain outside stoichiometric reactants', () => {
  assert.ok(data.reactions.length >= 10);
  assert.equal(new Set(data.reactions.map(r => r.id)).size, data.reactions.length);
  for (const r of data.reactions) assert.equal(core.validateReaction(r).balanced, true, r.id);
  assert.equal(byId('peroxide').catalyst, 'MnO2');
  assert.ok(!byId('peroxide').reactants.some(s => s.formula === 'MnO2'));
  assert.equal(byId('phosphorus').quantitative, false);
});

test('atom counts for demanding equations match independent expected counts', () => {
  const expected = {
    peroxide: { H: 4, O: 4 },
    permanganate: { K: 2, Mn: 2, O: 8 },
    bicarbonate: { C: 3, H: 5, O: 5, Na: 1 },
    neutralization: { H: 2, Cl: 1, Na: 1, O: 1 },
    limewater: { C: 1, O: 4, Ca: 1, H: 2 },
    displacement: { Fe: 1, Cu: 1, S: 1, O: 4 },
    precipitation: { Ca: 1, Cl: 2, Na: 2, C: 1, O: 3 },
    electrolysis: { H: 4, O: 2 },
    phosphorus: { P: 4, O: 10 },
    combustion: { C: 1, H: 4, O: 4 },
    calcium_carbonate: { Ca: 1, C: 1, O: 3, H: 2, Cl: 2 },
    iron_oxide: { Fe: 4, O: 6 },
    silver_chloride: { Ag: 1, N: 1, O: 3, Na: 1, Cl: 1 },
    hydrogen_water: { H: 4, O: 2 }
  };
  for (const [id, counts] of Object.entries(expected)) {
    const result = core.validateReaction(id);
    assert.deepEqual(result.reactants, counts, id);
    assert.deepEqual(result.products, counts, id);
  }
});

test('unbalanced reactions are detected and cannot produce quantities', () => {
  const wrong = { reactants: [{ formula: 'H2', coefficient: 1 }, { formula: 'O2', coefficient: 1 }], products: [{ formula: 'H2O', coefficient: 1 }] };
  assert.deepEqual(core.validateReaction(wrong).differences, { O: -1 });
  assert.equal(core.validateReaction(wrong).balanced, false);
  assert.throws(() => core.stoichiometry(wrong, { H2: input(1), O2: input(1) }), /没有配平/);
});

test('malformed reaction data cannot bypass balance validation', () => {
  const h = { formula: 'H2', coefficient: 1 };
  const invalid = [null, {}, 'not-a-reaction', { reactants: [], products: [h] }, { reactants: [h], products: [] }, { reactants: [{ formula: 'H2', coefficient: 0 }], products: [h] }, { reactants: [{ formula: 'H2', coefficient: -1 }], products: [h] }, { reactants: [{ formula: 'H2', coefficient: 1.5 }], products: [h] }, { reactants: [{ formula: 'H2', coefficient: NaN }], products: [h] }, { reactants: [h, h], products: [h] }];
  for (const value of invalid) assert.throws(() => core.validateReaction(value));
});

test('68.028 g pure hydrogen peroxide gives 31.998 g oxygen and 36.030 g water', () => {
  const result = core.stoichiometry('peroxide', { H2O2: input(68.028, 'g') });
  near(result.extent, 1);
  assert.deepEqual(result.limiting, ['H2O2']);
  near(product(result, 'O2').theoreticalMol, 1);
  near(product(result, 'O2').theoreticalGrams, 31.998);
  near(product(result, 'H2O').theoreticalGrams, 36.030);
  near(product(result, 'O2').gasVolumeL, 24.4654036970381);
  assert.equal(product(result, 'H2O').gasVolumeL, null);
  near(result.massBalance.errorGrams, 0);
});

test('158.032343 g permanganate gives half a mole of oxygen', () => {
  const result = core.stoichiometry('permanganate', { KMnO4: input(158.032343, 'g') });
  near(product(result, 'O2').theoreticalMol, 0.5);
  near(product(result, 'O2').theoreticalGrams, 15.999);
  near(product(result, 'K2MnO4').theoreticalGrams, 98.5653215);
  near(product(result, 'MnO2').theoreticalGrams, 43.4680215);
});

test('limiting bicarbonate leaves one mole acetic acid and gives one mole CO2', () => {
  const result = core.stoichiometry('bicarbonate', { CH3COOH: input(120.104, 'g'), NaHCO3: input(84.00576928, 'g') });
  assert.deepEqual(result.limiting, ['NaHCO3']);
  near(reactant(result, 'CH3COOH').leftoverMol, 1);
  near(reactant(result, 'CH3COOH').leftoverGrams, 60.052);
  near(product(result, 'CO2').theoreticalGrams, 44.009);
  near(product(result, 'CH3COONa').theoreticalGrams, 82.03376928);
  near(result.massBalance.inputGrams, 204.10976928);
  near(result.massBalance.errorGrams, 0);
});

test('reversing the limiting reactant reverses the leftover identity', () => {
  const result = core.stoichiometry('bicarbonate', { CH3COOH: input(0.25), NaHCO3: input(2) });
  assert.deepEqual(result.limiting, ['CH3COOH']);
  near(reactant(result, 'NaHCO3').leftoverMol, 1.75);
  near(product(result, 'CO2').theoreticalMol, 0.25);
});

test('3 mol hydrogen plus 1 mol oxygen forms 2 mol water leaving 1 mol hydrogen', () => {
  const result = core.stoichiometry('hydrogen_water', { H2: input(3), O2: input(1) });
  assert.deepEqual(result.limiting, ['O2']);
  near(product(result, 'H2O').theoreticalGrams, 36.03);
  near(reactant(result, 'H2').leftoverMol, 1);
  near(reactant(result, 'H2').leftoverGrams, 2.016);
  near(result.massBalance.inputGrams, 38.046);
});

test('exact ratio correctly reports both co-limiting reactants', () => {
  const result = core.stoichiometry('hydrogen_water', { H2: input(2), O2: input(1) });
  assert.deepEqual(result.limiting, ['H2', 'O2']);
  near(result.massBalance.leftoverGrams, 0);
});

test('zero input prevents reaction while preserving unreacted mass', () => {
  const result = core.stoichiometry('hydrogen_water', { H2: input(0), O2: input(3) });
  assert.equal(result.extent, 0);
  assert.deepEqual(result.limiting, ['H2']);
  near(product(result, 'H2O').theoreticalMol, 0);
  near(reactant(result, 'O2').leftoverMol, 3);
  near(result.massBalance.finalGrams, 95.994);
  const allZero = core.stoichiometry('hydrogen_water', { H2: input(0), O2: input(0) });
  assert.deepEqual(allZero.limiting, ['H2', 'O2']);
  near(allZero.massBalance.finalGrams, 0);
});

test('80 percent recovery accounts for uncollected products and does not invent leftover reactants', () => {
  const result = core.stoichiometry('peroxide', { H2O2: input(2) }, { yieldPercent: 80 });
  near(product(result, 'O2').actualMol, 0.8);
  near(product(result, 'O2').actualGrams, 25.5984);
  near(product(result, 'O2').unrecoveredGrams, 6.3996);
  near(reactant(result, 'H2O2').leftoverGrams, 0);
  near(result.massBalance.actualProductsGrams, 54.4224);
  near(result.massBalance.unrecoveredProductsGrams, 13.6056);
  near(result.massBalance.finalGrams, 68.028);
});

test('zero percent recovery still conserves all generated material as uncollected products', () => {
  const result = core.stoichiometry('peroxide', { H2O2: input(2) }, { yieldPercent: 0 });
  near(product(result, 'O2').gasVolumeL, 0);
  near(product(result, 'O2').theoreticalGasVolumeL, 24.4654036970381);
  near(result.massBalance.actualProductsGrams, 0);
  near(result.massBalance.unrecoveredProductsGrams, 68.028);
  near(result.massBalance.errorGrams, 0);
});

test('electrolysis has a 2 to 1 dry gas volume ratio at the same conditions', () => {
  const result = core.stoichiometry('electrolysis', { H2O: input(2) });
  near(product(result, 'H2').theoreticalMol, 2);
  near(product(result, 'O2').theoreticalMol, 1);
  near(product(result, 'H2').gasVolumeL / product(result, 'O2').gasVolumeL, 2);
});

test('every reaction conserves mass across ratios and recovery fractions', () => {
  const ratios = [0, 0.0001, 0.1, 1, 1.7, 10];
  for (const reaction of data.reactions) {
    for (const ratio of ratios) {
      const inputs = Object.fromEntries(reaction.reactants.map((s, i) => [s.formula, input((i + 1) * ratio)]));
      for (const recovery of [0, 37, 100]) {
        const result = core.stoichiometry(reaction, inputs, { yieldPercent: recovery });
        near(result.massBalance.inputGrams, result.massBalance.finalGrams, 1e-8);
        for (const s of result.reactants) {
          assert.ok(s.leftoverMol >= 0 && s.consumedMol >= 0, reaction.id);
          near(s.inputMol, s.consumedMol + s.leftoverMol, 1e-10);
        }
        for (const s of result.products) near(s.theoreticalGrams, s.actualGrams + s.unrecoveredGrams, 1e-9);
      }
    }
  }
});

test('tiny nonzero quantities are not treated as zero or incorrectly co-limiting', () => {
  const result = core.stoichiometry('hydrogen_water', { H2: input(2e-20), O2: input(2e-20) });
  assert.deepEqual(result.limiting, ['H2']);
  near(product(result, 'H2O').theoreticalMol / 1e-20, 2);
  near(reactant(result, 'O2').leftoverMol / 1e-20, 1);
});

test('stoichiometry rejects negative, NaN, missing, unknown, infinite and wrong-unit inputs', () => {
  for (const value of [-1, NaN, Infinity, -Infinity, '2', null, undefined, 1e13]) {
    assert.throws(() => core.stoichiometry('peroxide', { H2O2: input(value) }));
  }
  for (const inputs of [null, [], {}, { H2O2: 2 }, { H2O2: input(2, 'kg') }, { H2O2: input(2), MnO2: input(1) }]) {
    assert.throws(() => core.stoichiometry('peroxide', inputs));
  }
  assert.throws(() => core.stoichiometry('neutralization', { HCl: input(1) }));
  for (const options of [null, [], { yieldPercent: -1 }, { yieldPercent: 101 }, { yieldPercent: NaN }, { yieldPercent: '80' }, { temperatureC: -273.15 }, { temperatureC: Infinity }, { pressureKPa: 0 }, { pressureKPa: -1 }, { pressureKPa: NaN }]) {
    assert.throws(() => core.stoichiometry('peroxide', { H2O2: input(2) }, options));
  }
});

test('ideal gas volumes match independent molar volumes and pressure scaling', () => {
  near(core.idealGasVolume(1, 0, 101.325), 22.413969545014, 1e-10);
  near(core.idealGasVolume(1, 25, 101.325), 24.4654036970381, 1e-10);
  near(core.idealGasVolume(2, 25, 202.650), 24.4654036970381, 1e-10);
  near(core.idealGasVolume(0), 0);
  for (const args of [[-1], [NaN], [Infinity], [1, -273.15], [1, -300], [1, 25, 0], [1, 25, -1], [1, 25, Infinity], [1, '25'], [1, 25, NaN]]) {
    assert.throws(() => core.idealGasVolume(...args));
  }
});

test('electron shells contain exactly the first 20 electron counts', () => {
  const expected = [[], [1], [2], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 8, 1], [2, 8, 2], [2, 8, 3], [2, 8, 4], [2, 8, 5], [2, 8, 6], [2, 8, 7], [2, 8, 8], [2, 8, 8, 1], [2, 8, 8, 2]];
  for (let count = 0; count <= 20; count++) {
    assert.deepEqual(core.electronShells(count), expected[count]);
    assert.equal(core.electronShells(count).reduce((a, b) => a + b, 0), count);
  }
  for (const value of [-1, 21, 2.2, NaN, Infinity, '2', null]) assert.throws(() => core.electronShells(value));
});

test('atomic identity is set by protons, isotope by neutrons, and charge by electrons', () => {
  const carbon12 = core.atomicIdentity(6, 6, 6);
  assert.equal(carbon12.symbol, 'C');
  assert.equal(carbon12.massNumber, 12);
  assert.equal(carbon12.charge, 0);
  assert.equal(carbon12.stability, 'stable');
  const carbon14 = core.atomicIdentity(6, 8, 6);
  assert.equal(carbon14.symbol, 'C');
  assert.equal(carbon14.massNumber, 14);
  assert.equal(carbon14.stability, 'radioactive');
  const sodiumIon = core.atomicIdentity(11, 12, 10);
  assert.equal(sodiumIon.symbol, 'Na');
  assert.equal(sodiumIon.charge, 1);
  assert.deepEqual(sodiumIon.shells, [2, 8]);
  const chloride = core.atomicIdentity(17, 18, 18);
  assert.equal(chloride.charge, -1);
  assert.equal(chloride.isotope.id, 'Cl-35');
});

test('unlisted nuclear compositions are unknown instead of guessed stable', () => {
  assert.equal(core.atomicIdentity(2, 0, 2).stability, 'unknown');
  assert.equal(core.atomicIdentity(6, 40, 6).stability, 'unknown');
  assert.equal(core.atomicIdentity(6, 7, 0).stability, 'stable');
  for (const args of [[0, 0, 0], [21, 20, 20], [6, -1, 6], [6, 41, 6], [6, 6, 21], [6.1, 6, 6], [NaN, 6, 6]]) assert.throws(() => core.atomicIdentity(...args));
});

test('isotope records have consistent identities and accurately scoped half-lives', () => {
  assert.equal(new Set(data.isotopes.map(i => i.id)).size, data.isotopes.length);
  for (const isotope of data.isotopes) {
    assert.equal(isotope.massNumber, isotope.protons + isotope.neutrons);
    assert.equal(isotope.number, data.elements.find(e => e.symbol === isotope.symbol).number);
    assert.equal(isotope.protons, isotope.number);
    if (isotope.stable) { assert.equal(isotope.halfLifeYears, null); assert.equal(isotope.decayMode, null); }
    else assert.ok(isotope.halfLifeYears > 0);
  }
  const get = id => data.isotopes.find(i => i.id === id);
  assert.equal(get('H-1').stable, true);
  assert.equal(get('H-2').stable, true);
  assert.equal(get('H-3').stable, false);
  near(get('C-14').halfLifeYears, 5730);
  near(get('Co-60').halfLifeYears, 5.27);
  near(get('U-238').halfLifeYears, 4.47e9);
});

test('half-life function gives 100, 50, 25, 12.5 across successive half-lives', () => {
  near(core.decayRemaining(100, 0, 5730), 100);
  near(core.decayRemaining(100, 5730, 5730), 50);
  near(core.decayRemaining(100, 11460, 5730), 25);
  near(core.decayRemaining(100, 17190, 5730), 12.5);
  near(core.decayRemaining(0, 12, 1), 0);
  near(core.decayRemaining(100, 1e9, 1), 0);
  near(core.decayRemaining(1, 2.635, 5.27), Math.SQRT1_2);
});

test('decay probability has memoryless interval composition and stable small time behavior', () => {
  near(core.decayProbability(5.27, 5.27), 0.5);
  near(core.decayProbability(0, 5.27), 0);
  const p1 = core.decayProbability(1, 5.27), p2 = core.decayProbability(2, 5.27);
  near((1 - p1) * (1 - p2), 1 - core.decayProbability(3, 5.27));
  assert.ok(core.decayProbability(1e-20, 1) > 0);
  for (const args of [[-1, 1, 1], [1, -1, 1], [1, 1, 0], [1, 1, -1], [NaN, 1, 1], [1, Infinity, 1], [1, 1, NaN]]) assert.throws(() => core.decayRemaining(...args));
  for (const args of [[-1, 1], [1, 0], [1, NaN], [Infinity, 1]]) assert.throws(() => core.decayProbability(...args));
});

test('nuclear conservation rules correctly transform alpha, beta-minus and gamma', () => {
  const alpha = core.decayTransform({ number: 92, massNumber: 238 }, 'alpha');
  assert.equal(alpha.id, 'Th-234');
  assert.equal(alpha.protons, 90);
  assert.equal(alpha.neutrons, 144);
  const beta = core.decayTransform({ number: 6, massNumber: 14 }, 'beta-');
  assert.equal(beta.id, 'N-14');
  assert.equal(beta.neutrons, 7);
  assert.match(beta.emitted, /反中微子/);
  const gamma = core.decayTransform({ number: 28, massNumber: 60 }, 'gamma');
  assert.equal(gamma.id, 'Ni-60');
  assert.equal(gamma.excitationChanged, true);
  assert.equal(core.decayTransform({ number: 8, massNumber: 15 }, 'beta+').id, 'N-15');
  assert.equal(core.decayTransform({ number: 19, massNumber: 40 }, 'electron-capture').id, 'Ar-40');
});

test('known actual isotope decays use curated modes, including beta then gamma in cobalt-60', () => {
  assert.equal(core.isotopeAfterDecay('H-3').id, 'He-3');
  assert.equal(core.isotopeAfterDecay('C-14').id, 'N-14');
  assert.equal(core.isotopeAfterDecay('U-238').id, 'Th-234');
  const cobalt = core.isotopeAfterDecay('Co-60');
  assert.equal(cobalt.id, 'Ni-60');
  assert.equal(cobalt.mode, 'beta-');
  assert.equal(cobalt.gammaAfter, true);
  assert.throws(() => core.isotopeAfterDecay('C-12'), /稳定核素/);
  assert.throws(() => core.isotopeAfterDecay('C-999'));
  assert.equal(core.isotopeAfterDecay({ id: 'C-14', decayMode: 'alpha' }).mode, 'beta-');
});

test('invalid nuclear data and X-ray as a decay mode are rejected', () => {
  for (const args of [[null, 'alpha'], [{ number: 0, massNumber: 1 }, 'beta-'], [{ number: 92, massNumber: 80 }, 'alpha'], [{ number: 6, massNumber: 6 }, 'beta-'], [{ number: 1, massNumber: 1 }, 'alpha'], [{ number: 118, massNumber: 294 }, 'beta-'], [{ number: 6.5, massNumber: 14 }, 'beta-'], [{ number: 6, massNumber: NaN }, 'beta-'], [{ number: 6, massNumber: 14 }, 'xray']]) {
    assert.throws(() => core.decayTransform(...args));
  }
});

test('strong acid and base pH are independently correct at 0.1 mol/L', () => {
  near(core.solutionPH('strong-acid', 0.1).pH, 1, 1e-10);
  near(core.solutionPH('strong-base', 0.1).pH, 13, 1e-10);
  for (const kind of ['strong-acid', 'strong-base', 'weak-acid', 'water', 'salt', 'sugar']) near(core.solutionPH(kind, 0).pH, 7, 1e-12);
});

test('very dilute acid remains acidic when water autoionization is significant', () => {
  const dilute = core.solutionPH('strong-acid', 1e-8);
  near(dilute.pH, 6.97829431354289, 1e-10);
  assert.ok(dilute.pH < 7);
  const weak = core.solutionPH('weak-acid', 1e-10);
  assert.ok(weak.pH < 7 && weak.pH > 6.99);
  const base = core.solutionPH('strong-base', 1e-8);
  near(base.pH + dilute.pH, 14, 1e-12);
});

test('0.1 mol/L acetic acid has approximately pH 2.8753 and 1.33 percent ionization', () => {
  const acid = core.solutionPH('weak-acid', 0.1);
  near(acid.pH, 2.8752770603, 1e-9);
  near(acid.ionicFraction, 0.01332670969, 1e-10);
  near(acid.hydrogen * acid.ionized / (0.1 - acid.ionized), 1.8e-5, 1e-12);
  near(acid.hydrogen - acid.hydroxide - acid.ionized, 0, 1e-12);
  const dilute = core.solutionPH('weak-acid', 0.001);
  assert.ok(dilute.ionicFraction > acid.ionicFraction);
  assert.ok(dilute.pH > acid.pH);
});

test('neutral sodium chloride and sugar differ in mobile solute ions, not neutral pH', () => {
  const salt = core.solutionPH('salt', 0.1), sugar = core.solutionPH('sugar', 0.1);
  near(salt.pH, 7);
  near(sugar.pH, 7);
  assert.equal(salt.ionicFraction, 1);
  assert.equal(sugar.ionicFraction, 0);
  assert.equal(salt.conductivityClass, 'strong-electrolyte');
  assert.equal(sugar.conductivityClass, 'nonelectrolyte');
});

test('all acidity models satisfy water ion product and valid ionization fractions across concentrations', () => {
  for (const c of [0, 1e-12, 1e-8, 1e-6, 0.001, 0.1, 1]) {
    for (const kind of ['strong-acid', 'strong-base', 'weak-acid', 'salt', 'sugar', 'water']) {
      const result = core.solutionPH(kind, c);
      near(result.pH + result.pOH, 14, 1e-10);
      near(result.hydrogen * result.hydroxide / 1e-14, 1, 1e-10);
      assert.ok(result.ionicFraction >= 0 && result.ionicFraction <= 1);
      assert.ok(Number.isFinite(result.pH));
    }
  }
  near(core.solutionPH('weak-acid', 1, { Ka: 1e-100 }).pH, 7, 1e-10);
});

test('pH rejects invalid concentrations, nonphysical constants and unrecognized solutions', () => {
  for (const c of [-1, 11, NaN, Infinity, -Infinity, null, '0.1']) assert.throws(() => core.solutionPH('strong-acid', c));
  for (const options of [null, [], { Ka: 0 }, { Ka: -1 }, { Kw: 0 }, { Kw: NaN }, { Ka: Infinity }, { Kw: '1e-14' }]) assert.throws(() => core.solutionPH('weak-acid', 0.1, options));
  assert.throws(() => core.solutionPH('arbitrary-mix', 0.1));
});

test('pure calculations do not mutate inputs or shared reaction records', () => {
  const inputs = { H2: input(3), O2: input(1) }, options = { yieldPercent: 40 };
  const before = JSON.stringify({ inputs, options, data });
  const first = core.stoichiometry('hydrogen_water', inputs, options);
  first.reactants[0].formula = 'modified-output';
  core.parseFormula('K4[Fe(CN)6]');
  core.solutionPH('weak-acid', 0.1);
  assert.equal(JSON.stringify({ inputs, options, data }), before);
  assert.equal(core.stoichiometry('hydrogen_water', inputs, options).reactants[0].formula, 'H2');
});

test('browser globals work without require or module, using only local scripts', () => {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../dist/data.js'), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../dist/core.js'), 'utf8'), context);
  assert.equal(context.ChemData.elements.length, 118);
  near(context.ChemCore.molarMass('H2O'), 18.015);
  assert.equal(context.ChemCore.validateReaction('peroxide').balanced, true);
});
