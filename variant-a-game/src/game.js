window.addEventListener("load", function () {
  document.querySelectorAll("#ad img").forEach(function (img) {
    img.style.width = img.naturalWidth / 2 + "px";
  });
  ad.style.visibility = "visible";
});

const player = document.getElementById("player");
const ad = document.getElementById("ad");

let started = false;
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
    return;
  }

  const angle = Math.max(-15, Math.min(15, speed * 5));
  gsap.set(player, { y: y, rotation: angle });

  scroll = scroll + 1;
  obstacles.forEach(function (o) {
    o.img.style.transform = `translate(${o.x - scroll}px, ${o.y}px)`;
  });

  requestAnimationFrame(loop);
}

document.addEventListener("pointerdown", function () {
  if (!started) {
    started = true;
    gsap.to(".intro", { autoAlpha: 0, duration: 0.4, ease: "power1.out" });
    gsap.to("#game", { x: -2168, duration: 50, ease: "none" });
    loop();
  } else {
    speed = -4;
  }
});
