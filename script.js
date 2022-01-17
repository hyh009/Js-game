import { updateGround, setupGround } from "./ground.js";
import {
  updateHero,
  setupHero,
  getHeroRect,
  setHeroLose,
  heroWaiting,
} from "./hero.js";
import { updateObstacle, setupObstacle, getObstacleRects } from "./obstacle.js";
const MAIN_WIDTH = 100;
const MAIN_HEIGHT = 30;
const mainElem = document.querySelector(`[data-main]`);
const scoreElem = document.querySelector(`[data-score]`);
const titleElem = document.querySelector(`[data-title]`);
const liveElem = document.querySelectorAll(`[data-live]`);
const SPEED_SCALE_INCREASE = 0.00001;

setPixelToMainScale();
window.addEventListener("resize", setPixelToMainScale);
document.addEventListener("keydown", handleStart, { once: true });

let liveCount;
let lastTime;
let speedScale;
let score;

//create infinity loop for keeping excuting animation
// UpdateLastTime is true when recover game
function update(time, UpdateLastTime) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  if (UpdateLastTime) {
    lastTime = window.performance.now();
  }
  const delta = time - lastTime;
  updateGround(delta, speedScale);
  updateHero(delta, speedScale);
  updateObstacle(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta, score);
  if (checkLose()) return handleStop(score);

  lastTime = time;
  window.requestAnimationFrame(update);
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

function updateScore(delta) {
  score += delta * 0.01;
  scoreElem.textContent = Math.floor(score);
}

function handleStart() {
  liveElem.forEach((live) => live.classList.remove("lose"));
  lastTime == null;
  speedScale = 1;
  score = 0;
  liveCount = 3;
  setupGround();
  setupHero();
  setupObstacle();
  titleElem.classList.add("hide");
  window.requestAnimationFrame(update);
}

function checkLose() {
  const heroRect = getHeroRect();
  return getObstacleRects().some((rect) => isCollision(rect, heroRect));
}

function handleStop() {
  liveCount -= 1;
  setHeroLose();
  if (liveCount <= 0) return handleLose();
  titleElem.textContent = "按任意鍵繼續遊戲~";
  titleElem.classList.remove("hide");
  [...liveElem].map((live, index) => {
    if (index === liveCount) {
      live.classList.add("lose");
    }
  });
  //prevent game start immediately
  setTimeout(() => {
    addEventListener("keydown", handleRecover, { once: true });
  }, 100);
}

function handleRecover() {
  titleElem.classList.add("hide");
  setupHero();
  setupObstacle();
  setupGround();
  window.requestAnimationFrame(function (time) {
    update(time, true);
  });
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

function handleLose() {
  liveElem[0].classList.add("lose");
  setHeroLose();
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true });
    titleElem.textContent = "遊戲結束~\n按任意鍵重新開始";
    titleElem.classList.remove("hide");
  }, 100);
}

function setPixelToMainScale() {
  let mainToPixelScale;
  if (window.innerWidth / window.innerHeight < MAIN_WIDTH / MAIN_HEIGHT) {
    mainToPixelScale = window.innerWidth / MAIN_WIDTH;
  } else {
    mainToPixelScale = window.innerHeight / MAIN_HEIGHT;
  }

  mainElem.style.width = `${MAIN_WIDTH * mainToPixelScale}px`;
  mainElem.style.height = `${MAIN_HEIGHT * mainToPixelScale}px`;
}
