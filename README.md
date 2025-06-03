# 🌌 Starfolio
![screenshot](public/misc/preview.png)

---

## ✨ Features

- 3D Black hole system with real physics
- Clickable planets that reveal detailed project info
- Smooth camera transitions and flyout UI panels
- Fully responsive and works across modern browsers

#### [Live Demo](https://Starfolio-spottedbushs-projects.vercel.app/)

---

## 🛠️ Tech Stack

- [JavaScript (ES6+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Three.js](https://threejs.org/) – 3D rendering engine
- [Vite](https://vitejs.dev/) – Lightning-fast bundler
- [Blender](https://www.blender.org/) - For creating my own 3D models

---

## 📁 Project Structure

<pre>
├── public/ # Static assets (images, models, textures)
│ ├── css/ - Css files (for styling the html objects)
│ ├── icons/ - Images for CTA icons, projects overview.
│ ├── planets/ - 3D Models under glb format
│ └── preview.png - The picture used in the first section of this ReadMe.md
├── src/ # Source code
│ ├── camera/ # Camera navigation logic
│ ├── data/ # Physic constants and projects data 
│ ├── scene/ # Scene and environment setup
│ ├── ui/ # UI logic
│ └── main.js # App entry point
├── vite.config.js # Vite configuration
├── index.html # Main HTML file
└── package.json # JSON scrips and dependencies
