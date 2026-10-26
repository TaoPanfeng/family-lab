/* Offline textbook notation. KaTeX produces native MathML, never HTML from user input. */
(function(root){'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const supers={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','ⁿ':'n','ᵐ':'m','ᵏ':'k','ᵃ':'a','ᵇ':'b','ᶜ':'c','ᵗ':'t','ˣ':'x','ᵀ':'T','ʰ':'h','ᵘ':'u','ᴿ':'R','⁺':'+','⁻':'-'};
const subs={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','ₐ':'a','ᵢ':'i','ₖ':'k','ₙ':'n','ₓ':'x','₊':'+','₋':'-'};
function normalize(s){
 s=s.trim().replace(/\[\s*\[([^\]]+)\]\s*,\s*\[([^\]]+)\]\s*\]/g,(_,a,b)=>'\\begin{pmatrix}'+a.replace(/,/g,'&')+'\\\\'+b.replace(/,/g,'&')+'\\end{pmatrix}');
 s=s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵐᵏᵃᵇᶜᵗˣᵀʰᵘᴿ⁺⁻]+/g,m=>'^{'+[...m].map(c=>supers[c]).join('')+'}').replace(/[₀₁₂₃₄₅₆₇₈₉ₐᵢₖₙₓ₊₋]+/g,m=>'_{'+[...m].map(c=>subs[c]).join('')+'}');
 s=s.replace(/abs\(([^()]*)\)/g,'\\left|$1\\right|').replace(/\b(gcd|lcm|diag|rank|nullity)\b/g,'\\operatorname{$1}');
 s=s.replace(/lim\[([^\]]+)\]/g,'\\lim_{$1}').replace(/√\(([^()]*)\)/g,'\\sqrt{$1}').replace(/√([\dA-Za-zΔ]+)/g,'\\sqrt{$1}');
 s=s.replace(/([0-9A-Za-z]+(?:\^\{[^{}]*\}|_\{[^{}]*\})?|\([^()]*\))\s*\/\s*([0-9A-Za-z]+(?:\^\{[^{}]*\}|_\{[^{}]*\})?|\([^()]*\))/g,(_,a,b)=>'\\frac{'+a.replace(/^\((.*)\)$/,'$1')+'}{'+b.replace(/^\((.*)\)$/,'$1')+'}');
 s=s.replace(/Σ/g,'\\sum ').replace(/∫/g,'\\int ').replace(/×/g,'\\times ').replace(/÷/g,'\\div ').replace(/⇒/g,'\\Rightarrow ').replace(/→/g,'\\to ').replace(/≠/g,'\\ne ').replace(/≤/g,'\\le ').replace(/≥/g,'\\ge ').replace(/≈/g,'\\approx ').replace(/∞/g,'\\infty ').replace(/∪/g,'\\cup ').replace(/∩/g,'\\cap ').replace(/∣/g,'\\mid ').replace(/−/g,'-').replace(/…/g,'\\cdots ').replace(/\b(sin|cos|tan|log)\b/g,'\\$1 ');
 s=s.replace(/\b(sin|cos|tan)(?=[0-9A-Za-zθ])/g,'\\$1 ').replace(/\.\.\./g,'\\cdots ');s=s.replace(/A\\B/g,'A\\setminus B').replace(/⁄/g,'/');return s;
}
function math(tex,display=false){const engine=root.katex||(typeof require==='function'?require('./vendor/katex/katex.min.js'):null);if(!engine)throw Error('Offline formula renderer missing');return engine.renderToString(tex,{output:'mathml',displayMode:display,throwOnError:true,trust:false,strict:'ignore',maxExpand:1000}).replace(/<mo fence="true">/g,'<mo fence="true" stretchy="true">');}
function rich(s){let out='',last=0;const re=/\\\(([\s\S]*?)\\\)/g;let m;while((m=re.exec(String(s)))){out+=esc(String(s).slice(last,m.index))+math(m[1]);last=re.lastIndex;}return out+esc(String(s).slice(last));}
function legacy(s){
 // Legacy cards mix Chinese narration and formulas. Keep narration as text; normalize only mathematical spans.
 return String(s).split(/([\u3400-\u9fff，。；：“”！？]+)/g).map(part=>{
  if(/[\u3400-\u9fff]/.test(part)||!/[=+×÷−^Σ∫√≤≥≠≈∪∩⇒→⁰¹²³ⁿᵀ₀₁₂₃/\[]/.test(part))return esc(part);
  const trim=part.trim(),lead=part.slice(0,part.indexOf(trim)),tail=part.slice(part.indexOf(trim)+trim.length);
  if(!trim)return esc(part);
  try{return esc(lead)+math(normalize(trim))+esc(tail);}catch(e){return esc(part);}
 }).join('');
}
const api={math,rich,legacy,normalize,esc};root.Formula=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
