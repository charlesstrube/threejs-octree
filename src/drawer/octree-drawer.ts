import {
  BufferAttribute,
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
} from "three";
import type { Octree } from "../octree";
import { CONFIG } from "../config";

let octreeLines: LineSegments;
const POINTS_PER_CUBE = 24;
const VALUES_PER_CUBE = POINTS_PER_CUBE * 3;

const MAX_OCTREE_NODES = CONFIG.pointCount * 2;

export function initOctreeVisualizer() {
  // 8 sommets par boîte (4 segments de 2 points pour faire un carré)
  const geometry = new BufferGeometry();
  const positions = new Float32Array(MAX_OCTREE_NODES * VALUES_PER_CUBE);
  geometry.setAttribute("position", new BufferAttribute(positions, 3));

  const material = new LineBasicMaterial({
    color: 0x00ff00,
    opacity: 0.5,
  });
  octreeLines = new LineSegments(geometry, material);
  return octreeLines;
}

export function updateOctreeVisualizer<T>(octree: Octree<T>) {
  const positions = octreeLines.geometry.attributes.position.array;
  let index = 0;

  // Fonction récursive pour remplir le tableau de positions
  function fillPositions(node: Octree<T>) {
    if (index + VALUES_PER_CUBE > positions.length || node.list.length === 0)
      return;

    const { min, max } = node.bounding;

    // Segment 1: Bottom
    positions[index++] = min.x;
    positions[index++] = min.y;
    positions[index++] = min.z;
    positions[index++] = max.x;
    positions[index++] = min.y;
    positions[index++] = min.z;

    positions[index++] = max.x;
    positions[index++] = min.y;
    positions[index++] = min.z;
    positions[index++] = max.x;
    positions[index++] = max.y;
    positions[index++] = min.z;

    positions[index++] = max.x;
    positions[index++] = max.y;
    positions[index++] = min.z;
    positions[index++] = min.x;
    positions[index++] = max.y;
    positions[index++] = min.z;

    positions[index++] = min.x;
    positions[index++] = max.y;
    positions[index++] = min.z;
    positions[index++] = min.x;
    positions[index++] = min.y;
    positions[index++] = min.z;

    // top face
    positions[index++] = min.x;
    positions[index++] = min.y;
    positions[index++] = max.z;
    positions[index++] = max.x;
    positions[index++] = min.y;
    positions[index++] = max.z;

    positions[index++] = max.x;
    positions[index++] = min.y;
    positions[index++] = max.z;
    positions[index++] = max.x;
    positions[index++] = max.y;
    positions[index++] = max.z;

    positions[index++] = max.x;
    positions[index++] = max.y;
    positions[index++] = max.z;
    positions[index++] = min.x;
    positions[index++] = max.y;
    positions[index++] = max.z;

    positions[index++] = min.x;
    positions[index++] = max.y;
    positions[index++] = max.z;
    positions[index++] = min.x;
    positions[index++] = min.y;
    positions[index++] = max.z;

    // vertical edges
    positions[index++] = min.x;
    positions[index++] = min.y;
    positions[index++] = min.z;
    positions[index++] = min.x;
    positions[index++] = min.y;
    positions[index++] = max.z;

    positions[index++] = max.x;
    positions[index++] = min.y;
    positions[index++] = min.z;
    positions[index++] = max.x;
    positions[index++] = min.y;
    positions[index++] = max.z;

    positions[index++] = max.x;
    positions[index++] = max.y;
    positions[index++] = min.z;
    positions[index++] = max.x;
    positions[index++] = max.y;
    positions[index++] = max.z;

    positions[index++] = min.x;
    positions[index++] = max.y;
    positions[index++] = min.z;
    positions[index++] = min.x;
    positions[index++] = max.y;
    positions[index++] = max.z;
  }

  fillPositions(octree);

  for (const child of octree.leaves) {
    fillPositions(child);
  }

  // On indique à Three.js de mettre à jour le GPU
  octreeLines.geometry.attributes.position.needsUpdate = true;
}
