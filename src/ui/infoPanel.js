export function setupInfoPanel() {
  const panel = document.createElement('div');
  panel.id = 'info-panel';
  panel.style.position = 'absolute';
  panel.style.top = '10px';
  panel.style.right = '10px';
  panel.style.color = 'white';
  panel.style.padding = '10px';
  panel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  panel.innerHTML = '<h2>Vincent Tardieux\'s Portfolio</h2><p>Click planets to learn more.</p>';
  document.body.appendChild(panel);
}
