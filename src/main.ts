import { Box3, Vector3 } from "three";
import { Octree } from "./octree";
import { drawScene, prepareScene } from "./scene";
import {
  initOctreeVisualizer,
  updateOctreeVisualizer,
} from "./drawer/octree-drawer";
import { drawPoints, updatePoints } from "./drawer/points-drawer";
import { Particle } from "./particle";
import "./style.css";
import { CONFIG } from "./config";

const { camera, renderer, scene } = prepareScene();

// bounding box
const halfBoundingBox = CONFIG.boundingBoxSize / 2;
const boundingBox = new Box3(
  new Vector3(-halfBoundingBox, -halfBoundingBox, -halfBoundingBox),
  new Vector3(halfBoundingBox, halfBoundingBox, halfBoundingBox),
);

// build quadtree
const octree = new Octree<Particle>(boundingBox);
const particles: Particle[] = [];
for (let i = 0; i < CONFIG.pointCount; i += 1) {
  const position = new Vector3(
    Math.random() * CONFIG.boundingBoxSize - CONFIG.boundingBoxSize / 2,
    Math.random() * CONFIG.boundingBoxSize - CONFIG.boundingBoxSize / 2,
    Math.random() * CONFIG.boundingBoxSize - CONFIG.boundingBoxSize / 2,
  );
  const particle = new Particle(position);
  octree.insert(position, particle);
  particles.push(particle);
}

// draw de quadtree
const visualQuadtreeBoxes = initOctreeVisualizer();
scene.add(visualQuadtreeBoxes);

// draw points

const visualParticles = drawPoints(
  particles.map((particle) => particle.position),
  0xffffff,
);
scene.add(visualParticles);

drawScene(renderer, () => {
  octree.clear();
  for (const particle of particles) {
    const position = particle.update();
    octree.insert(position, particle);
    particle.selected = false;
  }

  const selectedParticles = octree.queryRange(new Box3());

  for (const item of selectedParticles) {
    item.data.selected = true;
  }

  const particlePoints = particles.filter(
    (particle) => particle.selected === false,
  );

  updatePoints(
    visualParticles,
    particlePoints.map((particle) => particle.position),
  );

  updateOctreeVisualizer(octree);
  renderer.render(scene, camera);
});
