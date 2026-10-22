'use strict';

// Scientific cross-check retained from the independent final audit.
// 13 node:test cases; 33 targeted scenarios and 330 numerical comparisons.
// These compare shared models only where their assumptions are the same.
const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../dist/core.js');
const lab = require('../dist/lab.js');

function near(actual, expected, label) {
  assert.ok(
    Number.isFinite(actual) && Number.isFinite(expected) &&
      Math.abs(actual - expected) <= 1e-10 * Math.max(1, Math.abs(actual), Math.abs(expected)),
    `${label}: laboratory ${actual}, expected ${expected}`
  );
}

function stateFor(id, amounts = {}, controls = {}) {
  const experiment = lab.experiments.find(item => item.id === id);
  const state = lab.createState(id);
  for (const reagent of experiment.reagents) {
    (state.contents[reagent.target] ||= {})[reagent.id] =
      Object.hasOwn(amounts, reagent.id) ? amounts[reagent.id] : reagent.amount;
  }
  Object.assign(state.controls, controls);
  return state;
}

function amount(state, id) {
  return Object.values(state.contents).reduce((total, contents) => total + (contents[id] || 0), 0);
}

function compareReaction(id, coreId, amounts = {}) {
  const state = stateFor(id, amounts);
  const actual = lab.calculateResult(state);
  const reaction = core.getReaction(coreId);
  const inputs = {};
  for (const reactant of reaction.reactants) {
    const requirement = lab.experiments.find(item => item.id === id).reagents.find(item =>
      lab.materials[item.id]?.formula === reactant.formula && item.unit === 'mmol'
    );
    assert.ok(requirement, `${id}: material mapped for ${reactant.formula}`);
    inputs[reactant.formula] = { value: amount(state, requirement.id) / 1000, unit: 'mol' };
  }
  const expected = core.stoichiometry(reaction, inputs);
  for (const product of expected.products) {
    const found = actual.products.find(item => item.formula === product.formula);
    assert.ok(found, `${id}: product ${product.formula}`);
    near(found.moles, product.theoreticalMol, `${id} product mol ${product.formula}`);
    near(found.grams, product.theoreticalGrams, `${id} product g ${product.formula}`);
    if (product.gasVolumeL != null) {
      near(found.gasVolumeMl, product.gasVolumeL * 1000, `${id} dry gas mL ${product.formula}`);
    }
  }
  for (const reactant of expected.reactants) {
    const found = actual.reactants.find(item => item.formula === reactant.formula);
    near(found.remainingMoles, reactant.leftoverMol, `${id} leftover mol ${reactant.formula}`);
    near(found.remainingGrams, reactant.leftoverGrams, `${id} leftover g ${reactant.formula}`);
  }
  near(actual.mass.input, expected.massBalance.inputGrams, `${id} mass input`);
  near(actual.mass.products, expected.massBalance.theoreticalProductsGrams, `${id} mass products`);
  near(actual.mass.leftover, expected.massBalance.leftoverGrams, `${id} mass leftover`);
  near(actual.mass.error, 0, `${id} mass conservation`);
  if (id === 'neutralization') {
    const excess = inputs.HCl.value - inputs.NaOH.value;
    const pH = core.solutionPH(excess >= 0 ? 'strong-acid' : 'strong-base', Math.abs(excess) / 0.1).pH;
    near(actual.pH, pH, `${id} pH including water autoionization`);
  }
}

test('all shared laboratory molar masses equal the core values, including manganese', () => {
  for (const [formula, species] of Object.entries(lab.species)) {
    near(species.molarMass, core.molarMass(formula), `molar mass ${formula}`);
  }
});

const mappings = {
  'oxygen-peroxide': 'peroxide',
  'oxygen-permanganate': 'permanganate',
  'carbon-dioxide': 'bicarbonate',
  neutralization: 'neutralization',
  displacement: 'displacement',
  precipitation: 'precipitation'
};

