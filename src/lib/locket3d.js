/* ==========================================================
   OPHELIA — 3D Locket (signature brand visual, built with Three.js)
   A procedurally modelled gold locket opening to a matched shade —
   reused on the homepage hero (large, ambient) and every product
   page (smaller, tinted to that product's own swatch colour).
   ========================================================== */
import * as THREE from 'three';

export function initLocket(canvas, opts = {}) {
  const {
    swatchColor = 0xD9B4B2,
    ambientParticles = false,
    interactive = true,
  } = opts;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0.3, 6.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ---- Lighting ----
  scene.add(new THREE.HemisphereLight(0xfff4f2, 0x2b2422, 0.9));
  const key = new THREE.DirectionalLight(0xffeeec, 1.6);
  key.position.set(4, 5, 6);
  scene.add(key);
  const rim = new THREE.PointLight(0xd9b4b2, 1.2, 20);
  rim.position.set(-4, -2, 3);
  scene.add(rim);

  // ---- Locket group ----
  const group = new THREE.Group();
  scene.add(group);

  const goldMat = new THREE.MeshStandardMaterial({ color: 0xb98d8a, metalness: 0.85, roughness: 0.28 });
  const umberMat = new THREE.MeshStandardMaterial({ color: 0xc17e82, metalness: 0.6, roughness: 0.4 });
  const creamMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.6 });
  const swatchMat = new THREE.MeshStandardMaterial({ color: swatchColor, metalness: 0.15, roughness: 0.45 });

  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.14, 32, 100), goldMat);
  group.add(outerRing);

  const midRing = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.07, 32, 100), umberMat);
  midRing.position.z = 0.02;
  group.add(midRing);

  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.12, 64), creamMat);
  disc.rotation.x = Math.PI / 2;
  group.add(disc);

  const swatch = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.16, 64), swatchMat);
  swatch.rotation.x = Math.PI / 2;
  swatch.position.z = 0.08;
  group.add(swatch);

  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.035, 24, 80), goldMat);
  innerRing.position.z = 0.1;
  group.add(innerRing);

  // small gem accent at base, echoing the campaign key visual
  const gemMat = new THREE.MeshStandardMaterial({ color: 0x8fa6c9, metalness: 0.3, roughness: 0.15 });
  const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), gemMat);
  gem.position.set(0, -1.85, 0.15);
  group.add(gem);

  group.rotation.x = 0.15;

  // ---- Ambient gold particles (hero only) ----
  let particles;
  if (ambientParticles) {
    const count = 140;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0xd9b4b2, size: 0.035, transparent: true, opacity: 0.55 });
    particles = new THREE.Points(geo, mat);
    scene.add(particles);
  }

  // ---- Interaction: mouse parallax + drag-rotate ----
  let targetRotY = 0, targetRotX = 0.15;
  let dragging = false, lastX = 0;

  const onPointerMove = (e) => {
    const r = canvas.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    if (!dragging) {
      targetRotY = nx * 0.9;
      targetRotX = 0.15 - ny * 0.4;
    }
  };
  const onPointerDown = (e) => { dragging = true; lastX = e.clientX; };
  const onPointerUp = () => { dragging = false; };
  const onWindowPointerMove = (e) => {
    if (dragging) {
      const dx = e.clientX - lastX;
      targetRotY += dx * 0.01;
      lastX = e.clientX;
    }
  };

  if (interactive) {
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onWindowPointerMove);
  }

  let t = 0;
  let frameId = null;
  let stopped = false;
  function animate() {
    if (stopped) return;
    frameId = requestAnimationFrame(animate);
    t += 0.006;
    group.rotation.y += (targetRotY + Math.sin(t * 0.4) * 0.15 - group.rotation.y) * 0.06;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.06;
    group.position.y = Math.sin(t) * 0.06;
    if (particles) particles.rotation.y += 0.0006;
    renderer.render(scene, camera);
  }
  animate();

  function dispose() {
    stopped = true;
    if (frameId) cancelAnimationFrame(frameId);
    window.removeEventListener('resize', resize);
    if (interactive) {
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onWindowPointerMove);
    }
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => m.dispose());
      }
    });
    renderer.dispose();
  }

  return { scene, camera, renderer, group, dispose };
}
