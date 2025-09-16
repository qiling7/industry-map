import { map, markersLayer } from './map.js';
import { MARKER_STYLE } from '../config.js';

// 把单条特征转为 circleMarker
export function createMarker(feature, highlightTerm) {
  const m = L.circleMarker([feature.lat, feature.lng], MARKER_STYLE);
  m.bindTooltip(`${feature.region} · ${feature.industry}`, { direction: 'top', offset: [0, -6] });
m.on('click', () => {
  const target = document.getElementById(`card-${feature.id}`);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  // 高亮闪一下
  target.style.transition = 'background .3s';
  target.style.background = '#fef08a';
  setTimeout(() => target.style.background = '', 600);
});
  return m;
}

// 一键清空
export function clearMarkers() {
  markersLayer.clearLayers();
}

// 批量添加
export function addMarkers(features, term) {
  clearMarkers();
  const latlngs = [];
  features.forEach(f => {
    const m = createMarker(f, term);
    m.addTo(markersLayer);
    latlngs.push([f.lat, f.lng]);
  });
  // 自动缩放到视野
  if (latlngs.length) {
    const bounds = L.latLngBounds(latlngs);
    map.fitBounds(bounds.pad(0.2));
  }
}

// 详情卡片（只用于点击后置顶）
function makeDetailCard(f, term) {
  const esc = str => str.replace(/[&<>]/g, d => ({ '&':'&amp;','<':'&lt;','>':'&gt;' }[d]));
  const hi = str => term ? esc(str).replace(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi'), m => `<mark class="hit">${m}</mark>`) : esc(str);
  return `
    <div class="card" style="border-color:#dbeafe; box-shadow:0 0 0 3px #eff6ff inset;">
      <div style="font-weight:700; font-size:16px;">${hi(f.region)} · ${hi(f.industry)}</div>
      <div class="muted" style="margin-top:4px;">类别：<span class="pill">${f.category}</span></div>
      ${f.note ? `<div style="margin-top:6px;">${hi(f.note)}</div>` : ''}
    </div>`;
}