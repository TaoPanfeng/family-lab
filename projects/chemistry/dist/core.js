/* 化学探索馆 — 纯计算，无 DOM、网络或随机副作用。所有公开计算先校验输入。 */
(function (root, factory) {
  'use strict';
  var data = typeof module === 'object' && module.exports ? require('./data.js') : root.ChemData;
  var core = factory(data);
  if (typeof module === 'object' && module.exports) module.exports = core;
  root.ChemCore = core;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (data) {
  'use strict';
  if (!data || !data.elements) throw new Error('请先加载 data.js。');

  var R = 8.31446261815324; // kPa·L·mol⁻¹·K⁻¹，与 J·mol⁻¹·K⁻¹ 数值相同。
  var AVOGADRO = 6.02214076e23;
  var bySymbol = Object.create(null), byNumber = Object.create(null), byReaction = Object.create(null), byIsotope = Object.create(null);
  data.elements.forEach(function (e) { bySymbol[e.symbol] = e; byNumber[e.number] = e; });
  data.reactions.forEach(function (r) { byReaction[r.id] = r; });
  data.isotopes.forEach(function (i) { byIsotope[i.id] = i; });

  function fail(message) { throw new Error(message); }
  function finite(value, label, minimum, maximum) {
    if (typeof value !== 'number' || !Number.isFinite(value)) fail(label + '必须是有限数字。');
    if (minimum !== undefined && value < minimum) fail(label + '不能小于 ' + minimum + '。');
    if (maximum !== undefined && value > maximum) fail(label + '不能大于 ' + maximum + '。');
    return value;
  }
  function integer(value, label, minimum, maximum) {
    finite(value, label, minimum, maximum);
    if (!Number.isSafeInteger(value)) fail(label + '必须是安全范围内的整数。');
    return value;
  }
  function object(value, label) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail(label + '格式不正确。');
    return value;
  }
  function normalizeFormula(formula) {
    if (typeof formula !== 'string') fail('化学式必须是文字。');
    var normalized = formula.trim().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, function (digit) { return String('₀₁₂₃₄₅₆₇₈₉'.indexOf(digit)); });
    if (!normalized || normalized.length > 300) fail('化学式长度应为 1–300 个字符。');
    if (/\s/.test(normalized)) fail('化学式内部不能有空白。');
    return normalized;
  }

  /**
   * 中性化学式解析：元素、整数下标、成对圆/方括号、·连接的结晶水。
   * 系数由反应条目保存；本函数不把“2H2O”当化学式，也不吞掉电荷或物态。
   */
  function parseFormula(formula) {
    var text = normalizeFormula(formula);
    var parts = text.split('·');
    var total = {};
    function add(target, symbol, count) {
      var result = (target[symbol] || 0) + count;
      if (!Number.isSafeInteger(result) || result > 1e9) fail('化学式中的原子数量过大。');
      target[symbol] = result;
    }
    parts.forEach(function (part, partIndex) {
      if (!part) fail('结晶水分隔符两侧都要有化学式。');
      var pos = 0, partMultiplier = 1;
      function count() {
        var start = pos;
        while (pos < part.length && /[0-9]/.test(part[pos])) pos += 1;
        if (start === pos) return 1;
        var raw = part.slice(start, pos);
        if (raw[0] === '0') fail('原子数量必须为正整数，不能以 0 开头。');
        return integer(Number(raw), '原子数量', 1, 1e6);
      }
      if (partIndex > 0 && /[0-9]/.test(part[0])) partMultiplier = count();
      function group(closer, depth) {
        if (depth > 16) fail('化学式括号嵌套过深。');
        var atoms = {}, entries = 0;
        while (pos < part.length) {
          var character = part[pos];
          if (character === ')' || character === ']') {
            if (character !== closer) fail('化学式括号没有正确配对。');
            if (entries === 0) fail('括号里不能是空的。');
            pos += 1;
            return atoms;
          }
          if (character === '(' || character === '[') {
            pos += 1;
            var nested = group(character === '(' ? ')' : ']', depth + 1);
            var multiplier = count();
            Object.keys(nested).forEach(function (symbol) { add(atoms, symbol, nested[symbol] * multiplier); });
            entries += 1;
          } else if (/[A-Z]/.test(character)) {
            var symbol = character;
            pos += 1;
            if (pos < part.length && /[a-z]/.test(part[pos])) { symbol += part[pos]; pos += 1; }
            if (!bySymbol[symbol]) fail('未识别的元素符号：' + symbol + '。');
            add(atoms, symbol, count());
            entries += 1;
          } else {
            fail('化学式包含不支持的符号：' + character + '。请输入中性化学式，反应系数另填。');
          }
        }
        if (closer) fail('化学式缺少右括号。');
        if (entries === 0) fail('化学式没有元素。');
        return atoms;
      }
      var atoms = group(null, 0);
      Object.keys(atoms).forEach(function (symbol) { add(total, symbol, atoms[symbol] * partMultiplier); });
    });
    return total;
  }

  function molarMass(formula) {
    var atoms = parseFormula(formula), result = 0;
    Object.keys(atoms).forEach(function (symbol) {
      var element = bySymbol[symbol];
      if (!element.hasStandardWeight) fail(element.name + '没有标准原子量；方括号质量数不能直接用于摩尔质量计算。');
      result += atoms[symbol] * element.mass;
    });
    return finite(result, '摩尔质量', 0);
  }
  function getReaction(reaction) {
    if (typeof reaction === 'string') {
      if (!byReaction[reaction]) fail('没有收录该反应：' + reaction + '。');
      return byReaction[reaction];
    }
    return object(reaction, '反应');
  }
  function sideAtoms(side, label) {
    if (!Array.isArray(side) || side.length === 0 || side.length > 30) fail(label + '需要 1–30 项物质。');
    var total = {}, seen = new Set();
    side.forEach(function (item) {
      object(item, label + '物质');
      var formula = normalizeFormula(item.formula);
      if (seen.has(formula)) fail(label + '中的同种物质应合并成一项。');
      seen.add(formula);
      integer(item.coefficient, '反应系数', 1, 1e6);
      var atoms = parseFormula(formula);
      Object.keys(atoms).forEach(function (symbol) {
        total[symbol] = (total[symbol] || 0) + atoms[symbol] * item.coefficient;
        if (!Number.isSafeInteger(total[symbol])) fail('反应原子计数超出安全范围。');
      });
    });
    return total;
  }
  function validateReaction(reaction) {
    var r = getReaction(reaction);
    var left = sideAtoms(r.reactants, '反应物'), right = sideAtoms(r.products, '生成物');
    var differences = {};
    var symbols = new Set(Object.keys(left).concat(Object.keys(right)));
    symbols.forEach(function (symbol) {
      var difference = (right[symbol] || 0) - (left[symbol] || 0);
      if (difference !== 0) differences[symbol] = difference;
    });
    return { balanced: Object.keys(differences).length === 0, reactants: left, products: right, differences: differences };
  }
  function idealGasVolume(moles, temperatureC, pressureKPa) {
    if (temperatureC === undefined) temperatureC = 25;
    if (pressureKPa === undefined) pressureKPa = 101.325;
    finite(moles, '气体物质的量', 0);
    finite(temperatureC, '摄氏温度');
    finite(pressureKPa, '压强', 0);
    if (temperatureC <= -273.15) fail('气体计算温度必须高于绝对零度。');
    if (pressureKPa === 0) fail('气体计算压强必须大于 0。');
    return finite(moles * R * (temperatureC + 273.15) / pressureKPa, '气体体积', 0);
  }

  /** 完全反应 + 产物回收模型；yieldPercent 是回收率，不推断未反应比例。 */
  function stoichiometry(reaction, inputs, options) {
    var r = getReaction(reaction), check = validateReaction(r);
    if (!check.balanced) fail('方程式没有配平，不能进行化学计量计算。');
    object(inputs, '投料');
    options = options === undefined ? {} : object(options, '计算选项');
    var yieldPercent = options.yieldPercent === undefined ? 100 : options.yieldPercent;
    var temperatureC = options.temperatureC === undefined ? 25 : options.temperatureC;
    var pressureKPa = options.pressureKPa === undefined ? 101.325 : options.pressureKPa;
    finite(yieldPercent, '假设回收率', 0, 100);
    idealGasVolume(0, temperatureC, pressureKPa);
    var known = r.reactants.map(function (s) { return s.formula; });
    Object.keys(inputs).forEach(function (key) { if (known.indexOf(key) === -1) fail('投料中有方程式未列出的反应物：' + key + '。'); });
    var reactants = r.reactants.map(function (s) {
      if (!Object.prototype.hasOwnProperty.call(inputs, s.formula)) fail('请填写 ' + s.formula + ' 的投料量。');
      var input = object(inputs[s.formula], s.formula + ' 投料');
      finite(input.value, s.formula + ' 投料量', 0, 1e12);
      if (input.unit !== 'g' && input.unit !== 'mol') fail('投料单位仅支持 g 或 mol。');
      var mass = molarMass(s.formula);
      var moles = input.unit === 'g' ? input.value / mass : input.value;
      return Object.assign({}, s, { molarMass: mass, inputMol: moles, inputGrams: moles * mass, extent: moles / s.coefficient });
    });
    var extent = Math.min.apply(null, reactants.map(function (s) { return s.extent; }));
    // 相对比较避免把极小投料误当作零，或把高数量级的舍入误差误判成过量。
    var tolerance = Math.max(Number.MIN_VALUE, Math.abs(extent) * 1e-12);
    var limiting = reactants.filter(function (s) { return Math.abs(s.extent - extent) <= tolerance; }).map(function (s) { return s.formula; });
    reactants.forEach(function (s) {
      s.consumedMol = Math.min(s.inputMol, extent * s.coefficient);
      s.leftoverMol = Math.max(0, s.inputMol - s.consumedMol);
      s.consumedGrams = s.consumedMol * s.molarMass;
      s.leftoverGrams = s.leftoverMol * s.molarMass;
    });
    var products = r.products.map(function (s) {
      var mass = molarMass(s.formula), theoreticalMol = extent * s.coefficient;
      var actualMol = theoreticalMol * yieldPercent / 100;
      return Object.assign({}, s, {
        molarMass: mass, theoreticalMol: theoreticalMol, theoreticalGrams: theoreticalMol * mass,
        actualMol: actualMol, actualGrams: actualMol * mass,
        unrecoveredMol: theoreticalMol - actualMol, unrecoveredGrams: (theoreticalMol - actualMol) * mass,
        theoreticalGasVolumeL: s.state === 'g' ? idealGasVolume(theoreticalMol, temperatureC, pressureKPa) : null,
        gasVolumeL: s.state === 'g' ? idealGasVolume(actualMol, temperatureC, pressureKPa) : null
      });
    });
    function sum(items, field) { return items.reduce(function (acc, item) { return acc + item[field]; }, 0); }
    var initial = sum(reactants, 'inputGrams'), consumed = sum(reactants, 'consumedGrams');
    var leftover = sum(reactants, 'leftoverGrams'), theoretical = sum(products, 'theoreticalGrams');
    var actual = sum(products, 'actualGrams'), lost = sum(products, 'unrecoveredGrams');
    return {
      reactionId: r.id || null, extent: extent, limiting: limiting, reactants: reactants, products: products,
      yieldPercent: yieldPercent, temperatureC: temperatureC, pressureKPa: pressureKPa,
      massBalance: { inputGrams: initial, consumedGrams: consumed, leftoverGrams: leftover, theoreticalProductsGrams: theoretical, actualProductsGrams: actual, unrecoveredProductsGrams: lost, finalGrams: leftover + actual + lost, errorGrams: initial - leftover - actual - lost },
      assumptions: '纯物质/纯溶质；指定反应完全进行；无副反应。回收率只影响收集量，剩余原料按理论反应计算。干气体近似理想气体，忽略溶解与水蒸气。'
    };
  }

  function electronShells(electrons) {
    integer(electrons, '电子数', 0, 20);
    var capacities = [2, 8, 8, 2], shells = [], remaining = electrons;
    capacities.forEach(function (capacity) {
      if (remaining > 0) { var count = Math.min(capacity, remaining); shells.push(count); remaining -= count; }
    });
    return shells;
  }
  function atomicIdentity(protons, neutrons, electrons) {
    integer(protons, '本模型质子数', 1, 20);
    integer(neutrons, '本模型中子数', 0, 40);
    integer(electrons, '本模型电子数', 0, 20);
    var element = byNumber[protons], massNumber = protons + neutrons;
    var found = byIsotope[element.symbol + '-' + massNumber] || null;
    return {
      symbol: element.symbol, name: element.name, number: protons, protons: protons, neutrons: neutrons, electrons: electrons,
      massNumber: massNumber, charge: protons - electrons, shells: electronShells(electrons), isotope: found,
      stability: found ? (found.stable ? 'stable' : 'radioactive') : 'unknown',
      model: '粒子计数与前 20 号元素的简化壳层；不是电子轨迹或束缚态预测。未收录的核素不能据此判断是否存在或稳定。'
    };
  }

  function decayRemaining(initial, elapsed, halfLife) {
    finite(initial, '初始数量', 0);
    finite(elapsed, '经过时间', 0);
    finite(halfLife, '半衰期', 0);
    if (halfLife === 0) fail('半衰期必须大于 0。');
    if (initial === 0 || elapsed === 0) return initial;
    return initial * Math.pow(2, -elapsed / halfLife);
  }
  function decayProbability(elapsed, halfLife) {
    finite(elapsed, '经过时间', 0);
    finite(halfLife, '半衰期', 0);
    if (halfLife === 0) fail('半衰期必须大于 0。');
    // expm1 在极短时间步下仍能保留概率的小量，供粒子动画使用。
    return -Math.expm1(-Math.LN2 * elapsed / halfLife);
  }
  /** 只表达守恒规则，不能用于预测某个核素实际采用哪种衰变。 */
  function decayTransform(nucleus, mode) {
    object(nucleus, '核素');
    var number = nucleus.number, massNumber = nucleus.massNumber;
    integer(number, '质子数 Z', 1, 118);
    integer(massNumber, '质量数 A', number, 350);
    var emitted;
    if (mode === 'alpha') { number -= 2; massNumber -= 4; emitted = '⁴₂He'; }
    else if (mode === 'beta-') { number += 1; emitted = 'e⁻ + 电子反中微子'; }
    else if (mode === 'beta+') { number -= 1; emitted = 'e⁺ + 电子中微子'; }
    else if (mode === 'electron-capture') { number -= 1; emitted = '电子中微子（核俘获一个核外电子）'; }
    else if (mode === 'gamma') { emitted = 'γ 光子'; }
    else fail('未支持的核变化类型：' + String(mode) + '。X 射线不是本函数的核衰变类型。');
    if (number < 1 || number > 118 || massNumber < number || massNumber < 1) fail('这种变换会产生无效的核组成。');
    var element = byNumber[number];
    return {
      number: number, protons: number, massNumber: massNumber, neutrons: massNumber - number,
      symbol: element.symbol, name: element.name, id: element.symbol + '-' + massNumber,
      mode: mode, emitted: emitted, excitationChanged: mode === 'gamma',
      note: '仅为核子数和电荷守恒规则；是否实际发生、分支比例和寿命必须查该核素的数据。'
    };
  }
  function isotopeAfterDecay(isotopeOrId) {
    var i = typeof isotopeOrId === 'string' ? byIsotope[isotopeOrId] : isotopeOrId;
    object(i, '已收录核素');
    if (!byIsotope[i.id] || byIsotope[i.id] !== i) {
      if (!byIsotope[i.id]) fail('未收录该核素的实际衰变资料。');
      i = byIsotope[i.id]; // 不信任调用者覆盖的衰变模式。
    }
    if (i.stable || !i.decayMode) fail('该稳定核素没有本馆收录的放射性衰变。');
    var result = decayTransform(i, i.decayMode);
    result.isotope = byIsotope[result.id] || null;
    result.gammaAfter = i.gammaAfter === true;
    result.note = i.note;
    return result;
  }

  /** 理想水溶液；25°C 默认 Kw。含水自电离，避免极稀酸被错误算成碱。 */
  function solutionPH(kind, concentration, options) {
    finite(concentration, '分析浓度（mol/L）', 0, 10);
    options = options === undefined ? {} : object(options, '酸碱选项');
    var Ka = options.Ka === undefined ? 1.8e-5 : options.Ka;
    var Kw = options.Kw === undefined ? 1e-14 : options.Kw;
    finite(Ka, 'Ka', 0, 100);
    finite(Kw, 'Kw', 0, 1);
    if (Ka === 0 || Kw === 0) fail('Ka 和 Kw 必须大于 0。');
    if (['strong-acid', 'strong-base', 'weak-acid', 'salt', 'sugar', 'water'].indexOf(kind) === -1) fail('未收录这种酸碱模型。');
    var neutral = Math.sqrt(Kw), hydrogen = neutral, ionicFraction = 0, ionized = 0;
    if (kind === 'strong-acid') {
      hydrogen = (concentration + Math.hypot(concentration, 2 * neutral)) / 2;
      ionized = concentration; ionicFraction = concentration === 0 ? 0 : 1;
    } else if (kind === 'strong-base') {
      var hydroxideBase = (concentration + Math.hypot(concentration, 2 * neutral)) / 2;
      hydrogen = Kw / hydroxideBase;
      ionized = concentration; ionicFraction = concentration === 0 ? 0 : 1;
    } else if (kind === 'weak-acid' && concentration > 0) {
      // 电中性：H = Kw/H + C·Ka/(Ka+H)。左减右严格单调，二分求唯一正根。
      var low = neutral, high = concentration + neutral;
      for (var step = 0; step < 100; step += 1) {
        // 几何二分覆盖极宽浓度范围，避免自定义极小 Ka 时线性二分精度不足。
        var mid = Math.sqrt(low) * Math.sqrt(high);
        var residual = mid - Kw / mid - concentration * Ka / (Ka + mid);
        if (residual > 0) high = mid; else low = mid;
      }
      hydrogen = (low + high) / 2;
      ionicFraction = Ka / (Ka + hydrogen);
      ionized = concentration * ionicFraction;
    } else if (kind === 'salt') {
      ionized = concentration; ionicFraction = concentration === 0 ? 0 : 1;
    }
    var hydroxide = Kw / hydrogen;
    var isStrong = ['strong-acid', 'strong-base', 'salt'].indexOf(kind) !== -1;
    return {
      pH: -Math.log10(hydrogen), pOH: -Math.log10(hydroxide), hydrogen: hydrogen, hydroxide: hydroxide,
      ionized: ionized, ionicFraction: ionicFraction, kind: kind, concentration: concentration, Ka: Ka, Kw: Kw,
      conductivityClass: concentration === 0 || kind === 'water' ? 'very-low' : (isStrong ? 'strong-electrolyte' : (kind === 'weak-acid' ? 'weak-electrolyte' : 'nonelectrolyte')),
      model: '理想稀水溶液，默认 25°C，使用浓度近似活度并计入水自电离。salt 只代表 NaCl 型中性盐；water 忽略空气中的 CO₂。电解质强弱不等于任意浓度下的导电强弱。'
    };
  }

  function formatFormula(formula) {
    var text = normalizeFormula(formula);
    parseFormula(text);
    return text.split('·').map(function (part, index) {
      var prefix = index > 0 ? (part.match(/^[0-9]+/) || [''])[0] : '';
      return prefix + part.slice(prefix.length).replace(/[0-9]/g, function (digit) { return '₀₁₂₃₄₅₆₇₈₉'[Number(digit)]; });
    }).join('·');
  }

  return Object.freeze({
    R: R, AVOGADRO: AVOGADRO, parseFormula: parseFormula, molarMass: molarMass, validateReaction: validateReaction,
    getReaction: getReaction, stoichiometry: stoichiometry, idealGasVolume: idealGasVolume,
    electronShells: electronShells, atomicIdentity: atomicIdentity,
    decayRemaining: decayRemaining, decayProbability: decayProbability, decayTransform: decayTransform, isotopeAfterDecay: isotopeAfterDecay,
    solutionPH: solutionPH, formatFormula: formatFormula
  });
});
