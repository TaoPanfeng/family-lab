/* Pure catalogue and backup rules; no network and no browser-only dependencies. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ChineseModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const tones = {a:'āáǎà',e:'ēéěè',i:'īíǐì',o:'ōóǒò',u:'ūúǔù',v:'ǖǘǚǜ'};
  function normalize(value) {
    return String(value).trim().toLowerCase().replace(/u:/g,'v').normalize('NFD').replace(/u\u0308/g,'v').replace(/[\u0300-\u036f1-5\s'’]/g,'');
  }
  function pinyin(value) {
    const match = /^([a-zv]+)([1-5])$/.exec(value);
    if (!match) return value;
    let [,word,tone] = match; tone=Number(tone);
    if (tone===5) return word.replace(/v/g,'ü');
    let i = word.indexOf('a');
    if(i<0)i=word.indexOf('e');
    if(i<0 && word.includes('ou'))i=word.indexOf('o');
    if(i<0)for(let j=word.length-1;j>=0;j--)if(tones[word[j]]){i=j;break;}
    return (i<0?word:word.slice(0,i)+tones[word[i]][tone-1]+word.slice(i+1)).replace(/v/g,'ü');
  }
  function compare(a,b) {
    const ak=normalize(a.numberPinyin),bk=normalize(b.numberPinyin);
    return (ak<bk?-1:ak>bk?1:0) || Number(a.numberPinyin.slice(-1))-Number(b.numberPinyin.slice(-1)) || a.char.codePointAt(0)-b.char.codePointAt(0);
  }
  function filter(entries, options={}) {
    const q=normalize(options.query||'');
    return entries.filter(e=>
      (!options.letter || normalize(e.numberPinyin)[0]===options.letter.toLowerCase()) &&
      (!options.family || e.family===options.family) &&
      (!options.favoritesOnly || (options.favorites||[]).includes(e.id)) &&
      (!q || [e.char,e.numberPinyin,e.sourceChar,e.parts.join(''),e.words.join(''),e.meaning].some(s=>normalize(s).includes(q)))
    ).sort(compare);
  }
  function validateBackup(data, entries) {
    const ids=new Set(entries.map(e=>e.id));
    if (!data || data.app!=='family-lab-chinese' || data.version!==1 || !Array.isArray(data.favorites) || !data.notes || typeof data.notes!=='object' || Array.isArray(data.notes)) throw Error('不是本馆支持的备份格式。');
    if (data.favorites.length>entries.length || Object.keys(data.notes).length>entries.length) throw Error('备份条目过多。');
    for (const id of data.favorites) if(!ids.has(id))throw Error('备份含未知字卡。');
    const notes={};
    for(const [id,text] of Object.entries(data.notes)) {
      if(!ids.has(id)||typeof text!=='string'||text.length>500)throw Error('备份中的句子无效或超过500字。');
      notes[id]=text;
    }
    return {favorites:[...new Set(data.favorites)],notes};
  }
  function mergeBackup(current,incoming,entries) {
    const safe=validateBackup(incoming,entries);
    // Do not overwrite a learner's existing sentence during a merge.
    return {favorites:[...new Set([...current.favorites,...safe.favorites])],notes:{...safe.notes,...current.notes}};
  }
  return {normalize,pinyin,compare,filter,validateBackup,mergeBackup};
});
