/* New tools are visible entrances, not hidden behind unrelated lesson controls. */
(function(){'use strict';const side=document.querySelector('.sidebar'),a=document.createElement('a');a.href='microscope/index.html';a.textContent='🔬 模拟显微镜：亲手找一片细胞';a.className='biology-tool-entry';side.insertBefore(a,side.querySelector('#lessons'));})();
