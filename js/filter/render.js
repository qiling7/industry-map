import { addMarkers } from '../map/markers.js';
import { filterFeatures } from './search.js';
import { makeCard } from '../ui/card.js';

const resultsEl = document.getElementById('results');
const statsEl   = document.getElementById('stats');

let allFeatures = [];

export function initRender(features) {
  allFeatures = features;
  render({ q: '', cat: '' });
}

export function render({ q, cat }) {
  const filtered = filterFeatures(allFeatures, { q, cat });
  // 右侧列表
  resultsEl.innerHTML = filtered.map(f => makeCard(f, q)).join('');
  // 地图点位
  addMarkers(filtered, q);
  // 统计
  statsEl.textContent = `当前显示：${filtered.length} 条记录（共 ${allFeatures.length} 条）`;
}