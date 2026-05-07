import { GUI } from "dat.gui";

export const CONFIG = {
  boundingBoxSize: 1.5,
  selectionSize: 0.35,
  pointCount: 200,
  showOctree: false,
};

const gui = new GUI({
  name: "fsdaf",
});

gui.add(CONFIG, "showOctree");
