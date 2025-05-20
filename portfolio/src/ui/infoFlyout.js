// src/ui/infoFlyout.js
export const flyout = (() => {
  const div = document.createElement('div');
  div.id = 'flyout-popup';
  div.style.position = 'absolute';
  div.style.padding = '10px';
  div.style.backgroundColor = 'rgba(0,0,0,0.7)';
  div.style.color = 'white';
  div.style.borderRadius = '6px';
  div.style.pointerEvents = 'auto'; // allow clicking close button
  div.style.visibility = 'hidden';  // hide initially
  div.style.transition = 'transform 0.1s ease-out';
  div.style.zIndex = '10';
  div.position = 'absolute';

  document.body.appendChild(div);

  // Close handler
  div.addEventListener('click', (e) => {
    if (e.target.id === 'flyout-close') {
      div.style.visibility = 'hidden';
      if (flyout.onClose) flyout.onClose();
    }
  });

  return {
    div,
    show(info) {
      div.innerHTML = `
        <strong>${info.name}</strong><br>
        <img src="${info.icon}" alt="${info.name}" style="width:40px; height:40px; margin:5px 0;">
        <p style="margin:0;">${info.description}</p>
        <a href="${info.link}" target="_blank" style="color:#4fc3f7;">View Project</a><br>
        <button id="flyout-close" style="margin-top:5px;">Close</button>
      `;
      div.style.visibility = 'visible';
    },
    hide() {
      div.style.visibility = 'hidden';
    },
    onClose: null,
    updatePosition(x, y) {
      div.style.transform = `translate(-50%, -100%) translate(${x}px,${y}px)`;
    },
  };
})();