for (const [id, coreId] of Object.entries(mappings)) {
  test(`${id}: laboratory agrees with core at default and opposite limiting ratios`, () => {
    const requirements = lab.experiments.find(item => item.id === id).reagents.filter(item => item.unit === 'mmol');
    compareReaction(id, coreId);
    compareReaction(id, coreId, Object.fromEntries(requirements.map((item, index) => [item.id, index % 2 ? item.max : item.min])));
    compareReaction(id, coreId, Object.fromEntries(requirements.map((item, index) => [item.id, index % 2 ? item.min : item.max])));
  });
}

test('limewater agrees at the first stage and independently conserves the second-stage mass', () => {
  compareReaction('limewater', 'limewater');
  compareReaction('limewater', 'limewater', { limewater: 2, co2: 2 });
  // All entries are mmol; fixed initial calcium hydroxide = 2 mmol.
  const expected = [
    [1, 1, 0, 0],
    [2, 2, 0, 0],
    [3, 1, 1, 0],
    [4, 0, 2, 0],
    [6, 0, 2, 2]
  ];
  for (const [carbon, precipitate, dissolved, leftoverCO2] of expected) {
    const actual = lab.calculateResult(stateFor('limewater', { limewater: 2, co2: carbon }));
    near(actual.precipitateMoles, precipitate / 1000, 'limewater precipitate');
    near(actual.dissolvedMoles, dissolved / 1000, 'limewater dissolved bicarbonate');
    near(actual.reactants.find(item => item.formula === 'CO2').remainingMoles, leftoverCO2 / 1000, 'limewater excess CO2');
    near(actual.mass.error, 0, 'limewater two-stage mass conservation');
  }
});

test('electrolysis agrees with core for reacted water after applying the electrical-charge limit', () => {
  for (const [water, charge] of [[20, 386], [0.1, 386], [30, 50]]) {
    const actual = lab.calculateResult(stateFor('electrolysis', { water }, { charge }));
    const reactedMol = Math.min(water / 1000, charge / (2 * lab.FARADAY));
    const expected = core.stoichiometry('electrolysis', { H2O: { value: reactedMol, unit: 'mol' } });
    for (const product of expected.products) {
      const found = actual.products.find(item => item.formula === product.formula);
      near(found.moles, product.theoreticalMol, 'electrolysis product mol');
      near(found.grams, product.theoreticalGrams, 'electrolysis product g');
      near(found.gasVolumeMl, product.gasVolumeL * 1000, 'electrolysis dry gas');
    }
    near(actual.reactants[0].remainingMoles, water / 1000 - reactedMol, 'electrolysis leftover water');
    near(actual.mass.error, 0, 'electrolysis mass conservation');
    near(actual.usedCharge, reactedMol * 2 * lab.FARADAY, 'electrolysis used charge');
  }
});

for (const id of ['filtration', 'distillation']) {
  test(`${id}: allowed water and salt ranges support the dissolved-salt model`, () => {
    const experiment = lab.experiments.find(item => item.id === id);
    assert.equal(experiment.reagents.find(item => item.id === 'water').min, 100);
    assert.equal(experiment.reagents.find(item => item.id === 'salt').max, 10);
    const actual = lab.calculateResult(stateFor(id, { water: 100, salt: 10, sand: 20 }, { fraction: 70 }));
    near(actual.mass.error, 0, `${id} mass conservation`);
    if (id === 'filtration') {
      near(actual.sand, 20, 'filtration sand');
      near(actual.water, 100, 'filtration water');
      near(actual.salt, 10, 'filtration dissolved salt');
    } else {
      near(actual.recovered, 70, 'distillation recovered water');
      near(actual.leftWater, 30, 'distillation retained water');
      near(actual.salt, 10, 'distillation retained salt');
    }
  });
}

test('indicator colors are explicitly qualitative', () => {
  assert.equal(lab.calculateResult(stateFor('indicators')).kind, 'qualitative');
});

test('phosphorus uses two qualitative oxygen scenes without quantitative products', () => {
  for (const oxygen of ['present', 'absent']) {
    const actual = lab.calculateResult(stateFor('phosphorus', {}, { oxygen }));
    assert.equal(actual.kind, 'qualitative');
    assert.equal(actual.burning, oxygen === 'present');
    assert.equal(actual.products, undefined);
  }
});
