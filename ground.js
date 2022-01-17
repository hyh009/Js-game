import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js";
const groundElems = document.querySelectorAll(`[data-ground]`);
const SPEED = 0.05;

export function setupGround() {
  setCustomProperty(groundElems[0], "--left", 0);
  setCustomProperty(groundElems[1], "--left", 300); // need to be same as percentage of width of .ground elem
}
export function updateGround(delta, speedScale) {
  groundElems.forEach((ground) => {
    incrementCustomProperty(ground, "--left", delta * speedScale * SPEED * -1);
    if (getCustomProperty(ground, "--left") <= -300) {
      //incrementCustomProperty(ground, "--left", 600);
      setCustomProperty(ground, "--left", 300);
    }
  });
}
