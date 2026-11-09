window.addEventListener("load", function () {
  document.querySelectorAll("img").forEach(function (img) {
    img.style.width = img.naturalWidth / 2 + "px";
  });
  ad.style.visibility = "visible";
});

const audio = gameAudio;

const player = document.getElementById("player");
const ad = document.getElementById("ad");
const game = document.getElementById("game");

const replay = document.getElementById("replay");
const winInfo = document.getElementById("winCta");
const failInfo = document.getElementById("failCta");

const failEndcard = document.getElementById("fail");
const winEndcard = document.getElementById("win");

const debug = new URLSearchParams(location.search).get("debug") === "1";

const clickTag = window.clickTag || "https://example.com/landing";

function openLanding() {
  window.open(clickTag, "_blank");
}

// Listeners are added ONCE, here, not inside endGame
replay.addEventListener("click", restartGame);
failInfo.addEventListener("click", openLanding);
winInfo.addEventListener("click", openLanding);

// Moving background
const gameTween = gsap.to("#game", {
  x: -2168,
  duration: 30,
  ease: "none",
  paused: true,
});

// Player animation before start
const playerHover = gsap.to("#player", {
  rotation: 10,
  duration: 0.7,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut",
  paused: true,
});

let started = false;
let over = false;
let paused = false;
let animationFrame = null;

let y = 0;
let speed = 0;

const hitboxTop = 258 + 10;
const hitboxBottom = 299;

const bottomLine = 600;
const topLine = 190;

const gravity = 0.07;

const startObstacles = 700;
const distanceBetween = 300;

const cut = { bac: 0.25, txt: 0.08 };

const playerJump = -3.5;

const obstacles = [];
let scroll = 0;

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

// Hover over the game area to pulse the player
ad.addEventListener("mouseenter", function () {
  if (!started && !over) {
    playerHover.play();
  }
});

ad.addEventListener("mouseleave", function () {
  playerHover.pause();
  gsap.killTweensOf(player, "rotation");
  gsap.set(player, { rotation: 0 });
});

names.forEach(function (name, i) {
  const img = document.createElement("img");
  ad.insertBefore(img, document.getElementById("border"));

  const o = {
    img: img,
    x: startObstacles + i * distanceBetween,
    y: 300,
    w: 0,
    h: 0,
    cut: name.startsWith("bac") ? cut.bac : cut.txt,
  };

  if (debug) {
    o.box = document.createElement("div");
    o.box.style.cssText = "position:absolute;left:0;top:0;outline:1px solid red;z-index:30;pointer-events:none";
    ad.appendChild(o.box);
  }

  img.onload = function () {
    o.w = img.naturalWidth / 2;
    o.h = img.naturalHeight / 2;
    img.style.width = o.w + "px";

    const middle = (topLine + bottomLine) / 2;
    const centre = middle + (Math.random() * 2 - 1) * 130;
    o.y = centre - o.h / 2;

    img.style.transform = `translate(${o.x}px, ${o.y}px)`;
  };

  img.src = `../assets/01_game/${name}.webp`;
  obstacles.push(o);
});

function loop() {
  if (paused || over || !started) return;

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

    if (debug) {
      o.box.style.width = o.w * (1 - 2 * o.cut) + "px";
      o.box.style.height = o.h * (1 - 2 * o.cut) + "px";
      o.box.style.transform = `translate(${o.x - scroll + o.w * o.cut}px, ${o.y + o.h * o.cut}px)`;
    }
  });

  // Collision with any obstacle
  for (const o of obstacles) {
    if (touches(o)) {
      endGame(false);
      return;
    }
  }

  // Win: the last obstacle has left the screen
  const lastO = obstacles[obstacles.length - 1];

  if (lastO.x - scroll + lastO.w < 0) {
    endGame(true);
    return;
  }

  animationFrame = requestAnimationFrame(loop);
}

document.addEventListener("pointerdown", function () {
  if (over || paused) return;

  if (!started) {
    started = true;

    // Stop the hover animation before starting the game
    playerHover.pause();
    gsap.killTweensOf(player, "scale");
    gsap.set(player, { rotation: 0 });

    audio.startBackground();
    gsap.to(".intro", { autoAlpha: 0, duration: 0.4 });
    gameTween.play();
    loop();
  } else {
    speed = playerJump;
  }
});

// Pause and resume when the tab becomes hidden or visible
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    if (started && !over) {
      paused = true;
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
      gameTween.pause();
      audio.pauseBackground();
    }
  } else {
    if (paused && started && !over) {
      paused = false;
      gameTween.play();
      audio.startBackground();
      loop();
    }
  }
});

function endGame(win) {
  over = true;

  cancelAnimationFrame(animationFrame);
  animationFrame = null;

  gameTween.pause();
  audio.stopBackground();

  showGame(false);

  if (win) {
    audio.playWin();
    winEndcard.style.visibility = "visible";
  } else {
    audio.playCrash();
    audio.playFail();
    failEndcard.style.visibility = "visible";
  }
}

function restartGame() {
  audio.stopAll();

  cancelAnimationFrame(animationFrame);
  animationFrame = null;

  gameTween.pause(0);

  y = 0;
  speed = 0;
  scroll = 0;
  started = false;
  over = false;
  paused = false;

  playerHover.pause();
  gsap.killTweensOf(player, "rotation");
  gsap.set(player, { y: 0, rotation: 0, scale: 1 });

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

function showGame(show) {
  const v = show ? "visible" : "hidden";

  ["game", "border", "bg_texture", "player", "tut"].forEach(function (id) {
    document.getElementById(id).style.visibility = v;
  });

  obstacles.forEach(function (o) {
    o.img.style.visibility = v;

    if (o.box) {
      o.box.style.visibility = v;
    }
  });
}

// Rectangle overlap test
function touches(o) {
  const ox = o.x - scroll + o.w * o.cut;
  const oy = o.y + o.h * o.cut;
  const ow = o.w * (1 - 2 * o.cut);
  const oh = o.h * (1 - 2 * o.cut);

  const px = 55 + 6;
  const py = 258 + y + 6;
  const pw = 42 - 12;
  const ph = 41 - 12;

  return px < ox + ow && px + pw > ox && py < oy + oh && py + ph > oy;
}
