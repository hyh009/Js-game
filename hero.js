import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js";

const heroElem = document.querySelector(`[data-hero]`);
const JUMP_SPEED = 0.35;
const GRAVITY = 0.0015;
const FRAME_TIME = 100;
const HERO_FRAME_COUNT = 2;
const FLOAT_HEIGHT = 0.01;
const GRAVITY_FLOAT = 0.0005;

let isJumping;
let heroFrame;
let currentFrameTime;
let yVelocity;
let floating;
let isForward;

export function setupHero() {
  isJumping = false;
  heroFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  floating = 0;
  heroElem.style.transform = "none";
  setCustomProperty(heroElem, "--bottom", 0);
  document.removeEventListener("keydown", onJump);
  document.addEventListener("keydown", onJump);
}

export function updateHero(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
}

export function getHeroRect() {
  return heroElem.getBoundingClientRect();
}

export function setHeroLose() {
  heroElem.style.transform = "rotate(330deg)";
  heroElem.src = "./imgs/OBAKE_ROSE.png";
}

export function HeroPrepare() {}

function handleRun(delta, speedScale) {
  if (isJumping) {
    heroElem.src = `imgs/OBAKE_JUMP.png`;
    return;
  }
  // change image
  if (currentFrameTime >= FRAME_TIME) {
    heroFrame = (heroFrame + 1) % HERO_FRAME_COUNT;
    heroElem.src = `imgs/OBAKE_RUN${heroFrame}.png`;
    currentFrameTime -= FRAME_TIME;
  }
  // make imgs change faster depending on the play time
  currentFrameTime += delta * speedScale;

  //floating
  onFloating(delta, speedScale);
}

function handleJump(delta) {
  if (!isJumping) return;
  incrementCustomProperty(heroElem, "--bottom", yVelocity * delta);
  if (getCustomProperty(heroElem, "--bottom") <= 0) {
    setCustomProperty(heroElem, "--bottom", 0);
    isJumping = false;
  }
  yVelocity -= GRAVITY * delta;
}

function onJump(e) {
  if (e.code !== "Space" || isJumping) return;
  yVelocity = JUMP_SPEED;
  isJumping = true;
}

function onFloating(delta, speedScale) {
  incrementCustomProperty(heroElem, "--bottom", floating * delta * speedScale);

  if (floating >= FLOAT_HEIGHT) {
    isForward = false;
  } else if (getCustomProperty(heroElem, "--bottom") <= 0) {
    isForward = true;
  }
  isForward ? (floating += GRAVITY_FLOAT) : (floating -= GRAVITY_FLOAT);
}

export function heroWaiting(delta) {
  incrementCustomProperty(heroElem, "--bottom", floating * delta);
  if (floating >= FLOAT_HEIGHT) {
    isForward = false;
  } else if (getCustomProperty(heroElem, "--bottom") <= 0) {
    isForward = true;
  }
  isForward ? (floating += GRAVITY_FLOAT) : (floating -= GRAVITY_FLOAT);
}
