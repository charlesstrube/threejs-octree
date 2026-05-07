import { GUI } from "dat.gui";
import { CONFIG } from "./config";

const gui = new GUI({
  name: "fsdaf",
});

gui.add(CONFIG, "showOctree");
