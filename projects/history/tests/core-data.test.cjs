'use strict';

// These tests run the same unbundled browser scripts shipped in the ZIP.
// They check chronology, coverage and data relationships. They cannot certify
// every historical interpretation or the precision of the schematic maps.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const context = vm.createContext({ window: {} });
const browserFiles = ['core.js', ...fs.readdirSync(path.join(ROOT, 'data'))
  .filter(file => file.endsWith('.js')).sort().map(file => `data/${file}`)];
for (const file of browserFiles) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), context,
    { filename: file, timeout: 2000 });
}
const W = context.window;
const C = W.HistoryCore;
const D = W.HISTORY_CONTENT;
const A = W.HISTORY_ATLAS;
const L = W.HISTORY_LEARNING;
const rulers = [...W.EARLY_RULERS, ...W.LATE_RULERS];
const dynastyById = new Map(D.dynasties.map(d => [d.id, d]));
const rulerById = new Map(rulers.map(r => [r.id, r]));
const eventById = new Map(D.events.map(e => [e.id, e]));
const snapshotById = new Map(A.snapshots.map(s => [s.id, s]));
const plain = value => JSON.parse(JSON.stringify(value));

// This is the reviewed v1 coverage contract, not a total for all Chinese kings.
// An intentional addition needs a reviewed update to this table.
const EXPECTED_RULERS = {
  xia: 3, shang: 4, 'western-zhou': 5, 'eastern-zhou': 3,
  qin: 3, 'western-han': 14, xin: 1, 'eastern-han': 14,
  'cao-wei': 5, 'shu-han': 2, 'eastern-wu': 4,
  'western-jin': 5, 'eastern-jin': 11,
  'liu-song': 9, 'southern-qi': 7, liang: 8, chen: 5,
  'northern-wei': 17, 'eastern-wei': 1, 'western-wei': 3,
  'northern-qi': 8, 'northern-zhou': 5, sui: 5,
  tang: 21, 'wu-zhou': 1, 'later-liang': 3, 'later-tang': 4,
  'later-jin': 2, 'later-han': 2, 'later-zhou': 3,
  'northern-song': 9, 'southern-song': 9, liao: 9,
  'western-xia': 10, jin: 10, yuan: 11, ming: 16, qing: 12
};

