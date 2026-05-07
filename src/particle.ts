import { Vector3 } from "three";
import { CONFIG } from "./config";

export class Particle {
  velocity: Vector3 = new Vector3(
    Math.random() / 100 - 0.005,
    Math.random() / 100 - 0.005,
    Math.random() / 100 - 0.005,
  ).clampLength(0, 0.0002);
  position: Vector3;
  randomForce = new Vector3();
  selected = false;

  constructor(position: Vector3) {
    this.position = position;
  }

  setEdge(axis: "x" | "y" | "z") {
    const max = CONFIG.boundingBoxSize / 2;
    const min = 0 - max;
    const position = this.position[axis];
    const setter = `set${axis.toUpperCase()}` as "setX" | "setY" | "setZ";

    if (position > max) {
      this.position[setter](min);
    }
    if (position < min) {
      this.position[setter](max);
    }
  }

  /**
   * this limit the area to have boundaries
   */
  edges() {
    this.setEdge("x");
    this.setEdge("y");
    this.setEdge("z");
  }

  update() {
    this.edges();
    this.randomForce
      .setX(Math.random() / 100 - 0.005)
      .setY(Math.random() / 100 - 0.005)
      .setZ(Math.random() / 100 - 0.005)
      .clampLength(0, 0.0001);
    this.velocity.add(this.randomForce).clampLength(0, 0.002);
    this.position.add(this.velocity);

    return this.position;
  }
}
