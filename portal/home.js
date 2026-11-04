/* Local topic search: a built-time keyword index, with no runtime fetch. */
(function(root){'use strict';
 const normalize=s=>String(s||'').normalize('NFKC').toLocaleLowerCase().trim();
 function matches(text,query){const value=normalize(text);return normalize(query).split(/\s+/).filter(Boolean).every(word=>value.includes(word));}
 if(typeof module!=='undefined')module.exports={matches};
 if(!root.document)return;
 const input=document.getElementById('museum-search'),cards=Array.from(document.querySelectorAll('.grid .card')),clear=document.getElementById('search-clear');
 function filter(){const query=input.value.trim();let count=0;cards.forEach(card=>{const visible=matches(card.dataset.search||card.textContent,query);card.hidden=!visible;if(visible)count++;});document.getElementById('search-count').textContent=count+' 个探索空间';document.getElementById('home-empty').hidden=count!==0;clear.hidden=!query;}
 function reset(){input.value='';filter();input.focus();}
 input.addEventListener('input',filter);input.addEventListener('keydown',event=>{if(event.key==='Escape')reset();});clear.addEventListener('click',reset);filter();
})(typeof window!=='undefined'?window:globalThis);
