// Shared behavior for detail-page tabs, sortable tables, and search filtering.

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === tab));
  });
});

// Sort
document.querySelectorAll('table.data-table').forEach(table => {
  let state = {};
  table.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const type = th.dataset.sort;
      const idx = Array.from(th.parentNode.children).indexOf(th);
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const dir = state.col === idx && state.dir === 'desc' ? 'asc' : 'desc';
      state = { col: idx, dir };
      rows.sort((a, b) => {
        const cellA = a.children[idx], cellB = b.children[idx];
        let va, vb;
        if (type === 'amount' || type === 'date') {
          va = parseFloat(cellA.dataset.value || 0) || Date.parse(cellA.dataset.value || 0);
          vb = parseFloat(cellB.dataset.value || 0) || Date.parse(cellB.dataset.value || 0);
          if (type === 'date') { va = Date.parse(cellA.dataset.value); vb = Date.parse(cellB.dataset.value); }
        } else {
          va = cellA.textContent.trim().toLowerCase();
          vb = cellB.textContent.trim().toLowerCase();
        }
        if (va < vb) return dir === 'asc' ? -1 : 1;
        if (va > vb) return dir === 'asc' ? 1 : -1;
        return 0;
      });
      rows.forEach(r => tbody.appendChild(r));
    });
  });
});

// Filter
document.querySelectorAll('[data-filter-for]').forEach(input => {
  input.addEventListener('input', () => {
    const key = input.dataset.filterFor;
    const wrap = document.querySelector(`[data-table="${key}"]`);
    const q = input.value.trim().toLowerCase();
    let visible = 0;
    wrap.querySelectorAll('tbody tr').forEach(row => {
      const match = row.textContent.toLowerCase().includes(q);
      row.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    document.querySelector(`[data-count-for="${key}"]`).textContent = visible + ' item' + (visible === 1 ? '' : 's');
  });
});
