import { Box3, Vector3 } from "three";

interface Element<T> {
  point: Vector3;
  data: T;
}

interface Face<T> {
  northWest: Octree<T>;
  northEast: Octree<T>;
  southWest: Octree<T>;
  southEast: Octree<T>;
}

export class Octree<T> {
  bounding: Box3;
  depth: number;

  maxObjects: number;
  list: Element<T>[] = [];
  subdivived: boolean = false;

  top?: Face<T>;
  bottom?: Face<T>;

  constructor(bounding: Box3, depth: number = 0, maxObjects: number = 4) {
    this.bounding = bounding;
    this.depth = depth;
    this.maxObjects = maxObjects;
  }

  clear() {
    this.list = [];
    this.subdivived = false;
    this.top = undefined;
    this.bottom = undefined;
  }

  isInside(point: Vector3) {
    return this.bounding.containsPoint(point);
  }

  getChildren() {
    if (!this.bottom || !this.top) {
      return [];
    }

    const get = (face: Face<T>) => [
      face.northEast,
      face.northWest,
      face.southEast,
      face.southWest,
    ];
    return [...get(this.bottom), ...get(this.top)];
  }

  insert(point: Vector3, data: T) {
    if (!this.isInside(point)) {
      return;
    }

    if (this.list.length < this.maxObjects) {
      const element = { point, data };
      this.list.push(element);
      return;
    }

    this.subdivide();

    const insert = (face: Face<T>) => {
      face.northWest.insert(point, data);
      face.northEast.insert(point, data);
      face.southWest.insert(point, data);
      face.southEast.insert(point, data);
    };

    if (this.bottom) insert(this.bottom);
    if (this.top) insert(this.top);
  }

  subdivide() {
    if (this.subdivived) {
      return;
    }

    const size = new Vector3();
    const center = new Vector3();
    this.bounding.getSize(size);
    this.bounding.getCenter(center);

    const min = this.bounding.min;
    const max = this.bounding.max;

    /**
     * top view
     * -----------------------------
     * |      z      |      z      |
     * |  x   nw  x  |  x   ne  x  |
     * |      z      |      z      |
     * --------------c--------------
     * |      z      |      z      |
     * |  x   sw  x  |  x   se  x  |
     * |      z      |      z      |
     * -----------------------------
     *
     *         _________________________
     *        /           /           /|
     *       /    T NW   /    T NE   / |
     *      /___________/___________/  |
     *     /           /           /|  |
     *    /    T SW   /    T SE   / | /|
     *   /___________/___________/  |/ |
     *   |           |           |  |  |
     *   |   [T SW]  |   [T SE]  | /|BN| <--- Bottom layer
     *   |___________|___________|/ | /
     *   |           |           |  |/
     *   |   B SW    |   B SE    |  /
     *   |___________|___________|/
     *
     *    B = Bottom | T = Top
     */

    const topNorthWestBox = new Box3(
      new Vector3(min.x, center.y, min.z),
      new Vector3(center.x, max.y, center.z),
    );

    const topNorthEastBox = new Box3(
      new Vector3(center.x, center.y, min.z),
      new Vector3(max.x, max.y, center.z),
    );

    const bottomNorthWestBox = new Box3(
      new Vector3(min.x, min.y, min.z),
      new Vector3(center.x, center.y, center.z),
    );

    const bottomNorthEastBox = new Box3(
      new Vector3(center.x, min.y, min.z),
      new Vector3(max.x, center.y, center.z),
    );

    const topSouthWestBox = new Box3(
      new Vector3(min.x, center.y, center.z),
      new Vector3(center.x, max.y, max.z),
    );

    const topSouthEastBox = new Box3(
      new Vector3(center.x, center.y, center.z),
      new Vector3(max.x, max.y, max.z),
    );

    const bottomSouthWestBox = new Box3(
      new Vector3(min.x, min.y, center.z),
      new Vector3(center.x, center.y, max.z),
    );

    const bottomSouthEastBox = new Box3(
      new Vector3(center.x, min.y, center.z),
      new Vector3(max.x, center.y, max.z),
    );

    const newDepth = this.depth + 1;
    this.top = {
      northWest: new Octree(topNorthWestBox, newDepth, this.maxObjects),
      northEast: new Octree(topNorthEastBox, newDepth, this.maxObjects),
      southWest: new Octree(topSouthWestBox, newDepth, this.maxObjects),
      southEast: new Octree(topSouthEastBox, newDepth, this.maxObjects),
    };

    this.bottom = {
      northWest: new Octree(bottomNorthWestBox, newDepth, this.maxObjects),
      northEast: new Octree(bottomNorthEastBox, newDepth, this.maxObjects),
      southWest: new Octree(bottomSouthWestBox, newDepth, this.maxObjects),
      southEast: new Octree(bottomSouthEastBox, newDepth, this.maxObjects),
    };

    this.subdivived = true;
  }

  queryRange(range: Box3): Element<T>[] {
    if (
      !(this.bounding.intersectsBox(range) || this.bounding.containsBox(range))
    ) {
      return [];
    }

    const points = this.list.filter((element) =>
      range.containsPoint(element.point),
    );

    if (this.top?.northWest) {
      points.push(...this.top.northWest.queryRange(range));
    }

    if (this.top?.northEast) {
      points.push(...this.top.northEast.queryRange(range));
    }

    if (this.top?.southWest) {
      points.push(...this.top.southWest.queryRange(range));
    }

    if (this.top?.southEast) {
      points.push(...this.top.southEast.queryRange(range));
    }

    if (this.bottom?.northWest) {
      points.push(...this.bottom.northWest.queryRange(range));
    }

    if (this.bottom?.northEast) {
      points.push(...this.bottom.northEast.queryRange(range));
    }

    if (this.bottom?.southWest) {
      points.push(...this.bottom.southWest.queryRange(range));
    }

    if (this.bottom?.southEast) {
      points.push(...this.bottom.southEast.queryRange(range));
    }

    return points;
  }
}
