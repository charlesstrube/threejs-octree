import {
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  type Vector3,
} from "three";

export function drawPoints(points: Vector3[], color: number) {
  const vertices: number[] = [];
  const colors: number[] = [];

  for (const point of points) {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;
    colors.push(r, g, b);
    vertices.push(point.x, point.y, point.z);
  }

  const colorAttribute = new Float32BufferAttribute(colors, 3);
  const positionAttribute = new Float32BufferAttribute(vertices, 3);

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", positionAttribute);
  geometry.setAttribute("color", colorAttribute);

  const material = new PointsMaterial({
    size: 0.01,
    transparent: true,
    sizeAttenuation: true,
    vertexColors: true,
  });

  const visualPoints = new Points(geometry, material);
  return visualPoints;
}

export function updatePoints(
  visualPoints: ReturnType<typeof drawPoints>,
  points: Vector3[],
) {
  const positionAttr = visualPoints.geometry.getAttribute("position");
  const array = positionAttr.array;

  const count = points.length;

  for (let i = 0; i < count; i++) {
    array[i * 3] = points[i].x;
    array[i * 3 + 1] = points[i].y;
    array[i * 3 + 2] = points[i].z;
  }

  positionAttr.needsUpdate = true;

  visualPoints.geometry.setDrawRange(0, count);
}