function text(value, where) {
  assert.equal(typeof value, 'string', `${where}: expected text`);
  assert.ok(value.trim().length > 0, `${where}: empty text`);
  assert.ok(!value.includes('\uFFFD'), `${where}: invalid text encoding`);
}
function year(value, where, nullable = false) {
  if (nullable && value === null) return;
  assert.ok(Number.isSafeInteger(value) && value !== 0,
    `${where}: expected an integer historical year without year zero, got ${value}`);
}
function uniqueIds(records, where) {
  assert.ok(Array.isArray(records) && records.length, `${where}: nonempty array`);
  const ids = new Set();
  for (const record of records) {
    assert.match(record.id, /^[a-z][a-z0-9-]*$/, `${where}: invalid id`);
    assert.ok(!ids.has(record.id), `${where}: duplicate id ${record.id}`);
    ids.add(record.id);
  }
}
function strings(values, where) {
  assert.ok(Array.isArray(values) && values.length, `${where}: nonempty text array`);
  values.forEach((value, i) => text(value, `${where}[${i}]`));
}
function sources(values, where) {
  assert.ok(Array.isArray(values) && values.length, `${where}: needs source references`);
  for (const source of values) {
    text(source.title, `${where}.title`);
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:', `${where}: non-HTTPS or executable source URL`);
    assert.ok(url.hostname.includes('.'), `${where}: not a public source hostname`);
    assert.equal(url.username + url.password, '', `${where}: source URL contains credentials`);
    assert.ok(!/[\s<>"']/.test(source.url), `${where}: malformed source URL`);
    assert.ok(!/(?:example\.(?:com|org)|localhost|127\.0\.0\.1)$/i.test(url.hostname),
      `${where}: placeholder/local URL`);
    if ('accessed' in source) {
      assert.match(source.accessed, /^\d{4}-\d{2}-\d{2}$/, `${where}: access date format`);
      assert.ok(Number.isFinite(Date.parse(source.accessed)), `${where}: invalid access date`);
    }
    if ('scope' in source) text(source.scope, `${where}.scope`);
  }
}
function coordinate(lon, lat, where) {
  assert.ok(Number.isFinite(lon) && lon >= -180 && lon <= 180,
    `${where}: longitude outside [-180, 180]`);
  assert.ok(Number.isFinite(lat) && lat >= -90 && lat <= 90,
    `${where}: latitude outside [-90, 90]`);
}
function point(value, where) {
  assert.ok(Array.isArray(value) && value.length === 2, `${where}: [longitude, latitude] required`);
  coordinate(value[0], value[1], where);
}
function getRuler(id) {
  assert.ok(rulerById.has(id), `missing historical regression fixture: ${id}`);
  return rulerById.get(id);
}
function dynastyIdsAt(y) {
  return Array.from(C.activeDynasties(D.dynasties, y), d => d.id).sort();
}

test('all shipped data scripts execute in a browser-style VM without DOM, imports or network', () => {
  for (const key of ['HistoryCore', 'HISTORY_CONTENT', 'HISTORY_ATLAS', 'HISTORY_LEARNING',
    'EARLY_RULERS', 'LATE_RULERS', 'LAND_GEOMETRY']) assert.ok(W[key], `missing window.${key}`);
  const commonJS = require(path.join(ROOT, 'core.js'));
  assert.deepEqual(Object.keys(C).sort(), Object.keys(commonJS).sort(), 'browser/CommonJS API drift');
});

test('historical year parsing accepts BC/CE and rejects year zero, fractions, exponents and junk', () => {
  for (const [input, expected] of [[-2070, -2070], [' -221 ', -221], [-1, -1], ['1', 1],
    ['1912', 1912], ['0001', 1], [750, 750]]) assert.equal(C.parseYear(input), expected);
  for (const invalid of [0, -0, '0', '-0', '0.0', '', ' ', null, undefined, false, true,
    '公元前221年', '12x', '1.5', 1.5, '1e3', '0x10', '+1', '-2071', '1913',
    Infinity, -Infinity, NaN, {}, '<script>1</script>']) {
    assert.equal(C.parseYear(invalid), null, `accepted invalid year ${String(invalid)}`);
  }
});

test('every timeline slider position round-trips, is monotonic and skips historical year zero', () => {
  let previous;
  for (let ordinal = -2070; ordinal <= 1911; ordinal++) {
    const y = C.fromOrdinal(ordinal);
    year(y, `slider ${ordinal}`);
    assert.equal(C.ordinal(y), ordinal, `round-trip at ${ordinal}`);
    if (previous !== undefined) {
      assert.ok(y > previous, `non-monotonic years ${previous}, ${y}`);
      assert.equal(C.distance(previous, y), 1, `slider skipped a real year near ${y}`);
    }
    previous = y;
  }
  assert.equal(C.fromOrdinal(-1), -1);
  assert.equal(C.fromOrdinal(0), 1);
  assert.equal(C.fromOrdinal(1911), 1912);
});

test('year distances cross BC/CE once and never turn unknown dates into zero', () => {
  const cases = [[-1, 1, 1], [-9, 6, 14], [-221, 1912, 2132],
    [-259, -210, 49], [1435, 1464, 29], [1620, 1620, 0]];
  for (const [start, end, expected] of cases) {
    assert.equal(C.distance(start, end), expected);
    assert.equal(C.distance(end, start), -expected || 0);
  }
  for (const invalid of [null, undefined, 0, NaN, '1', 1.2]) {
    assert.equal(C.ordinal(invalid), null);
    assert.equal(C.distance(invalid, 1), null);
    assert.equal(C.distance(1, invalid), null);
    assert.match(C.yearLabel(invalid), /未详/);
  }
  assert.equal(C.yearLabel(-1), '公元前1年');
  assert.equal(C.yearLabel(1), '公元1年');
  assert.match(C.rangeLabel(null, null), /未详/);
  assert.ok(!C.rangeLabel(null, 528).includes('0年'));
});

test('restored rulers stay one person, sum their separate reigns and exclude the interruptions', () => {
  const expected = {
    'western-jin-hui': 17, 'eastern-jin-an': 22, 'tang-zhongzong': 5,
    'tang-ruizong': 8, 'tang-zhaozong': 15, 'yuan-wenzong': 4, 'ming-yingzong': 21
  };
  for (const [id, duration] of Object.entries(expected)) {
    const r = getRuler(id);
    assert.equal(rulers.filter(candidate => candidate.id === id).length, 1, `${id}: duplicate person`);
    assert.equal(r.reigns.length, 2, `${id}: restoration was flattened`);
    assert.equal(C.reignYears(r.reigns), duration, `${id}: hiatus incorrectly counted`);
  }
  const yingzong = getRuler('ming-yingzong');
  assert.equal(C.aliveIn(yingzong, 1450), false, 'captivity is not a reign');
  assert.equal(C.aliveIn(yingzong, 1457), true);
  assert.equal(C.aliveIn(getRuler('tang-zhongzong'), 700), false);
  assert.equal(C.aliveIn(getRuler('tang-ruizong'), 709), false);
});

test('same-year and uncertain reigns have honest durations and labels', () => {
  for (const id of ['qin-ziying', 'western-jin-lun', 'ming-guangzong', 'jin-modi']) {
    assert.equal(C.reignYears(getRuler(id).reigns), 0, `${id}: artificial full year`);
    assert.match(C.reignLabel(getRuler(id).reigns), /不足1年/);
  }
  for (const reigns of [[], null, [{ start: null, end: null }],
    [{ start: null, end: -1046 }], [{ start: 1, end: 5 }, { start: 6, end: null }]]) {
    assert.equal(C.reignYears(reigns), null);
    assert.match(C.reignLabel(reigns), /未详/);
  }
  assert.equal(C.reignYears(getRuler('western-han-ping').reigns), 6, 'BC/CE reign is six year intervals');
  assert.equal(C.aliveIn(getRuler('xia-yu'), -2000), false, 'unknown is not a guessed reign');
});

test('simultaneous polities and the Wu Zhou interruption survive chronological filtering', () => {
  assert.deepEqual(dynastyIdsAt(250), ['cao-wei', 'eastern-wu', 'shu-han']);
  assert.deepEqual(dynastyIdsAt(1100), ['liao', 'northern-song', 'western-xia']);
  assert.deepEqual(dynastyIdsAt(1200), ['jin', 'southern-song', 'western-xia']);
  assert.deepEqual(dynastyIdsAt(700), ['wu-zhou']);
  assert.ok(dynastyIdsAt(689).includes('tang'));
  assert.ok(dynastyIdsAt(706).includes('tang'));
  for (const transition of [690, 705]) {
    assert.ok(dynastyIdsAt(transition).includes('tang'));
    assert.ok(dynastyIdsAt(transition).includes('wu-zhou'));
  }
  assert.ok(dynastyIdsAt(1640).includes('ming') && dynastyIdsAt(1640).includes('qing'));
});

test('the nearest historical map uses chronological distance, including BC/CE and edge years', () => {
  const fixture = [{ id: 'bc', year: -2 }, { id: 'ad', year: 2 }];
  assert.equal(C.nearestSnapshot(fixture, -1).id, 'bc');
  assert.equal(C.nearestSnapshot(fixture, 1).id, 'ad');
  assert.equal(C.nearestSnapshot([{ id: 'a', year: -1 }, { id: 'b', year: 2 }], 1).id, 'a',
    'ties consistently keep the earlier listed frame');
  for (const s of A.snapshots) assert.equal(C.nearestSnapshot(A.snapshots, s.year).id, s.id);
  assert.equal(C.nearestSnapshot(A.snapshots, -2070).id, 'shang-1200');
  assert.equal(C.nearestSnapshot(A.snapshots, 1912).id, 'qing-1820');
  assert.equal(C.nearestSnapshot(A.snapshots, 208).id, 'three-250');
  assert.equal(C.nearestSnapshot(A.snapshots, 1449).id, 'ming-1450');
});

test('search accepts personal names, Chinese tags, case differences and whitespace', () => {
  assert.ok(C.matches(getRuler('qin-shihuang'), '嬴政'));
  assert.ok(C.matches(getRuler('ming-yingzong'), ' 冤案 '));
  assert.ok(C.matches({ title: 'The Silk Road', tags: ['Trade'] }, 'trade'));
  assert.ok(C.matches(getRuler('xia-yu'), '   '));
  assert.equal(C.matches(getRuler('qin-shihuang'), '阿速吉八'), false);
  assert.ok(C.matches(eventById.get('red-cliffs'), '赤壁'));
});

test('saved-state sanitizing tolerates corrupted JSON values and bounds user-controlled memory', () => {
  for (const input of [null, undefined, 4, 'bad', [], {}]) {
    const saved = C.sanitizeSaved(input);
    assert.equal(saved.mode, 'child');
    assert.equal(saved.year, 750);
    assert.equal(saved.journey, 0);
    assert.deepEqual(plain(saved.bookmarks), []);
  }
  const valid = { mode: 'deep', year: -1, bookmarks: ['r:qin-shihuang', 'r:qin-shihuang', 3],
    visited: ['qin-shihuang', null, 'qin-shihuang'], answered: ['q-no-zero', false, 'q-no-zero'],
    notes: '我原来以为……\n现在发现……', journey: 3 };
  const original = JSON.stringify(valid);
  const saved = C.sanitizeSaved(valid);
  assert.equal(saved.year, -1);
  assert.equal(saved.mode, 'deep');
  assert.equal(saved.notes, valid.notes);
  assert.deepEqual(plain(saved.bookmarks), ['r:qin-shihuang']);
  assert.deepEqual(plain(saved.visited), ['qin-shihuang']);
  assert.deepEqual(plain(saved.answered), ['q-no-zero']);
  assert.equal(JSON.stringify(valid), original, 'sanitizing mutated the caller');
  const huge = C.sanitizeSaved({ mode: 'unexpected', year: 0, journey: 100000,
    bookmarks: Array.from({ length: 1100 }, (_, i) => `r:${i}`),
    visited: {}, answered: 'wrong type', notes: '汉'.repeat(21000) });
  assert.equal(huge.mode, 'child');
  assert.equal(huge.year, 750);
  assert.equal(huge.bookmarks.length, 1000);
  assert.equal(huge.notes.length, 20000);
  assert.deepEqual(plain(huge.visited), []);
  assert.deepEqual(plain(huge.answered), []);
  assert.ok(huge.journey < L.journeys.length, 'saved journey could crash learning page');
  for (const journey of [-1, NaN, 1.5, '3']) assert.equal(C.sanitizeSaved({ journey }).journey, 0);
});

test('rendered text is escaped, including notes that resemble HTML', () => {
  assert.equal(C.escapeHTML(null), '');
  assert.equal(C.escapeHTML('<script title="x" data-x=\'y\'>&</script>'),
    '&lt;script title=&quot;x&quot; data-x=&#39;y&#39;&gt;&amp;&lt;/script&gt;');
  assert.equal(C.escapeHTML('汉字与换行\n仍然保留'), '汉字与换行\n仍然保留');
});

test('v1 has unique IDs and the declared dynasty-by-dynasty ruler coverage', () => {
  for (const [records, name] of [[D.dynasties, 'dynasties'], [rulers, 'rulers'],
    [D.events, 'events'], [D.world, 'world'], [A.snapshots, 'snapshots'], [L.questions, 'questions']]) {
    uniqueIds(records, name);
  }
  assert.equal(W.EARLY_RULERS.length, 142);
  assert.equal(W.LATE_RULERS.length, 122);
  assert.equal(rulers.length, 264);
  assert.equal(D.dynasties.length, 38);
  assert.deepEqual([...dynastyById.keys()].sort(), Object.keys(EXPECTED_RULERS).sort());
  const counts = Object.fromEntries(D.dynasties.map(d => [d.id, 0]));
  for (const r of rulers) {
    assert.ok(dynastyById.has(r.dynasty), `${r.id}: missing dynasty ${r.dynasty}`);
    counts[r.dynasty]++;
  }
  assert.deepEqual(counts, EXPECTED_RULERS);
});

test('every dynasty has dates, readable child/adult/social content and source links', () => {
  for (const d of D.dynasties) {
    for (const key of ['name', 'capital', 'summary', 'child', 'daily', 'coverage']) text(d[key], `${d.id}.${key}`);
    year(d.start, `${d.id}.start`);
    year(d.end, `${d.id}.end`);
    assert.ok(d.start < d.end, `${d.id}: reversed or empty dynasty span`);
    assert.ok(d.start >= C.MIN_YEAR && d.end <= C.MAX_YEAR, `${d.id}: outside timeline range`);
    assert.ok(Number.isInteger(d.lane) && d.lane >= 0 && d.lane <= 3, `${d.id}: unsupported timeline lane`);
    assert.match(d.color, /^#[\da-f]{6}$/i, `${d.id}: unsafe/invalid color`);
    strings(d.legacy, `${d.id}.legacy`);
    strings(d.costs, `${d.id}.costs`);
    sources(d.sources, d.id);
  }
});

test('concurrent dynasty bars do not conceal each other on the same timeline lane', () => {
  // Sharing a handover year is legitimate. A positive interval of overlap is not:
  // the timeline uses absolute positions and bars on one lane would cover one another.
  const segments = D.dynasties.flatMap(d => d.id === 'tang'
    ? [{ ...d, start: 618, end: 690 }, { ...d, start: 705, end: 907 }] : [d]);
  const overlaps = [];
  for (let i = 0; i < segments.length; i++) for (let j = i + 1; j < segments.length; j++) {
    const a = segments[i], b = segments[j];
    if (a.id === b.id || a.lane !== b.lane) continue;
    const start = Math.max(a.start, b.start), end = Math.min(a.end, b.end);
    if (start < end) overlaps.push(`${a.id}/${b.id} on lane ${a.lane}, ${start}–${end}`);
  }
  assert.deepEqual(overlaps, [], 'contemporary dynasties must remain separately visible');
});

test('ruler records have complete fields, valid life bounds and no invented year-zero dates', () => {
  const keys = ['id', 'dynasty', 'name', 'personal', 'birth', 'death', 'reigns',
    'achievement', 'cost', 'child', 'note', 'tags', 'sources'].sort();
  for (const r of rulers) {
    assert.deepEqual(Object.keys(r).sort(), keys, `${r.id}: schema drift`);
    for (const key of ['name', 'personal', 'achievement', 'cost', 'child', 'note']) text(r[key], `${r.id}.${key}`);
    strings(r.tags, `${r.id}.tags`);
    sources(r.sources, r.id);
    year(r.birth, `${r.id}.birth`, true);
    year(r.death, `${r.id}.death`, true);
    if (r.birth !== null && r.death !== null) assert.ok(r.birth <= r.death, `${r.id}: born after death`);
    assert.ok(Array.isArray(r.reigns) && r.reigns.length, `${r.id}: missing reigns`);
    r.reigns.forEach((span, i) => {
      assert.deepEqual(Object.keys(span).sort(), ['end', 'start'], `${r.id}: reign schema`);
      year(span.start, `${r.id}.reigns[${i}].start`, true);
      year(span.end, `${r.id}.reigns[${i}].end`, true);
      if (span.start !== null && span.end !== null) assert.ok(span.start <= span.end, `${r.id}: reversed reign`);
      if (r.birth !== null && span.start !== null) assert.ok(r.birth <= span.start, `${r.id}: reign before birth`);
      if (r.death !== null && span.end !== null) assert.ok(span.end <= r.death, `${r.id}: reign after death`);
      if (i && r.reigns[i - 1].end !== null && span.start !== null) {
        assert.ok(r.reigns[i - 1].end <= span.start, `${r.id}: duplicate/overlapping reign intervals`);
      }
    });
    // Ruler spans deliberately are NOT required to lie inside the dynasty bar:
    // Gao Shaoyi, Yang Tong, earlier khanates, and similar cases need their notes.
  }
});

test('uncertain evidence remains null, including infant, exile and missing-person cases', () => {
  for (const id of ['xia-yu', 'shang-pangeng', 'western-han-gaozu', 'cao-wei-ming',
    'eastern-jin-cheng', 'chen-fei', 'western-wei-fei', 'western-wei-gong', 'sui-tong']) {
    assert.equal(getRuler(id).birth, null, `${id}: disputed birth silently became certain`);
    assert.ok(getRuler(id).note.length > 15);
  }
  for (const id of ['northern-wei-infant-daughter', 'northern-qi-shaoyi', 'yuan-tianshun', 'ming-jianwen']) {
    assert.equal(getRuler(id).death, null, `${id}: uncertain death silently became certain`);
  }
  assert.deepEqual(plain(getRuler('xia-yu').reigns), [{ start: null, end: null }]);
  assert.deepEqual(plain(getRuler('shang-dixin').reigns), [{ start: null, end: -1046 }]);
  assert.equal(C.reignYears(getRuler('shang-dixin').reigns), null);
});

test('reviewed old-calendar/public-era boundary dates do not regress to simplified year tables', () => {
  const reviewed = [
    ['western-han-ping', 'death', 6], ['eastern-han-he', 'death', 106],
    ['eastern-han-huan', 'death', 168], ['cao-wei-fang', 'birth', 232],
    ['liu-song-qianfei', 'death', 466], ['liang-dong', 'death', 552],
    ['liang-yuan', 'death', 555], ['northern-wei-xiaozhuang', 'death', 531],
    ['northern-wei-xiaowu', 'death', 535], ['northern-qi-wucheng', 'death', 569],
    ['northern-qi-houzhu', 'birth', 556], ['later-tang-modi', 'death', 937],
    ['later-han-yindi', 'death', 951]
  ];
  for (const [id, key, expected] of reviewed) assert.equal(getRuler(id)[key], expected, `${id}.${key}`);
  assert.equal(getRuler('cao-wei-huan').reigns[0].end, 266);
  assert.equal(getRuler('western-jin-wu').reigns[0].start, 266);
  assert.equal(getRuler('liu-song-ming').reigns[0].start, 466);
  assert.equal(getRuler('liang-dong').reigns[0].end, 552);
  assert.equal(getRuler('western-wei-gong').reigns[0].end, 557);
  assert.equal(getRuler('northern-qi-yanzong').reigns[0].start, 577);
});

test('accession, era names, state founding and actual power are kept distinct', () => {
  const starts = {
    'qin-shihuang': -221, 'western-han-gaozu': -202, 'eastern-wu-dadi': 229,
    'eastern-jin-yuan': 318, 'northern-wei-daowu': 398, 'tang-taizong': 626,
    'ming-chengzu': 1402, 'qing-kangxi': 1661, 'qing-yongzheng': 1722,
    'qing-qianlong': 1735, 'liao-taizu': 907, 'yuan-shizu': 1260, 'qing-nurhaci': 1616
  };
  for (const [id, expected] of Object.entries(starts)) assert.equal(getRuler(id).reigns[0].start, expected, id);
  assert.equal(getRuler('qing-qianlong').reigns[0].end, 1796, 'retired influence must not extend formal reign');
  assert.match(getRuler('qin-ziying').note, /秦王.*非皇帝/);
  assert.match(getRuler('liao-taizu').note, /916.*称帝/);
  assert.match(getRuler('yuan-shizu').note, /1271/);
  assert.match(getRuler('qing-nurhaci').note, /后金/);
  assert.equal(dynastyById.get('eastern-wu').start, 222);
  assert.equal(dynastyById.get('yuan').start, 1271);
  assert.equal(dynastyById.get('qing').start, 1636);
});

test('legitimate contested and exile rulers are not clipped to the main dynasty interval', () => {
  const shaoyi = getRuler('northern-qi-shaoyi');
  assert.ok(shaoyi.reigns[0].start > dynastyById.get(shaoyi.dynasty).end);
  assert.match(shaoyi.note, /流亡/);
  const tong = getRuler('sui-tong');
  assert.equal(tong.reigns[0].end, 619);
  assert.equal(dynastyById.get('sui').end, 618);
  assert.match(tong.note, /唐已建立/);
  assert.ok(getRuler('qing-nurhaci').reigns[0].end < dynastyById.get('qing').start);
});

test('events have usable references, ordered dates, coordinates and human consequences', () => {
  assert.equal(D.events.length, 38);
  for (const e of D.events) {
    for (const key of ['title', 'place', 'actors', 'cause', 'result', 'impact', 'child', 'lesson']) text(e[key], `${e.id}.${key}`);
    year(e.year, `${e.id}.year`);
    assert.ok(e.year >= C.MIN_YEAR && e.year <= C.MAX_YEAR, `${e.id}: year outside navigation range`);
    if ('endYear' in e) {
      year(e.endYear, `${e.id}.endYear`);
      assert.ok(e.endYear >= e.year && e.endYear <= C.MAX_YEAR, `${e.id}: event interval`);
    }
    assert.ok(['battle', 'turning', 'society'].includes(e.kind), `${e.id}: unsupported event filter`);
    strings(e.dynasties, `${e.id}.dynasties`);
    for (const id of e.dynasties) assert.ok(dynastyById.has(id), `${e.id}: missing dynasty ${id}`);
    assert.equal(new Set(e.dynasties).size, e.dynasties.length, `${e.id}: duplicate related dynasty`);
    coordinate(e.lon, e.lat, e.id);
    sources(e.sources, e.id);
    // Related dynasties can be predecessors/successors: Guandu (200) is related
    // to the future Wei, and Sarhu (1619) to the future Qing. Do not falsify dates.
  }
  assert.ok(D.events.some(e => e.kind === 'society'), 'history must include more than battles');
  assert.equal(eventById.get('red-cliffs').year, 208);
  assert.ok(eventById.get('red-cliffs').year < dynastyById.get('cao-wei').start);
  assert.equal(eventById.get('sarhu').year, 1619);
  assert.equal(eventById.get('xinhai').endYear, 1912);
});

test('world references preserve their real ranges rather than being clipped to China’s slider', () => {
  assert.ok(D.world.length >= 19, 'world reference data is incomplete');
  for (const w of D.world) {
    for (const key of ['name', 'region', 'summary', 'child']) text(w[key], `${w.id}.${key}`);
    year(w.start, `${w.id}.start`);
    year(w.end, `${w.id}.end`);
    assert.ok(w.start < w.end, `${w.id}: reversed/empty world period`);
    coordinate(w.lon, w.lat, w.id);
    sources(w.sources, w.id);
  }
  const world = new Map(D.world.map(w => [w.id, w]));
  assert.equal(world.get('indus').start, -2600);
  assert.equal(world.get('ottoman').end, 1922);
  assert.equal(C.distance(world.get('rome').start, world.get('rome').end), 502);
  assert.ok(world.get('byzantium').end > world.get('rome').end, 'western Roman endpoint is not all Rome');
  const at750 = D.world.filter(w => w.start <= 750 && w.end >= 750).map(w => w.id);
  for (const id of ['byzantium', 'nara', 'abbasid']) assert.ok(at750.includes(id), `750 missing ${id}`);
  assert.ok(D.world.some(w => w.lon < 0), 'western longitudes were accidentally made positive');
});

test('atlas snapshots are distinct chronological frames with dated, valid dynasty references', () => {
  assert.equal(A.snapshots.length, 13);
  let previous = -Infinity;
  for (const s of A.snapshots) {
    for (const key of ['title', 'subtitle', 'note', 'question']) text(s[key], `${s.id}.${key}`);
    year(s.year, `${s.id}.year`);
    assert.ok(s.year > previous && s.year >= C.MIN_YEAR && s.year <= C.MAX_YEAR, `${s.id}: snapshot order/range`);
    previous = s.year;
    uniqueIds(s.regions, `${s.id}.regions`);
    sources(s.sources, s.id);
    for (const r of s.regions) {
      for (const key of ['name', 'detail']) text(r[key], `${s.id}/${r.id}.${key}`);
      assert.ok(['core', 'influence'].includes(r.kind), `${s.id}/${r.id}: unsupported region rendering`);
      assert.match(r.color, /^#[\da-f]{6}$/i, `${s.id}/${r.id}: invalid region color`);
      if (r.dynasty !== null) {
        assert.ok(dynastyById.has(r.dynasty), `${s.id}/${r.id}: broken dynasty link`);
        assert.ok(dynastyIdsAt(s.year).includes(r.dynasty), `${s.id}/${r.id}: dynasty not yet/existing in this frame`);
      }
    }
  }
  assert.equal(snapshotById.get('qin-210').year, -210, 'Qin southward extent is not a -221 snapshot');
  assert.equal(snapshotById.get('three-250').year, 250);
  assert.equal(snapshotById.get('sui-600').year, 600, 'do not project later canal work back into 600');
  assert.equal(snapshotById.get('qing-1820').year, 1820);
  assert.deepEqual(Array.from(snapshotById.get('three-250').regions, r => r.dynasty).sort(),
    ['cao-wei', 'eastern-wu', 'shu-han']);
  assert.ok(snapshotById.get('tang-750').regions.some(r => r.kind === 'influence'));
  assert.ok(snapshotById.get('qing-1820').regions.some(r => r.kind === 'influence'));
  text(A.note, 'atlas.note');
  sources(A.sources, 'atlas.sources');
});

test('schematic map polygons have finite coordinates, area and no crossing edges', () => {
  const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  for (const s of A.snapshots) for (const r of s.regions) {
    const where = `${s.id}/${r.id}`, points = r.points;
    assert.ok(Array.isArray(points) && points.length >= 3, `${where}: polygon needs three vertices`);
    points.forEach((p, i) => point(p, `${where}[${i}]`));
    point(r.label, `${where}.label`);
    assert.ok(new Set(points.map(p => p.join(','))).size >= 3, `${where}: degenerate polygon`);
    const areaTwice = points.reduce((area, p, i) => {
      const next = points[(i + 1) % points.length];
      return area + p[0] * next[1] - next[0] * p[1];
    }, 0);
    assert.ok(Math.abs(areaTwice) > 1e-8, `${where}: zero polygon area`);
    for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) {
      if (j === i + 1 || (i === 0 && j === points.length - 1)) continue;
      const [a, b, c, d] = [points[i], points[(i + 1) % points.length], points[j], points[(j + 1) % points.length]];
      const intersects = cross(a, b, c) * cross(a, b, d) < 0 && cross(c, d, a) * cross(c, d, b) < 0;
      assert.ok(!intersects, `${where}: edges ${i} and ${j} cross`);
    }
    // Labels may sit outside a tiny island for readability; do not mistake a
    // deliberate label offset (e.g. Taiwan) for a geographic data error.
  }
});

test('city/river layers and the bundled natural-land GeoJSON are geographic and complete', () => {
  assert.ok(A.cities.length > 0 && A.rivers.length > 0);
  for (const city of A.cities) { text(city.name, 'city.name'); coordinate(city.lon, city.lat, city.name); }
  for (const river of A.rivers) {
    text(river.name, 'river.name');
    assert.ok(Array.isArray(river.points) && river.points.length >= 2, `${river.name}: incomplete river`);
    river.points.forEach((p, i) => point(p, `${river.name}[${i}]`));
  }
  const land = W.LAND_GEOMETRY;
  assert.equal(land.type, 'FeatureCollection');
  assert.ok(Array.isArray(land.features) && land.features.length > 100, 'truncated natural-land asset');
  let coordinateCount = 0;
  for (const [index, feature] of land.features.entries()) {
    assert.equal(feature.type, 'Feature');
    const geometry = feature.geometry;
    assert.ok(['Polygon', 'MultiPolygon'].includes(geometry.type), `land ${index}: unsupported geometry`);
    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
    assert.ok(polygons.length > 0);
    for (const polygon of polygons) {
      assert.ok(polygon.length > 0, `land ${index}: empty polygon`);
      for (const ring of polygon) {
        assert.ok(ring.length >= 4, `land ${index}: incomplete ring`);
        assert.deepEqual(plain(ring[0]), plain(ring[ring.length - 1]), `land ${index}: unclosed ring`);
        ring.forEach(p => { point(p, `land ${index}`); coordinateCount++; });
      }
    }
  }
  assert.ok(coordinateCount > 5000, 'unexpectedly truncated land coordinates');
});

test('learning journeys and questions resolve to real eras and usable answer choices', () => {
  assert.equal(L.journeys.length, 6);
  assert.equal(L.questions.length, 12);
  for (const j of L.journeys) {
    for (const key of ['title', 'child', 'deep', 'prompt']) text(j[key], `journey.${key}`);
    assert.ok(dynastyById.has(j.dynasty), `journey: missing dynasty ${j.dynasty}`);
    year(j.year, 'journey.year');
    assert.ok(dynastyIdsAt(j.year).includes(j.dynasty), `${j.dynasty}: journey opens wrong era`);
  }
  for (const q of L.questions) {
    text(q.question, `${q.id}.question`);
    text(q.explanation, `${q.id}.explanation`);
    strings(q.options, `${q.id}.options`);
    assert.ok(q.options.length >= 2);
    assert.equal(new Set(q.options).size, q.options.length, `${q.id}: indistinguishable choices`);
    assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length, `${q.id}: unreachable correct answer`);
    assert.ok(dynastyById.has(q.dynasty), `${q.id}: broken follow-up link`);
  }
  const noZero = L.questions.find(q => q.id === 'q-no-zero');
  assert.equal(noZero.options[noZero.correct], '公元1年');
  const wuzhou = L.questions.find(q => q.id === 'q-wuzhou');
  assert.equal(wuzhou.options[wuzhou.correct], '周');
  const words = new Set();
  for (const entry of L.glossary) {
    assert.equal(entry.length, 2);
    entry.forEach((value, i) => text(value, `glossary[${i}]`));
    assert.ok(!words.has(entry[0]), `duplicate glossary entry ${entry[0]}`);
    words.add(entry[0]);
  }
  sources(D.sources, 'content.source register');
});
