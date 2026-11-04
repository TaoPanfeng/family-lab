/* Pure chronological helpers shared by the browser and the Node test suite. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HistoryCore = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const MIN_YEAR = -2070, MAX_YEAR = 1912;
  function validYear(y) { return Number.isInteger(y) && y !== 0; }
  // The historical calendar has no year zero: 1 BCE is followed by 1 CE.
  function ordinal(y) { if (!validYear(y)) return null; return y > 0 ? y - 1 : y; }
  function fromOrdinal(n) { n = Math.round(n); return n >= 0 ? n + 1 : n; }
  function yearLabel(y, full = true) {
    if (!validYear(y)) return '年代未详';
    return y < 0 ? `${full ? '公元前' : '前'}${Math.abs(y)}年` : `${full ? '公元' : ''}${y}年`;
  }
  function rangeLabel(a, b) {
    if (!validYear(a) && !validYear(b)) return '起讫未详';
    return `${yearLabel(a, false)} — ${yearLabel(b, false)}`;
  }
  function distance(a, b) {
    if (!validYear(a) || !validYear(b)) return null;
    return ordinal(b) - ordinal(a);
  }
  function reignYears(reigns) {
    if (!Array.isArray(reigns) || !reigns.length || reigns.some(r => !validYear(r.start) || !validYear(r.end))) return null;
    return reigns.reduce((n, r) => n + Math.max(0, distance(r.start, r.end)), 0);
  }
  function reignLabel(reigns) {
    const n = reignYears(reigns);
    if (n === null) return '时长未详';
    return n === 0 ? '不足1年（同年）' : `约${n}年`;
  }
  function aliveIn(ruler, y) { return ruler.reigns.some(r => validYear(r.start) && validYear(r.end) && y >= r.start && y <= r.end); }
  function activeDynasties(dynasties, y) {
    return dynasties.filter(d => y >= d.start && y <= d.end && !(d.id === 'tang' && y > 690 && y < 705));
  }
  function nearestSnapshot(snapshots, y) {
    return snapshots.reduce((best, s) => Math.abs(distance(s.year, y)) < Math.abs(distance(best.year, y)) ? s : best, snapshots[0]);
  }
  function escapeHTML(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function parseYear(value) {
    const raw = String(value).trim();
    if (!/^-?\d+$/.test(raw)) return null;
    const y = Number(raw);
    return validYear(y) && y >= MIN_YEAR && y <= MAX_YEAR ? y : null;
  }
  function matches(item, query) {
    const q = String(query).trim().toLocaleLowerCase();
    if (!q) return true;
    return [item.name,item.personal,item.title,item.summary,item.achievement,item.cost,item.child,item.note,item.cause,item.result,item.impact,item.daily,...(item.tags||[])].filter(Boolean).join(' ').toLocaleLowerCase().includes(q);
  }
  function sanitizeSaved(raw) {
    const input = raw && typeof raw === 'object' ? raw : {};
    return {
      mode: input.mode === 'deep' ? 'deep' : 'child',
      year: parseYear(input.year) ?? 750,
      bookmarks: Array.isArray(input.bookmarks) ? [...new Set(input.bookmarks.filter(x => typeof x === 'string'))].slice(0,1000) : [],
      visited: Array.isArray(input.visited) ? [...new Set(input.visited.filter(x => typeof x === 'string'))].slice(0,1000) : [],
      notes: typeof input.notes === 'string' ? input.notes.slice(0,20000) : '',
      answered: Array.isArray(input.answered) ? [...new Set(input.answered.filter(x => typeof x === 'string'))].slice(0,1000) : [],
      journey: Number.isInteger(input.journey) && input.journey >= 0 ? Math.min(input.journey, 5) : 0
    };
  }
  // Backups are a separate, strict format; legacy local storage remains unchanged.
  function validateBackup(raw, ids) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.app !== 'guanshi-history' || raw.version !== 1) throw Error('不是本馆支持的备份格式。');
    const output = {};
    for (const field of ['bookmarks','visited','answered']) {
      const values = raw[field], allowed = new Set(ids[field]);
      if (!Array.isArray(values) || values.length > allowed.size || values.some(id => typeof id !== 'string' || !allowed.has(id))) throw Error('备份含未知或无效的记录。');
      output[field] = [...new Set(values)];
    }
    if (typeof raw.notes !== 'string' || raw.notes.length > 20000) throw Error('备份手记无效或超过20000字。');
    if (!Number.isInteger(raw.journey) || raw.journey < 0 || raw.journey >= ids.journeys) throw Error('探索路线编号无效。');
    output.notes = raw.notes; output.journey = raw.journey;
    return output;
  }
  function mergeBackup(current, incoming, ids) {
    const clean = validateBackup(incoming, ids);
    let notes = current.notes;
    if (clean.notes && !notes.includes(clean.notes)) notes = notes ? notes + '\n\n—— 导入手记（保留原文）——\n\n' + clean.notes : clean.notes;
    // Reject the whole merge rather than silently truncate either learner's text.
    if (notes.length > 20000) throw Error('两份手记合并后超过20000字，未导入；请先分别导出保存。');
    return {
      bookmarks:[...new Set([...current.bookmarks,...clean.bookmarks])],
      visited:[...new Set([...current.visited,...clean.visited])],
      answered:[...new Set([...current.answered,...clean.answered])],
      notes, journey:Math.max(current.journey,clean.journey)
    };
  }
  return {MIN_YEAR,MAX_YEAR,validYear,ordinal,fromOrdinal,yearLabel,rangeLabel,distance,reignYears,reignLabel,aliveIn,activeDynasties,nearestSnapshot,escapeHTML,parseYear,matches,sanitizeSaved,validateBackup,mergeBackup};
});
