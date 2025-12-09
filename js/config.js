// js/config.js

export const DEFAULT_VIEW = { center: [35, 105], zoom: 4 };
export const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const ATTRIBUTION = '© OpenStreetMap Contributors';

// 新增：点击卡片时的聚焦缩放等级
// 4 (全国) -> 7 (省/大区)，仅仅放大3倍，而不是之前的12 (街道)
export const FOCUS_ZOOM = 6;

// --- 配色：高饱和度鲜艳色系 (保持你喜欢的) ---
export const CATEGORY_COLORS = {
  '宝石矿产': { fill: '#0ea5e9', border: '#0369a1' }, // 亮蓝
  '工艺雕刻': { fill: '#10b981', border: '#047857' }, // 翠绿
  '轻工纺织': { fill: '#f59e0b', border: '#b45309' }, // 亮橙
  '轻工制造': { fill: '#ef4444', border: '#b91c1c' }, // 大红
  '现代制造': { fill: '#8b5cf6', border: '#6d28d9' }, // 亮紫
  '农业花卉': { fill: '#22c55e', border: '#15803d' }  // 草绿
};

// 默认点位样式
export const MARKER_STYLE = {
  radius: 7,          
  weight: 2,          
  fillOpacity: 0.85,  
  opacity: 1          
};