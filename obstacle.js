import {
  setCustomProperty,
  getCustomProperty,
  incrementCustomProperty,
} from "./updateCustomProperty.js";

const SPEED = 0.05;
const OBSTACLE_INTERVAL_MIN = 500;
const OBSTACLE_INTERVAL_MAX = 2000;
const OBSTACLE_INTERVAL_START = 1000;
const mainElem = document.querySelector(`[data-main]`);

const OBSTACLE_SCALE_BIG = 1.2;
const OBSTACLE_SCALE_NORMAL = 1.0;
const OBSTACLE_SCALE_SMALL = 0.8;

let nextObstacleTime;
export function setupObstacle() {
  nextObstacleTime = OBSTACLE_INTERVAL_START;
  document
    .querySelectorAll(`[data-obstacle]`)
    .forEach((obstacle) => obstacle.remove());
}

export function updateObstacle(delta, speedScale) {
  document.querySelectorAll(`[data-obstacle]`).forEach((obstacle) => {
    incrementCustomProperty(
      obstacle,
      "--left",
      delta * speedScale * SPEED * -1
    );
    if (getCustomProperty(obstacle, "--left") <= -100) {
      obstacle.remove();
    }
  });
  if (nextObstacleTime <= 0) {
    let [obstacleScale, time] = randomNumberBetween(
      OBSTACLE_INTERVAL_MIN,
      OBSTACLE_INTERVAL_MAX
    );
    createObstacle(obstacleScale);
    nextObstacleTime = time / speedScale;
  }
  nextObstacleTime -= delta;
}

export function getObstacleRects() {
  return [...document.querySelectorAll(`[data-obstacle]`)].map((obstacle) => {
    return obstacle.getBoundingClientRect();
  });
}

function createObstacle(obstacleScale) {
  const obstacle = document.createElement("img");
  obstacle.dataset.obstacle = true;
  obstacle.src = "./imgs/sun1.png";
  obstacle.style.transform = `scale(${obstacleScale})`;
  obstacle.classList.add("sun");
  setCustomProperty(obstacle, "--left", 100);
  mainElem.append(obstacle);
}

function randomNumberBetween(min, max) {
  let result = [];
  const randomNumber = Math.random();
  const scaleChance = Math.random();

  if (scaleChance > 0.5) {
    if (randomNumber > 0.8) {
      result.push(OBSTACLE_SCALE_BIG);
    } else if (randomNumber > 0.3) {
      result.push(OBSTACLE_SCALE_NORMAL);
    } else {
      result.push(OBSTACLE_SCALE_SMALL);
    }
  } else {
    result.push(OBSTACLE_SCALE_NORMAL);
  }

  result.push(Math.floor(randomNumber * (max - min + 1) + min));
  return result;
}
