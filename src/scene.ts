import Stats from "stats.js";
import { WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { PerspectiveCamera, Scene } from "three/src/Three.WebGPU.Nodes.js";

export function prepareScene() {
  const scene = new Scene();

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 2;

  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 100;
  controls.maxPolarAngle = Math.PI / 2;

  return {
    renderer,
    camera,
    scene,
  };
}

export function drawScene(renderer: WebGLRenderer, loop: () => void) {
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  function animate() {
    stats.begin();
    loop();

    stats.end();
  }
  renderer.setAnimationLoop(animate);
}
