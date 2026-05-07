import {
  BufferAttribute,
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  Vector3,
} from "three";

import { CONFIG } from "../config";

import type { Connector } from "../connector";

import type { Particle } from "../particle";

let connetorLines: LineSegments;

const POINTS_PER_SEGMENT = 6;

const VALUES_PER_CUBE = POINTS_PER_SEGMENT * 3;

const MAX_OCTREE_NODES = CONFIG.pointCount * 2;

export function initConnectorVisualizer() {
  const geometry = new BufferGeometry();

  const positions = new Float32Array(MAX_OCTREE_NODES * VALUES_PER_CUBE);

  const colors = new Float32Array(MAX_OCTREE_NODES * VALUES_PER_CUBE);

  geometry.setAttribute("position", new BufferAttribute(positions, 3));

  geometry.setAttribute("color", new BufferAttribute(colors, 3));

  const material = new LineBasicMaterial({
    vertexColors: true,

    transparent: true,

    opacity: 0.8,
  });

  connetorLines = new LineSegments(geometry, material);

  return connetorLines;
}

export function updateConnectorVisualizer(connector: Connector<Particle>) {
  const positions = connetorLines.geometry.attributes.position.array;

  const colors = connetorLines.geometry.attributes.color.array;

  let positionIndex = 0;

  let colorIndex = 0;

  function fillPositions(pA: Vector3, pB: Vector3) {
    if (positionIndex + 6 > positions.length) return;

    const dist = pA.distanceTo(pB);

    // On calcule une intensité entre 1 (proche) et 0 (loin)

    const intensity = Math.max(0, 1 - dist / CONFIG.selectionSize);

    // Positions

    positions[positionIndex++] = pA.x;

    positions[positionIndex++] = pA.y;

    positions[positionIndex++] = pA.z;

    positions[positionIndex++] = pB.x;

    positions[positionIndex++] = pB.y;

    positions[positionIndex++] = pB.z;

    // Couleurs (R, G, B) - On applique l'intensité

    colors[colorIndex++] = intensity;

    colors[colorIndex++] = intensity;

    colors[colorIndex++] = intensity;

    colors[colorIndex++] = intensity;

    colors[colorIndex++] = intensity;

    colors[colorIndex++] = intensity;
  }

  for (const [keyA, valueA] of connector.joins.entries()) {
    for (const valueB of valueA.values()) {
      fillPositions(keyA.position, valueB.position);
    }
  }

  positions.fill(0, positionIndex);

  colors.fill(0, colorIndex);

  connetorLines.geometry.attributes.position.needsUpdate = true;

  connetorLines.geometry.attributes.color.needsUpdate = true;
}
