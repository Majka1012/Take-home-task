const gameAudio = {
  background: new Audio("../assets/music/background_music/Funny Game Loop.mp3"),
  crash: new Audio("../assets/music/crash/Cartoon Crash Boing.mp3"),
  fail: new Audio("../assets/music/endcard_fail/Fail.mp3"),
  win: new Audio("../assets/music/endcard_win/applause.mp3"),
  cheer: new Audio("../assets/music/endcard_win/Celebrative Happy Woohoo Cheer 2.mp3"),

  init() {
    this.background.loop = true;
    this.background.volume = 0.2;

    this.crash.volume = 0.4;
    this.fail.volume = 0.3;
    this.win.volume = 0.5;
    this.cheer.volume = 0.5;
  },

  play(sound) {
    sound.currentTime = 0;
    sound.play().catch(function () {});
  },

  startBackground() {
    this.background.play().catch(function () {});
  },

  pauseBackground() {
    this.background.pause();
  },

  stopBackground() {
    this.background.pause();
    this.background.currentTime = 0;
  },

  playCrash() {
    this.play(this.crash);
  },

  playFail() {
    this.play(this.fail);
  },

  playWin() {
    this.play(this.win);
    this.play(this.cheer);
  },

  stopAll() {
    Object.values(this).forEach(function (sound) {
      if (sound instanceof Audio) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
  },
};

gameAudio.init();
