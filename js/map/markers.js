import { map, markersLayer } from './map.js';
import { MARKER_STYLE, CATEGORY_COLORS } from '../config.js';

// 取类别颜色，不存在则回退到默认蓝色
function colorOf(category) {
  return (CATEGORY_COLORS && CATEGORY_COLORS[category]) || '#2563eb';
}

// 把单条特征转为 circleMarker（含类别配色 + hover 效果）
export function createMarker(feature, highlightTerm) {
  const color = colorOf(feature.category);

  const m = L.circleMarker([feature.lat, feature.lng], {
    ...MARKER_STYLE,
    color,
    fillColor: color
  });

  m.bindTooltip(`${feature.region} · ${feature.industry}`, {
    direction: 'top',
    offset: [0, -6],
    sticky: true
  });

  // 悬停轻微放大，离开还原
  m.on('mouseover', () => m.setStyle({ radius: (MARKER_STYLE.radius || 7) + 2 }));
  m.on('mouseout',  () => m.setStyle({ radius: (MARKER_STYLE.radius || 7) }));

  // 点击 → 滚动到右侧对应卡片并闪一下
  m.on('click', () => {
    const target = document.getElementById(`card-${feature.id}`);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.style.transition = 'background .3s';
    target.style.background = '#fef08a';
    setTimeout(() => (target.style.background = ''), 600);
  });

  return m;
}

// 一键清空
export function clearMarkers() {
  markersLayer.clearLayers();
}

// 批量添加（兼容 layerGroup 或 markerClusterGroup）
export function addMarkers(features, term) {
  clearMarkers();

  const latlngs = [];
  for (const f of features) {
    const m = createMarker(f, term);
    markersLayer.addLayer(m);          // 兼容 cluster 与普通 layer
    latlngs.push([f.lat, f.lng]);
  }

  // 自动缩放到视野（只在有点时）
  if (latlngs.length) {
    const bounds = L.latLngBounds(latlngs);
    map.fitBounds(bounds.pad(0.2));
  }
}

// 详情卡片（仅用于点击后置顶；目前保留）
function makeDetailCard(f, term) {
  const esc = (str='') => str.replace(/[&<>]/g, d => ({ '&':'&amp;','<':'&lt;','>':'&gt;' }[d]));
  const hi  = (str='') => term
    ? esc(str).replace(new RegExp(term.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\\\$&'), 'gi'), m => `<mark class="hit">${m}</mark>`)
    : esc(str);

  return `
    <div class="card" style="border-color:#dbeafe; box-shadow:0 0 0 3px #eff6ff inset;">
      <div style="font-weight:700; font-size:16px;">${hi(f.region)} · ${hi(f.industry)}</div>
      <div class="muted" style="margin-top:4px;">类别：<span class="pill">${esc(f.category)}</span></div>
      ${f.note ? `<div style="margin-top:6px;">${hi(f.note)}</div>` : ''}
    </div>`;
}
