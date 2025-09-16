import { render } from '../filter/render.js';

const qEl     = document.getElementById('q');
const catEl   = document.getElementById('cat');
const clearEl = document.getElementById('clear');

export function bindPanel() {
  qEl.addEventListener('input', () => render({ q: qEl.value, cat: catEl.value }));
  catEl.addEventListener('change', () => render({ q: qEl.value, cat: catEl.value }));
  clearEl.addEventListener('click', () => {
    qEl.value = '';
    catEl.value = '';
    render({ q: '', cat: '' });
  });
}