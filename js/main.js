import { buildFeatures } from './filter/search.js';
import { initRender } from './filter/render.js';
import { bindPanel } from './ui/panel.js';

// 1. 生成特征数组
const features = buildFeatures();
// 2. 初次渲染
initRender(features);
// 3. 绑定控件
bindPanel();

// 全局函数供 html 按钮调用
window.focusMarker = async function(id) {
  // 简单实现：找到第一个 region 匹配的点飞过去
  const f = features.find(d => d.id === id);
  if (!f) return;
  const { map } = await import('./map/map.js');
  map.setView([f.lat, f.lng], Math.max(map.getZoom(), 6), { animate: true });
};