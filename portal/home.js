/* Local-only search: no runtime fetch, tracking, or dependency. */
(function () {
  'use strict';
  const input = document.getElementById('museum-search');
  const cards = Array.from(document.querySelectorAll('.grid .card'));
  function filter() {
    const query = input.value.trim().toLocaleLowerCase();
    let count = 0;
    cards.forEach(card => {
      const visible = !query || card.textContent.toLocaleLowerCase().includes(query);
      card.hidden = !visible;
      if (visible) count++;
    });
    document.getElementById('search-count').textContent = count + ' 个探索空间';
    document.getElementById('home-empty').hidden = count !== 0;
  }
  input.addEventListener('input', filter);
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') { input.value = ''; filter(); }
  });
})();
