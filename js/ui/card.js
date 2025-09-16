export function makeCard(f, term) {
  const esc = str => str.replace(/[&<>]/g, d => ({ '&':'&amp;','<':'&lt;','>':'&gt;' }[d]));
  const hi = str => term ? esc(str).replace(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi'), m => `<mark class="hit">${m}</mark>`) : esc(str);
  return `
    <div class="card" data-id="${f.id}">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
        <div>
          <div style="font-weight:600;">${hi(f.region)}</div>
          <div class="muted" style="font-size:12px;">类别：<span class="pill">${f.category}</span></div>
        </div>
        <button onclick="focusMarker('${f.id}')" style="border:1px solid #ddd; background:#fff; border-radius:8px; padding:6px 10px; cursor:pointer;">定位</button>
      </div>
      <div style="margin-top:6px;">
        <div><strong>产业：</strong>${hi(f.industry)}</div>
        ${f.note ? `<div class="muted" style="margin-top:4px;"><strong>备注：</strong>${hi(f.note)}</div>` : ''}
      </div>
    </div>`;
}