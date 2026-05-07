import { Vector3, type Box3 } from "three";
import type { Octree } from "./octree";

type Joins<T> = Map<T, Set<T>>;

export class Connector<T> {
  octree: Octree<T>;
  joins: Joins<T> = new Map();
  range: Box3;

  constructor(octree: Octree<T>, range: Box3) {
    this.octree = octree;
    this.range = range;
  }

  clear() {
    this.joins.clear();
  }

  private setList(a: T, b: T) {
    if (this.isAlreadyRegistered(b, a)) {
      return;
    }

    if (!this.joins.has(a)) {
      this.joins.set(a, new Set());
    }

    const list = this.joins.get(a);

    if (!list) {
      throw new Error("no list found");
    }

    list.add(b);
  }

  isAlreadyRegistered(a: T, b: T) {
    const list = this.joins.get(a);

    if (!list) {
      return false;
    }

    return list.has(b);
  }

  add(position: Vector3, particle: T) {
    const size = new Vector3();
    this.range.getSize(size);
    this.range.setFromCenterAndSize(position, size);
    const particles = this.octree.queryRange(this.range);

    for (const other of particles) {
      this.setList(particle, other.data);
    }
  }
}
