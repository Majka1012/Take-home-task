window.addEventListener("load", function () {
  document.querySelectorAll("img").forEach(function (img) {
    img.style.width = img.naturalWidth / 2 + "px";
  });
  ad.style.visibility = "visible";
});

const player = document.getElementById("player");
const ad = document.getElementById("ad");

const bg = document.getElementById("bg");
const replay = document.getElementById("replay");

const failEndcard = document.getElementById("fail");
const winEndcard = document.getElementById("win");

const gameTween = gsap.to("#game", { x: -2168, duration: 50, ease: "none", paused: true });

let started = false;
let over = false;

let y = 0; // distance from the start position (positive = down)
let speed = 0; // current vertical speed (positive = down, negative = up)

//Player is 42x41 so bottom of the bottom hitbox is 258+41
//Also I added 10 to seam "more fair" to the player
const hitboxTop = 258 + 10;
const hitboxBottom = 299;

const bottomLine = 600;
const topLine = 200;

const gravity = 0.07;

const startObstacles = 700;
const distanceBetween = 300;

const names = [
  "bac1",
  "bac2",
  "bac3",
  "bac4",
  "bac5",
  "bac6",
  "txt1",
  "txt2",
  "txt3",
  "txt4",
  "txt5",
  "txt6",
  "txt7",
  "txt8",
  "txt9",
];
names.sort(() => Math.random() - 0.5);

const obstacles = [];
let scroll = 0;

names.forEach(function (name, i) {
  const img = document.createElement("img");

  ad.insertBefore(img, document.getElementById("border"));

  const o = { img: img, x: startObstacles + i * distanceBetween, y: 300, w: 0, h: 0 };
  img.onload = function () {
    o.w = img.naturalWidth / 2;
    o.h = img.naturalHeight / 2;
    img.style.width = o.w + "px";

    const middle = (topLine + bottomLine) / 2;
    const centre = middle + (Math.random() * 2 - 1) * 130;
    o.y = centre - o.h / 2;
    img.style.transform = `translate(${o.x}px, ${o.y}px)`;
  };
  img.src = `../assets/01_game/${name}.png`;
  obstacles.push(o);
});

function loop() {
  speed = speed + gravity;
  y = y + speed;
  if (hitboxBottom + y > bottomLine || hitboxTop + y < topLine) {
    endGame(false);
    return;
  }

  const angle = Math.max(-15, Math.min(15, speed * 5));
  gsap.set(player, { y: y, rotation: angle });

  scroll = scroll + 1;
  obstacles.forEach(function (o) {
    o.img.style.transform = `translate(${o.x - scroll}px, ${o.y}px)`;
  });
  //   console.log(obstacles[-1]);
  const lastO = obstacles[obstacles.length - 1];
  if (lastO.x - scroll + lastO.w < 0) {
    endGame(true);
    return;
  }
  requestAnimationFrame(loop);
}

document.addEventListener("pointerdown", function () {
  if (over) return;
  if (!started) {
    started = true;
    gsap.to(".intro", { autoAlpha: 0, duration: 0.4 });
    gameTween.play();
    loop();
  } else {
    speed = -4;
  }
});

function endGame(win) {
  over = true;
  gameTween.pause();
  showGame(false);
  if (win) {
    winEndcard.style.visibility = "visible";
  } else {
    failEndcard.style.visibility = "visible";
  }
}

function restartGame() {
  gameTween.pause(0);
  y = 0;
  speed = 0;
  scroll = 0;
  started = false;
  over = false;
  gsap.set(player, { y: 0, rotation: 0 }); //reset player
  gsap.set(".intro", { autoAlpha: 1 });

  obstacles.sort(() => Math.random() - 0.5);
  obstacles.forEach(function (o, i) {
    o.x = startObstacles + i * distanceBetween;
    o.y = (topLine + bottomLine) / 2 + (Math.random() * 2 - 1) * 130 - o.h / 2;
    o.img.style.transform = `translate(${o.x}px, ${o.y}px)`;
  });

  showGame(true);
  winEndcard.style.visibility = "hidden";

  failEndcard.style.visibility = "hidden";
}

replay.addEventListener("click", restartGame);

function showGame(show) {
  const v = show ? "visible" : "hidden";
  ["game", "border", "bg_texture", "player", "tut"].forEach(function (id) {
    document.getElementById(id).style.visibility = v;
  });
  obstacles.forEach(function (o) {
    o.img.style.visibility = v;
  });
}
