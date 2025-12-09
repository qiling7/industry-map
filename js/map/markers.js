// js/map/markers.js
import { map, markersLayer } from './map.js';
import { MARKER_STYLE, CATEGORY_COLORS } from '../config.js';

let markerInstances = new Map();

function getStyleForCategory(category) {
  const c = CATEGORY_COLORS[category];
  return c ? { fillColor: c.fill, color: c.border } : { fillColor: '#999', color: '#666' };
}

export function initMarkers(features) {
  markersLayer.clearLayers();
  markerInstances.clear();

  features.forEach(f => {
    const style = getStyleForCategory(f.category);
    
    // 1. 回归默认渲染 (去掉 renderer: L.canvas())
    // 这样 Leaflet 会使用 SVG，事件响应最稳定，兼容性最好
    const m = L.circleMarker([f.lat, f.lng], {
      ...MARKER_STYLE,
      ...style
    });

    // 2. 绑定 Tooltip (显示文字)
    m.bindTooltip(`${f.region} · ${f.industry}`, { 
      direction: 'top', 
      offset: [0, -8] 
    });

    // 3. 恢复你原来的悬停效果 (鼠标放上去变大)
    m.on('mouseover', () => {
      m.openTooltip();
      m.setStyle({ radius: MARKER_STYLE.radius + 3 }); // 悬停放大
    });
    
    m.on('mouseout', () => {
      // 只有在非高亮状态下才还原半径，或者简单点直接还原
      // 这里为了保证交互爽快，直接还原
      // 如果当前点是搜索选中的点，updateMarkersStyle 会再次处理它，不用担心
      m.setStyle({ radius: MARKER_STYLE.radius });
    });

    // 4. 点击逻辑 (直接操作 DOM，确保万无一失)
    m.on('click', () => {
      // A. 地图点自己闪烁一下
      highlightMarker(f.id);

      // B. 侧边栏滚动到对应卡片 (复刻你的源代码逻辑)
      const card = document.getElementById(`card-${f.id}`);
      if (card) {
        // 滚动
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 高亮卡片样式
        document.querySelectorAll('.card.active-card').forEach(el => el.classList.remove('active-card'));
        card.classList.add('active-card');
      }
    });

    markersLayer.addLayer(m);
    markerInstances.set(f.id, m);
  });
}

// 搜索变暗逻辑 (保持不变)
export function updateMarkersStyle(filteredIDs) {
  const targetSet = new Set(filteredIDs);
  const isSearching = filteredIDs.length < markerInstances.size && filteredIDs.length > 0;

  markerInstances.forEach((marker, id) => {
    const baseStyle = { 
      radius: MARKER_STYLE.radius,
      fillOpacity: MARKER_STYLE.fillOpacity,
      opacity: MARKER_STYLE.opacity,
      weight: MARKER_STYLE.weight
    };

    if (isSearching) {
      if (targetSet.has(id)) {
        baseStyle.fillOpacity = 1;
        baseStyle.opacity = 1;
        marker.bringToFront();
      } else {
        baseStyle.fillOpacity = 0.1;
        baseStyle.opacity = 0.1;
        baseStyle.weight = 0; 
      }
    }
    marker.setStyle(baseStyle);
  });
}

// 闪烁逻辑 (保持不变)
export function highlightMarker(id) {
  const m = markerInstances.get(id);
  if (!m) return;

  const originalStyle = { ...m.options };

  m.setStyle({ 
    color: '#000', weight: 3, fillColor: '#fff',  
    fillOpacity: 1, opacity: 1, radius: MARKER_STYLE.radius + 4 
  });
  m.bringToFront();

  setTimeout(() => {
    m.setStyle({
        color: originalStyle.color,
        weight: originalStyle.weight,
        fillColor: originalStyle.fillColor,
        fillOpacity: originalStyle.fillOpacity,
        radius: originalStyle.radius
    });
  }, 1500);
}

export function getMarkerLatLng(id) {
  return markerInstances.get(id)?.getLatLng();
}