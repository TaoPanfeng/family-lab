/* A proof route owns its diagram, formula and explanation. */
(function(root){'use strict';
const renderers=new Map();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(x,y,value,size=18,color='#204b5a')=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="${color}">${esc(value)}</text>`;
const svg=(body,label='本步骤的数学图示')=>`<svg viewBox="0 0 600 360" role="img" aria-label="${esc(label)}">${body}</svg>`;
const api={esc,text,svg,register:(id,draw)=>renderers.set(id,draw),has:id=>renderers.has(id),draw:(id,route,step)=>{const draw=renderers.get(id);if(!draw)throw new Error('缺少证明图示：'+id);return draw(route,step);}};
root.MathProofVisuals=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
