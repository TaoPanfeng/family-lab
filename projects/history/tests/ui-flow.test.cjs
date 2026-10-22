'use strict';

/*
 * DOM integration tests for the fully extracted, offline application.
 * These execute the actual HTML scripts and dispatch public DOM events. They do
 * not call application-private functions or manufacture application state.
 *
 * jsdom has no layout engine, native pointer retargeting, IME, browser download
 * manager, or modal focus trap. The explicit adapters below permit DOM/state
 * regression tests; they are NOT evidence of real-browser visual, touch, focus,
 * file:// storage policy, or assistive-technology testing. Composition and
 * pointer tests verify application event handling, not an operating-system IME.
 * Run with: node --test --test-isolation=none tests/ui-flow.test.cjs
 * or: node tests/ui-flow.test.cjs (also avoids sandbox child-process limits).
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const HTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const KEY = 'guanshi.history.v1';

function fakeClock(window) {
  let now = 0, nextId = 1;
  const pending = new Map();
  const schedule = (fn, delay, repeat, args) => {
    const id = nextId++, ms = Math.max(1, Number(delay) || 0);
    pending.set(id, { fn, args, due: now + ms, repeat: repeat ? ms : 0 });
    return id;
  };
  window.setTimeout = (fn, delay, ...args) => schedule(fn, delay, false, args);
  window.setInterval = (fn, delay, ...args) => schedule(fn, delay, true, args);
  window.clearTimeout = window.clearInterval = id => pending.delete(id);
  return {
    tick(ms) {
      const end = now + ms;
      let calls = 0;
      while (true) {
        const next = [...pending].filter(([, task]) => task.due <= end)
          .sort((a, b) => a[1].due - b[1].due)[0];
        if (!next) break;
        assert.ok(++calls < 1000, 'fake timer must not enter an infinite loop');
        const [id, task] = next;
        now = task.due;
        if (task.repeat) task.due += task.repeat;
        else pending.delete(id);
        task.fn(...task.args);
      }
      now = end;
    },
    intervalCount: () => [...pending.values()].filter(x => x.repeat).length
  };
}

function boot(t, options = {}) {
  const errors = [], downloads = [], blobs = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', error => errors.push(error));
  const dom = new JSDOM(HTML, {
    url: `https://offline-history.test/index.html${options.hash || ''}`,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole: vc
  });
  const w = dom.window, d = w.document;
  w.addEventListener('error', event => errors.push(event.error || event.message));
  const clock = fakeClock(w);
  w.scrollTo = () => {};
  w.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  w.HTMLDialogElement.prototype.close = function () {
    if (!this.open) return;
    this.removeAttribute('open');
    this.dispatchEvent(new w.Event('close'));
  };
  w.URL.createObjectURL = blob => { blobs.push(blob); return `blob:dom-test-${blobs.length}`; };
  w.URL.revokeObjectURL = () => {};
  w.HTMLAnchorElement.prototype.click = function () {
    downloads.push({ href: this.href, filename: this.download });
  };
  if (options.storage !== undefined) {
    w.localStorage.setItem(KEY, typeof options.storage === 'string' ? options.storage : JSON.stringify(options.storage));
  }
  if (options.blockStorage) {
    Object.defineProperty(w, 'localStorage', { configurable: true, get() { throw new w.DOMException('Storage blocked', 'SecurityError'); } });
  }
  for (const script of d.querySelectorAll('script[src]')) {
    const relative = script.getAttribute('src');
    assert.ok(!/^(?:[a-z]+:)?\/\//i.test(relative), `runtime script is local: ${relative}`);
    w.eval(`${fs.readFileSync(path.join(ROOT, relative), 'utf8')}\n//# sourceURL=${relative}`);
  }
  const ui = {
    dom, w, d, clock, downloads, blobs, errors,
    rulers: [...w.EARLY_RULERS, ...w.LATE_RULERS],
    events: w.HISTORY_CONTENT.events,
    worlds: w.HISTORY_CONTENT.world,
    snapshots: w.HISTORY_ATLAS.snapshots,
    $(selector, scope = d) {
      const element = scope.querySelector(selector);
      assert.ok(element, `expected DOM element: ${selector}`);
      return element;
    },
    click(selectorOrElement) {
      const element = typeof selectorOrElement === 'string' ? this.$(selectorOrElement) : selectorOrElement;
      assert.ok(element && !element.disabled, 'only enabled, present controls can be clicked');
      element.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
      return element;
    },
    input(selector, value, extra = {}) {
      const element = this.$(selector);
      element.value = value;
      element.dispatchEvent(new w.InputEvent('input', { bubbles: true, inputType: 'insertText', data: value, ...extra }));
      return element;
    },
    change(selector, value) {
      const element = this.$(selector);
      element.value = String(value);
      element.dispatchEvent(new w.Event('change', { bubbles: true }));
    },
    key(element, key) { element.dispatchEvent(new w.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })); },
    nav(view) {
      this.click(`[data-action="nav"][data-view="${view}"]`);
      assert.equal(w.location.hash, `#${view}`);
    },
    close() { this.click('#detail-dialog [data-action="close-dialog"]'); assert.equal(this.$('#detail-dialog').open, false); },
    saved() { return JSON.parse(w.localStorage.getItem(KEY)); },
    year(year) {
      this.input('#year-input', String(year));
      this.$('#year-form').dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
    },
    openRuler(id) {
      this.nav('rulers');
      this.change('#ruler-dynasty', 'all');
      const ruler = this.rulers.find(r => r.id === id);
      assert.ok(ruler, `known ruler ${id}`);
      this.input('#ruler-search', ruler.name);
      this.click(`.ruler-card [data-action="ruler"][data-id="${id}"]`);
      return ruler;
    },
    openEvent(id) {
      this.nav('events');
      this.change('#event-dynasty', 'all');
      this.input('#event-search', '');
      this.click('[data-action="event-kind"][data-kind="all"]');
      this.click(`.event-card [data-action="event"][data-id="${id}"]`);
    }
  };
  t.after(() => {
    try { assert.deepEqual(errors.map(e => e.message || String(e)), [], 'no script or DOM-event exceptions'); }
    finally { dom.window.close(); }
  });
  return ui;
}

test('offline startup executes only bundled scripts and renders the current collection', t => {
  const ui = boot(t);
  assert.equal(ui.rulers.length, 264);
  assert.equal(ui.events.length, 38);
  assert.equal(ui.worlds.length, 19);
  assert.equal(ui.$('#navigation').children.length, 7);
  assert.match(ui.$('#main').textContent, /264/);
  assert.equal(ui.$('#current-year-label').textContent, '公元750年');
  assert.equal(ui.d.querySelectorAll('.era-bar[data-id="tang"]').length, 2);
  for (const element of ui.d.querySelectorAll('script[src],link[rel="stylesheet"],link[rel="icon"]')) {
    const resource = element.getAttribute('src') || element.getAttribute('href');
    assert.ok(fs.existsSync(path.join(ROOT, resource)), `bundled asset exists: ${resource}`);
  }
  assert.doesNotMatch(fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8'), /\bfetch\s*\(|XMLHttpRequest|\bimport\s*\(/);
  assert.doesNotMatch(fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8'), /@import|url\(\s*['"]?https?:/);
});

test('all eight navigation destinations render and update URL/title/current-page state', t => {
  const ui = boot(t);
  for (const [view, title] of [['rulers','帝王档案'],['atlas','地图演变'],['events','战争与转折'],['world','同期世界'],['learn','小小史官'],['bookmarks','我的收藏'],['sources','史料与阅读说明'],['overview','历史长河']]) {
    ui.nav(view);
    assert.equal(ui.$('#view-title').textContent, title);
    assert.ok(ui.$('#main').textContent.trim().length > 80, view);
    if (view !== 'sources') assert.equal(ui.$(`#navigation [data-view="${view}"]`).getAttribute('aria-current'), 'page');
  }
});

test('deep/child mode changes the actual reading text and survives reload', t => {
  const ui = boot(t);
  const before = ui.$('.hero p').textContent;
  ui.click('[data-action="mode"][data-mode="deep"]');
  assert.equal(ui.d.body.dataset.mode, 'deep');
  assert.notEqual(ui.$('.hero p').textContent, before);
  const restored = boot(t, { storage: ui.saved() });
  assert.equal(restored.d.body.dataset.mode, 'deep');
  restored.openRuler('tang-taizong');
  assert.equal(restored.d.querySelector('#detail-dialog .detail-child'), null);
  restored.close();
  restored.click('[data-action="mode"][data-mode="child"]');
  restored.openRuler('tang-taizong');
  assert.ok(restored.$('#detail-dialog .detail-child').textContent.length > 10);
});

test('timeline zoom respects its limits, dynasty focus, and reset without invalid widths', t => {
  const ui = boot(t);
  const initial = parseFloat(ui.$('#timeline-canvas').style.width);
  ui.click('[data-action="timeline-zoom"][data-factor="1.7"]');
  assert.ok(parseFloat(ui.$('#timeline-canvas').style.width) > initial);
  for (let i = 0; i < 20 && !ui.$('[data-action="timeline-zoom"][data-factor="1.7"]').disabled; i++) ui.click('[data-action="timeline-zoom"][data-factor="1.7"]');
  assert.equal(ui.$('#zoom-label').textContent, '40.0×');
  assert.equal(ui.$('[data-action="timeline-zoom"][data-factor="1.7"]').disabled, true);
  ui.click('[data-action="timeline-dynasty"]');
  assert.ok(parseFloat(ui.$('#zoom-label').textContent) > 1);
  ui.click('[data-action="timeline-fit"]');
  assert.equal(ui.$('#zoom-label').textContent, '1.0×');
  assert.equal(ui.$('[data-action="timeline-zoom"][data-factor="0.6"]').disabled, true);
  for (const bar of ui.d.querySelectorAll('.era-bar')) assert.ok(Number.isFinite(parseFloat(bar.style.left)) && parseFloat(bar.style.width) >= 3);
});

test('year form rejects year zero, fractions and out-of-range values while accepting BCE years', t => {
  const ui = boot(t);
  for (const bad of ['0', '-0', '1913', '-2071', '750.5', 'abc']) {
    ui.year(bad);
    assert.equal(ui.$('#current-year-label').textContent, '公元750年');
    assert.equal(ui.$('#year-input').getAttribute('aria-invalid'), 'true');
  }
  ui.year(-221);
  assert.equal(ui.$('#current-year-label').textContent, '公元前221年');
  assert.match(ui.$('.dynasty-heading').textContent, /秦/);
  ui.year(-1); assert.equal(ui.$('#current-year-label').textContent, '公元前1年');
  ui.year(1); assert.equal(ui.$('#current-year-label').textContent, '公元1年');
});

test('timeline slider commits parallel kingdoms and the Wu Zhou interruption correctly', t => {
  const ui = boot(t);
  ui.change('#year-slider', 249);
  const active = [...ui.d.querySelectorAll('.active-era-list button')].map(x => x.dataset.id);
  assert.deepEqual(active, ['cao-wei','shu-han','eastern-wu']);
  ui.change('#year-slider', 699);
  assert.equal(ui.$('#current-year-label').textContent, '公元700年');
  assert.equal(ui.d.querySelector('.active-era-list [data-id="tang"]'), null);
  assert.ok(ui.$('.active-era-list [data-id="wu-zhou"]'));
});

test('selecting a dynasty synchronizes the atlas epoch and clears the previous camera', t => {
  const ui = boot(t);
  ui.nav('atlas');
  ui.click('[data-action="map-zoom"][data-factor="0.7"]');
  ui.nav('overview');
  ui.click('.era-bar[data-id="ming"]');
  const selectedYear = ui.saved().year;
  assert.ok(selectedYear >= 1368 && selectedYear <= 1644);
  const nearest = ui.snapshots.reduce((a,b) => Math.abs(b.year-selectedYear) < Math.abs(a.year-selectedYear) ? b : a);
  assert.match(ui.$('.map-teaser').textContent, new RegExp(String(nearest.year)));
  ui.nav('atlas');
  const index = Number(ui.$('#snapshot-select').value);
  assert.equal(ui.snapshots[index].year, nearest.year);
  assert.match(ui.$('.map-period-label').textContent, new RegExp(String(nearest.year)));
});

test('ruler filters, clear and pagination reveal every archived ruler exactly once', t => {
  const ui = boot(t);
  ui.nav('rulers');
  assert.equal(ui.$('#ruler-dynasty').value, 'tang');
  ui.change('#ruler-dynasty', 'qing');
  assert.equal(ui.d.querySelectorAll('.ruler-card').length, 12);
  ui.click('[data-action="ruler-reset"]');
  assert.equal(ui.$('#ruler-dynasty').value, 'all');
  const seen = new Set();
  while (true) {
    for (const button of ui.d.querySelectorAll('.ruler-card [data-action="ruler"]')) {
      assert.ok(!seen.has(button.dataset.id), `no repeated card ${button.dataset.id}`);
      seen.add(button.dataset.id);
    }
    const next = ui.d.querySelector('[data-action="ruler-page"][data-delta="1"]');
    if (!next || next.disabled) break;
    ui.click(next);
  }
  assert.equal(seen.size, 264);
  assert.equal(ui.$('[data-action="ruler-page"][data-delta="1"]').disabled, true);
  ui.input('#ruler-search', '李世民');
  assert.equal(ui.d.querySelectorAll('.ruler-card').length, 1);
  assert.match(ui.$('.ruler-card h3').textContent, /唐太宗/);
  ui.input('#ruler-search', '根本没有这个名字');
  assert.equal(ui.d.querySelectorAll('.ruler-card').length, 0);
  ui.click('[data-action="ruler-reset"]');
  assert.equal(ui.d.querySelectorAll('.ruler-card').length, 12);
});

test('ruler keyword search includes the achievements and costs the user can read', t => {
  const ui = boot(t);
  ui.nav('rulers'); ui.click('[data-action="ruler-reset"]');
  for (const [query, expected] of [['文字狱','qing-qianlong'],['摊丁入亩','qing-yongzheng'],['永乐大典','ming-chengzu']]) {
    ui.input('#ruler-search', query);
    assert.ok(ui.d.querySelector(`.ruler-card [data-action="ruler"][data-id="${expected}"]`), `body keyword ${query} finds ${expected}`);
  }
});

test('Chinese ruler-search composition preserves the input until the text is committed', t => {
  const ui = boot(t);
  ui.nav('rulers');
  const input = ui.$('#ruler-search');
  input.focus();
  input.dispatchEvent(new ui.w.CompositionEvent('compositionstart', { bubbles: true, data: '' }));
  ui.input('#ruler-search', 'li', { isComposing: true });
  assert.equal(ui.$('#ruler-search'), input, 'composition must not replace the live input node');
  input.value = '李世民';
  input.dispatchEvent(new ui.w.CompositionEvent('compositionend', { bubbles: true, data: '李世民' }));
  // Browsers also dispatch the final non-composing input after compositionend.
  ui.input('#ruler-search', '李世民', { isComposing: false });
  assert.equal(ui.$('#ruler-search').value, '李世民');
  assert.equal(ui.d.querySelectorAll('.ruler-card').length, 1);
  assert.match(ui.$('.ruler-card').textContent, /唐太宗/);
});

test('global search opens matched objects, handles special text, Enter, Escape and slash', t => {
  const ui = boot(t);
  ui.key(ui.$('#main'), '/');
  assert.equal(ui.d.activeElement, ui.$('#global-search'));
  ui.input('#global-search', '李世民');
  assert.equal(ui.$('#search-results').hidden, false);
  ui.key(ui.$('#global-search'), 'Enter');
  assert.equal(ui.$('#detail-dialog').open, true);
  assert.equal(ui.$('#detail-dialog h2').textContent, '唐太宗');
  ui.close();
  ui.input('#global-search', '<img src=x onerror=alert(1)>');
  assert.equal(ui.d.querySelector('#search-results img'), null);
  assert.match(ui.$('#search-results').textContent, /暂无匹配/);
  ui.key(ui.$('#global-search'), 'Escape'); assert.equal(ui.$('#search-results').hidden, true);
  ui.input('#global-search', '   '); assert.equal(ui.$('#search-results').hidden, true);
});

test('all 264 ruler dialogs expose life, reign, achievements, costs, notes and citations', t => {
  const ui = boot(t);
  ui.nav('rulers'); ui.click('[data-action="ruler-reset"]');
  const byId = new Map(ui.rulers.map(r => [r.id, r]));
  let checked = 0;
  while (true) {
    const buttons = [...ui.d.querySelectorAll('.ruler-card [data-action="ruler"]')];
    for (const button of buttons) {
      const r = byId.get(button.dataset.id);
      ui.click(button);
      const modal = ui.$('#detail-dialog');
      assert.equal(modal.open, true, r.id);
      assert.equal(ui.$('h2', modal).textContent, r.name);
      assert.equal(ui.d.querySelectorAll('#detail-dialog .date-tile').length, 3, r.id);
      assert.ok(modal.textContent.includes(r.achievement), `${r.id} achievement`);
      assert.ok(modal.textContent.includes(r.cost), `${r.id} cost`);
      assert.ok(modal.textContent.includes(r.child), `${r.id} child text`);
      if (r.note) assert.ok(modal.textContent.includes(r.note), `${r.id} note`);
      assert.ok(ui.d.querySelectorAll('#detail-dialog .sources-details a').length > 0, r.id);
      assert.doesNotMatch(modal.textContent, /\b(?:undefined|NaN)\b/, r.id);
      ui.close(); checked++;
    }
    const next = ui.d.querySelector('[data-action="ruler-page"][data-delta="1"]');
    if (!next || next.disabled) break;
    ui.click(next);
  }
  assert.equal(checked, 264);
  assert.equal(ui.saved().visited.length, 264);
});

test('split reigns, very short reigns and unknown death dates remain explicit in the dialog', t => {
  const ui = boot(t);
  ui.openRuler('ming-yingzong');
  assert.match(ui.$('#detail-dialog').textContent, /1435年 — 1449年；1457年 — 1464年/);
  assert.match(ui.$('#detail-dialog').textContent, /约21年/);
  ui.close();
  ui.openRuler('tang-shang');
  assert.match(ui.$('#detail-dialog').textContent, /不足1年（同年）/);
  ui.close();
  ui.openRuler('ming-jianwen');
  assert.match(ui.$('#detail-dialog').textContent, /年代未详/);
  assert.match(ui.$('#detail-dialog').textContent, /生卒资料不足，不计算寿命/);
});

test('coverage table accounts for every ruler and its dynasty links open the correct filter', t => {
  const ui = boot(t);
  ui.nav('sources');
  const rows = [...ui.d.querySelectorAll('.coverage-table tbody tr')];
  assert.equal(rows.length, 38);
  assert.equal(rows.reduce((n, row) => n + Number(row.cells[2].textContent), 0), 264);
  for (const row of rows) {
    const id = row.querySelector('button').dataset.id;
    assert.equal(Number(row.cells[2].textContent), ui.rulers.filter(r => r.dynasty === id).length, id);
  }
  ui.click('.coverage-table [data-id="wu-zhou"]');
  assert.equal(ui.$('#ruler-dynasty').value, 'wu-zhou');
  assert.equal(ui.d.querySelectorAll('.ruler-card').length, 1);
  assert.match(ui.$('.ruler-card').textContent, /武则天/);
});

test('event filters combine dynasty, type and text; composing input is not replaced', t => {
  const ui = boot(t);
  ui.nav('events');
  ui.click('[data-action="event-kind"][data-kind="battle"]');
  assert.equal(ui.d.querySelectorAll('.event-card').length, ui.events.filter(e => e.kind === 'battle').length);
  ui.change('#event-dynasty', 'tang');
  assert.equal(ui.d.querySelectorAll('.event-card').length, ui.events.filter(e => e.kind === 'battle' && e.dynasties.includes('tang')).length);
  // The curated Tang items are turning points; retain Tang but widen the type.
  ui.click('[data-action="event-kind"][data-kind="all"]');
  const input = ui.$('#event-search');
  input.dispatchEvent(new ui.w.CompositionEvent('compositionstart', { bubbles: true }));
  ui.input('#event-search', 'an', { isComposing: true });
  assert.equal(ui.$('#event-search'), input);
  input.value = '安史';
  input.dispatchEvent(new ui.w.CompositionEvent('compositionend', { bubbles: true, data: '安史' }));
  ui.input('#event-search', '安史');
  assert.equal(ui.d.querySelectorAll('.event-card').length, 1);
  assert.match(ui.$('.event-card').textContent, /安史/);
  ui.input('#event-search', '不存在的战役');
  assert.ok(ui.$('.empty-state'));
  ui.click('[data-action="event-reset"]');
  assert.equal(ui.d.querySelectorAll('.event-card').length, 38);
});

test('all 38 event details preserve cause, outcome, social impact and source links', t => {
  const ui = boot(t);
  ui.nav('events');
  for (const event of ui.events) {
    ui.click(`.event-card [data-action="event"][data-id="${event.id}"]`);
    const text = ui.$('#detail-dialog').textContent;
    assert.equal(ui.$('#detail-dialog h2').textContent, event.title);
    for (const field of ['cause','result','impact','actors','lesson']) assert.ok(text.includes(event[field]), `${event.id} ${field}`);
    assert.equal(ui.d.querySelectorAll('#detail-dialog .causal-item').length, 3);
    assert.ok(ui.d.querySelectorAll('#detail-dialog .sources-details a').length > 0);
    ui.close();
  }
});

test('all 19 world cards and map keyboard controls open the correct civilization details', t => {
  const ui = boot(t);
  ui.nav('world');
  ui.click('[data-action="world-all"]');
  assert.equal(ui.d.querySelectorAll('.world-card').length, 19);
  for (const world of ui.worlds) {
    ui.click(`.world-card [data-action="world-detail"][data-id="${world.id}"]`);
    assert.equal(ui.$('#detail-dialog h2').textContent, world.name);
    assert.ok(ui.$('#detail-dialog').textContent.includes(world.summary));
    ui.close();
  }
  const marker = ui.$('.world-map svg [role="button"]');
  ui.key(marker, ' ');
  assert.equal(ui.$('#detail-dialog').open, true);
  ui.close();
  ui.click('[data-action="world-all"]');
  ui.change('#world-year', 249);
  assert.equal(ui.$('#world-year-label').textContent, '公元250年');
  assert.equal(ui.d.querySelectorAll('.world-card').length, ui.worlds.filter(w => w.start <= 250 && w.end >= 250).length);
});

test('bookmarks from ruler and event dialogs persist, restore and can be removed', t => {
  const ui = boot(t);
  ui.openRuler('tang-taizong');
  ui.click('#detail-dialog [data-action="bookmark"]');
  assert.equal(ui.$('#detail-dialog [data-action="bookmark"]').getAttribute('aria-pressed'), 'true');
  ui.close();
  ui.openEvent('fei-river');
  ui.click('#detail-dialog [data-action="bookmark"]');
  ui.close(); ui.nav('bookmarks');
  assert.equal(ui.d.querySelectorAll('.bookmark-item').length, 2);
  const restored = boot(t, { storage: ui.saved() });
  restored.nav('bookmarks');
  assert.equal(restored.d.querySelectorAll('.bookmark-item').length, 2);
  restored.click('.bookmark-item [data-action="ruler"]');
  assert.equal(restored.$('#detail-dialog h2').textContent, '唐太宗');
  restored.close();
  restored.click('[data-action="bookmark"][data-key="r:tang-taizong"]');
  assert.equal(restored.d.querySelectorAll('.bookmark-item').length, 1);
  restored.click('[data-action="bookmark"][data-key="e:fei-river"]');
  assert.equal(restored.d.querySelectorAll('.bookmark-item').length, 0);
  assert.ok(restored.$('.empty-state'));
});

test('corrupt or stale local storage cannot crash startup or inject saved-note markup', t => {
  const corrupt = boot(t, { storage: '{not json' });
  assert.equal(corrupt.$('#current-year-label').textContent, '公元750年');
  const ui = boot(t, { storage: {
    mode: 'unexpected', year: 0,
    bookmarks: ['r:missing','e:missing','r:tang-taizong','r:tang-taizong',7],
    visited: ['missing','tang-taizong','tang-taizong'],
    answered: ['missing','q-no-zero','q-no-zero'], journey: 999,
    notes: '</textarea><img src=x onerror="alert(1)">'
  }});
  ui.nav('bookmarks'); assert.equal(ui.d.querySelectorAll('.bookmark-item').length, 1);
  ui.nav('learn');
  assert.equal(ui.d.querySelector('#main img'), null);
  assert.equal(ui.$('#learning-notes').value, '</textarea><img src=x onerror="alert(1)">');
  assert.match(ui.$('.journey-panel').textContent, /6 \/ 6/);
  assert.match(ui.$('.progress-card').textContent, /1 \/ 12/);
});

test('blocked browser storage leaves reading, editing and exporting usable with honest status', t => {
  const ui = boot(t, { blockStorage: true });
  ui.nav('learn');
  ui.input('#learning-notes', '离线也能继续思考。');
  assert.match(ui.$('#note-status').textContent, /限制保存|导出/);
  ui.click('[data-action="export-notes"]');
  assert.equal(ui.downloads.length, 1);
  assert.equal(ui.downloads[0].filename, 'guanshi-history-notes.md');
  ui.openRuler('tang-taizong');
  assert.equal(ui.$('#detail-dialog').open, true);
});

test('comparison limits selection to three, renders substantive fields, supports remove and clear', t => {
  const ui = boot(t);
  ui.nav('rulers');
  const ids = [...ui.d.querySelectorAll('.ruler-card [data-action="compare-toggle"]')].slice(0,4).map(e => e.dataset.id);
  for (const id of ids) ui.click(`.ruler-card [data-action="compare-toggle"][data-id="${id}"]`);
  assert.equal(ui.d.querySelectorAll('.ruler-card [data-action="compare-toggle"].selected').length, 3);
  assert.match(ui.$('#toast').textContent, /最多/);
  ui.click('[data-action="compare-open"]');
  assert.equal(ui.d.querySelectorAll('.comparison-table thead th').length, 4);
  assert.match(ui.$('.comparison-table').textContent, /局限与代价/);
  ui.close();
  ui.click(`.ruler-card [data-action="compare-toggle"][data-id="${ids[0]}"]`);
  assert.equal(ui.d.querySelectorAll('.ruler-card [data-action="compare-toggle"].selected').length, 2);
  ui.click('[data-action="compare-clear"]');
  assert.equal(ui.d.querySelector('.compare-tray'), null);
  assert.equal(ui.d.querySelectorAll('.ruler-card [data-action="compare-toggle"].selected').length, 0);
});

test('quiz records only correct answers, prevents answer changes, wraps and never double counts', t => {
  const ui = boot(t);
  ui.nav('learn');
  const questions = ui.w.HISTORY_LEARNING.questions;
  const wrong = (questions[0].correct + 1) % questions[0].options.length;
  ui.click(`[data-action="quiz-answer"][data-index="${wrong}"]`);
  assert.equal(ui.d.querySelectorAll('.quiz-option:disabled').length, questions[0].options.length);
  assert.match(ui.$('.quiz-feedback').textContent, /一起弄明白|调整/);
  assert.equal(ui.saved()?.answered?.length || 0, 0);
  ui.click('[data-action="quiz-step"][data-delta="1"]');
  ui.click('[data-action="quiz-step"][data-delta="-1"]');
  for (const q of questions) {
    ui.click(`[data-action="quiz-answer"][data-index="${q.correct}"]`);
    assert.ok(ui.$('.quiz-feedback').textContent.includes(q.explanation));
    assert.ok(ui.d.querySelector('.quiz-option.correct'));
    ui.click('[data-action="quiz-step"][data-delta="1"]');
  }
  assert.match(ui.$('.question-number').textContent, /第 1 \/ 12 题/);
  assert.equal(ui.saved().answered.length, 12);
  ui.click(`[data-action="quiz-answer"][data-index="${questions[0].correct}"]`);
  assert.equal(ui.saved().answered.length, 12);
  const restored = boot(t, { storage: ui.saved(), hash: '#learn' });
  assert.match(restored.$('.progress-card').textContent, /12 \/ 12/);
});

test('journey selection persists and its departure opens the requested era; glossary is usable', t => {
  const ui = boot(t);
  ui.nav('learn');
  ui.click('.journey-steps [data-index="1"]');
  assert.equal(ui.saved().journey, 1);
  ui.click('[data-action="journey-go"]');
  assert.equal(ui.$('#current-year-label').textContent, '公元250年');
  assert.match(ui.$('.dynasty-heading').textContent, /曹魏/);
  ui.nav('learn'); ui.click('[data-action="glossary"]');
  assert.equal(ui.d.querySelectorAll('#detail-dialog .fact-block').length, ui.w.HISTORY_LEARNING.glossary.length);
  assert.match(ui.$('#detail-dialog').textContent, /在位与掌权/);
});

test('notes preserve Chinese text and literal markup through save/reload and Markdown export', async t => {
  const ui = boot(t);
  const note = '我原来以为皇帝做了一切。\n现在发现：普通人也创造了历史。\n<不是标签> & "问题"';
  ui.nav('learn'); ui.input('#learning-notes', note);
  assert.equal(ui.saved().notes, note);
  const restored = boot(t, { storage: ui.saved(), hash: '#learn' });
  assert.equal(restored.$('#learning-notes').value, note);
  restored.click('[data-action="export-notes"]');
  assert.equal(restored.downloads[0].filename, 'guanshi-history-notes.md');
  const exported = await new Promise((resolve, reject) => {
    const reader = new restored.w.FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(restored.blobs[0]);
  });
  assert.ok(exported.includes(note));
  assert.match(exported, /## 收藏/);
  assert.match(exported, /## 探索记录/);
});

test('all atlas snapshots can be selected and agree across dropdown, slider and displayed year', t => {
  const ui = boot(t);
  ui.nav('atlas');
  for (let index = 0; index < ui.snapshots.length; index++) {
    ui.change('#snapshot-select', index);
    assert.equal(Number(ui.$('#snapshot-slider').value), index);
    assert.equal(ui.saved().year, ui.snapshots[index].year);
    assert.equal(ui.d.querySelectorAll('.map-legend button').length, ui.snapshots[index].regions.length);
    assert.equal(ui.d.querySelectorAll('#atlas-svg .region').length, ui.snapshots[index].regions.length);
    assert.doesNotMatch(ui.$('#atlas-svg').outerHTML, /\b(?:NaN|undefined)\b/);
  }
  assert.equal(ui.$('[data-action="snapshot-step"][data-delta="1"]').disabled, true);
  ui.change('#snapshot-slider', 0);
  assert.equal(ui.$('[data-action="snapshot-step"][data-delta="-1"]').disabled, true);
});

test('atlas legend, zoom, layers and reset preserve coherent public DOM state', t => {
  const ui = boot(t);
  ui.nav('atlas');
  const initial = ui.$('#atlas-svg').getAttribute('viewBox');
  const region = ui.$('.map-legend button').dataset.id;
  ui.click(`.map-legend [data-id="${region}"]`);
  assert.equal(ui.$(`.map-legend [data-id="${region}"]`).getAttribute('aria-pressed'), 'true');
  assert.ok(ui.d.querySelector(`#atlas-svg [data-id="${region}"] .chosen`));
  ui.click('[data-action="map-zoom"][data-factor="0.7"]');
  const zoomed = ui.$('#atlas-svg').getAttribute('viewBox');
  assert.ok(Number(zoomed.split(' ')[2]) < Number(initial.split(' ')[2]));
  for (const [layer, selector] of [['showCities','.city-point'],['showRivers','.map-river'],['showBattles','.event-point']]) {
    ui.click(`[data-action="map-layer"][data-layer="${layer}"]`);
    assert.equal(ui.d.querySelectorAll(`#atlas-svg ${selector}`).length, 0, layer);
    assert.equal(ui.$('#atlas-svg').getAttribute('viewBox'), zoomed);
    ui.click(`[data-action="map-layer"][data-layer="${layer}"]`);
  }
  ui.click('[data-action="map-reset"]');
  assert.equal(ui.$('#atlas-svg').getAttribute('viewBox'), initial);
  ui.key(ui.$(`#atlas-svg [data-id="${region}"]`), 'Enter');
  assert.equal(ui.$(`.map-legend [data-id="${region}"]`).getAttribute('aria-pressed'), 'true');
});

test('pointer handler delays capture until a drag, pans, and does not treat dragging as a region click', t => {
  const ui = boot(t);
  ui.nav('atlas');
  const svg = ui.$('#atlas-svg'), point = ui.$('#atlas-svg .region');
  let captured = false, captures = 0;
  svg.getScreenCTM = () => ({ inverse: () => ({}) });
  svg.getBoundingClientRect = () => ({ left: 0, top: 0, width: 800, height: 500 });
  svg.setPointerCapture = () => { captured = true; captures++; };
  svg.hasPointerCapture = () => captured;
  svg.releasePointerCapture = () => { captured = false; };
  ui.w.DOMPoint = class { constructor(x,y) { this.x=x; this.y=y; } matrixTransform() { return this; } };
  const pointer = (target, type, x,y) => {
    const event = new ui.w.MouseEvent(type, { bubbles: true, button: 0, clientX:x, clientY:y });
    Object.defineProperty(event, 'pointerId', { value:1 }); target.dispatchEvent(event);
  };
  const before = svg.getAttribute('viewBox');
  pointer(point, 'pointerdown', 100,100);
  assert.equal(captures, 0, 'an ordinary click must not capture to the root SVG');
  pointer(svg, 'pointermove', 130,115);
  assert.ok(captures > 0, 'a drag should capture its pointer');
  assert.notEqual(svg.getAttribute('viewBox'), before);
  pointer(svg, 'pointerup', 130,115);
  ui.click(point);
  assert.equal(ui.d.querySelectorAll('#atlas-svg .region.chosen').length, 0, 'synthetic click after dragging is suppressed');
});

test('every geolocated event has an explicit selected marker after its map action, including distant slices', t => {
  const ui = boot(t);
  const located = ui.events.filter(e => Number.isFinite(e.lon) && Number.isFinite(e.lat));
  assert.ok(located.some(e => e.id === 'sarhu'));
  for (const event of located) {
    ui.openEvent(event.id);
    ui.click('#detail-dialog [data-action="event-map"]');
    assert.equal(ui.w.location.hash, '#atlas');
    assert.equal(ui.$('#detail-dialog').open, false);
    assert.ok(ui.d.querySelector(`#atlas-svg [data-action="event"][data-id="${event.id}"]`), `${event.id} selected marker must survive the ±55-year filter`);
    assert.equal(ui.saved().year, event.year, event.id);
    const [x,y,width,height] = ui.$('#atlas-svg').getAttribute('viewBox').split(/\s+/).map(Number);
    assert.ok(event.lon >= x && event.lon <= x+width && -event.lat >= y && -event.lat <= y+height, `${event.id} lies inside the focused camera`);
  }
});

test('map playback advances under a fake clock and stops on manual change or leaving the atlas', t => {
  const ui = boot(t);
  ui.nav('atlas'); ui.change('#snapshot-select', 0);
  ui.click('[data-action="map-play"]');
  assert.equal(ui.clock.intervalCount(), 1);
  ui.clock.tick(2600);
  assert.equal(Number(ui.$('#snapshot-select').value), 1);
  ui.change('#snapshot-select', 3);
  assert.equal(ui.clock.intervalCount(), 0);
  ui.clock.tick(5200); assert.equal(Number(ui.$('#snapshot-select').value), 3);
  ui.click('[data-action="map-play"]'); ui.nav('rulers');
  assert.equal(ui.clock.intervalCount(), 0);
  ui.nav('atlas'); ui.change('#snapshot-select', ui.snapshots.length-1);
  ui.click('[data-action="map-play"]');
  assert.equal(Number(ui.$('#snapshot-select').value), 0, 'play at the final frame restarts at the first frame');
  ui.w.dispatchEvent(new ui.w.Event('pagehide'));
  assert.equal(ui.clock.intervalCount(), 0);
});

test('source links are explicit external reading and direct hash destinations stay usable', t => {
  const ui = boot(t, { hash:'#sources' });
  const links = [...ui.d.querySelectorAll('.source-link-list a')];
  assert.ok(links.length > 20);
  for (const link of links) {
    assert.match(link.href, /^https:\/\//);
    assert.equal(link.target, '_blank');
    assert.match(link.rel, /noopener/);
  }
  assert.match(ui.$('#main').textContent, /离线/);
  assert.match(ui.$('#main').textContent, /不能代替专业史学审校/);
  ui.w.location.hash = '#world';
  ui.w.dispatchEvent(new ui.w.HashChangeEvent('hashchange'));
  assert.equal(ui.$('#view-title').textContent, '同期世界');
});

test('skip-to-main anchor moves focus without changing the current view or active filter', t => {
  const ui = boot(t);
  ui.nav('rulers');
  ui.input('#ruler-search', '李世民');
  const main = ui.$('#main'), grid = ui.$('.ruler-grid');
  const skip = ui.$('.skip-link');
  assert.equal(skip.getAttribute('href'), '#main');
  skip.focus();
  // Native anchor scrolling/layout is outside jsdom; dispatch its public hash event.
  ui.w.location.hash = '#main';
  ui.w.dispatchEvent(new ui.w.HashChangeEvent('hashchange'));
  assert.equal(ui.$('#view-title').textContent, '帝王档案');
  assert.equal(ui.$('.ruler-grid'), grid, 'skip link must not rerender the current page');
  assert.equal(ui.$('#ruler-search').value, '李世民');
  assert.equal(ui.d.activeElement, main);
});
