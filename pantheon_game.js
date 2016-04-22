var SHOT_SPEED = 3; // timer  is on a 1ms interval, so this is (pixels moved / ms)
var FIRE_CODE =  32; //space bar keycode, fires bolt
var MOVE_UP = 38;
var MOVE_DOWN = 40;
var MOVE_RIGHT = 37;
var MOVE_LEFT = 39;
var SCALE_FACTOR = 2;
window.APP = window.APP   || {};

APP.gameCanvas = document.getElementById('game_container');
APP.gameCanvas.height = window.innerHeight;
APP.gameCanvas.width = window.innerWidth;
APP.context = APP.gameCanvas.getContext('2d');

APP.imagesLoaded = false;
APP.keysPressed = {};
APP.boltsArr = [];

APP.init = function() {
  APP.setup.addListeners();
  APP.setup.loadImages(APP.setup.initObjects, APP.play);
};
/*
APP.pause = function() {
  window.cancelAnimationFrame(APP.animationFrameLoop);
  APP.isRunning = false;
};
*/
APP.play = function() {
  if(!APP.isRunning) {
    APP._then = Date.now();
    APP.core.frame();
    APP.isRunning = true;
  }
};

APP.core = {
  frame: function() {
    APP.core.setDelta();
    APP.core.update();
    APP.core.render();
    APP.core.animationFrame = window.requestAnimationFrame(APP.core.frame);
  },
  setDelta: function() {
    APP.core.now = Date.now();
    APP.core.delta = (APP.core.now - APP.core.then) / 1000; // seconds since last frame
    APP.core.then = APP.core.now;
  },
  update: function() {
    APP.unicorn.update();
    APP.bolts.update();
    APP.enemies.update();
  },
  clear: function() {
    APP.context.fillStyle = 'rgba(0,0,0)';
    APP.context.fillRect(0, 0,APP.gameCanvas.width, APP.gameCanvas.height);
  },
  render: function() {
    APP.core.clear();
    if (APP.imagesLoaded) {
      APP.bolts.draw();
      APP.unicorn.draw();
      APP.enemies.draw();
    }
  }
};

APP.setup = {
  loadImages: function(initObjects, play) {
    APP.images = {};
    APP.images.unicorn = new Image();
    APP.images.cerbere = new Image(75, 75);
    APP.images.hades = new Image(113, 300);
    APP.images.bolt = new Image(80, 38);
    var imagesLen = Object.keys(APP.images).length;
    var imagesLoaded = 0;
    for (var imgKey in APP.images) {
      APP.images[imgKey].onload = function() {
        if (++imagesLoaded === imagesLen) {
          initObjects();
          play();
          APP.imagesLoaded = true;
        }
      }
    }
   APP.images.unicorn.src = 'sprite-unicorn.png';
   APP.images.cerbere.src = 'Cerbere.png';
   APP.images.hades.src = 'Hades_T.png';
   APP.images.bolt.src = 'pantheon-logo-symbol.svg';
  },
  addListeners: function() {
    window.addEventListener('keydown', function(event) {
      APP.keysPressed[event.keyCode] = true;
      if (APP.keysPressed[FIRE_CODE]) {
        APP.bolts.fireBolt();
        APP.enemies.all.push(new Cerbere(500, 500));
      }
    });
    window.addEventListener('keyup', function(event) {
      APP.keysPressed[event.keyCode] = false;
    });
  },
  initObjects: function() {
    APP.unicorn = {
      y: 230,
      x: 75,
      height: 60 * SCALE_FACTOR,
      width: 90 * SCALE_FACTOR,
      speed: 200,
      numFrames: 7,
      frameIndex: 0,
      tickCount: 0,
      ticksPerFrame: 8,
      update: function() {
        // bounds checking
        var velocity = this.speed * APP.core.delta;
        if (this.y < 0) { this.y = 0; console.log('here')}
        if (this.y > APP.gameCanvas.height - this.height) { this.y = APP.gameCanvas.height - this.height; }
        if (this.x < 0) { this.x =0; }
        if (this.x > APP.gameCanvas.width - this.width){ this.x = APP.gameCanvas.width - this.width; }

        // movement
        if(APP.keysPressed[MOVE_DOWN]) { this.y += velocity; }
        if(APP.keysPressed[MOVE_UP]) { this.y -= velocity; }
        if(APP.keysPressed[MOVE_RIGHT]) { this.x -= velocity; }
        if(APP.keysPressed[MOVE_LEFT]) { this.x += velocity; }

        // unicorn running animation
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            // If the current frame index is in range
            if (this.frameIndex < this.numFrames-1) {
                // Go to the next frame
                this.frameIndex += 1;
            } else {
                this.frameIndex = 0;
            }
        }
      },
      draw: function() {
        APP.context.drawImage(APP.images.unicorn,
          this.frameIndex * APP.images.unicorn.width / this.numFrames,
          0, 240, 160,
          this.x,
          this.y,
          this.width,
          this.height);
      }
    };

    APP.bolts = {
      speed: 700,
      width: 40,
      height: 19,
      sound: new Audio('laser_blast.mp3'),
      level: 2,
      all: [],
      fireBolt: function() {
        this.all.push(new Bolt());
        this.sound.pause();
        this.sound.currentTime = 0;
        this.sound.play();
      },
      update: function () {
        for (var i=0; i < this.all.length; i++) {
          this.all[i].update();
        }
      },
      draw: function() {
        for (var i=0; i < this.all.length; i++) {
          this.all[i].render();
        }
      }
    };

    APP.enemies = {
      all: [],
      width: 48,
      height: 50,
      level: 1,
      speed: 100,
      update: function() {
        for (var i=0; i < this.all.length; i++) {
          this.all[i].update();
        }
      },
      draw: function() {
        for (var i=0; i < this.all.length; i++) {
          this.all[i].render();
        }
      }
    }
  }
}

// Cerbere is Hades' mythical three headed dog. They are the base
// enemies in this game.
function Cerbere(x, y) {
  this.x = x;
  this.y = y;
  this.xDir = 1;
  this.yDir = 1;
  this.hitCount = 0;
  this.level = APP.enemies.level;
  this.width = APP.enemies.width * this.level;
  this.height = APP.enemies.height * this.level;
}

Cerbere.prototype = {
  update: function() {
    if (Math.random() * 40 < 1) {
      this.xDir = Math.round(Math.random()) * 2 - 1;
      this.yDir = Math.round(Math.random()) * 2 - 1;
    }
    if (this.y < 0) { this.y = 0; this.yDir = 1 }
    if (this.y > APP.gameCanvas.height - this.height) {
      this.y = APP.gameCanvas.height - this.height;
      this.yDir = -1;
    }
    if (this.x < 0) { this.x = 0; this.xDir = 1; }
    if (this.x > APP.gameCanvas.width - this.width){
      this.x = APP.gameCanvas.width - this.width;
      this.XDir = -1;
    }

    this.x += this.xDir * (APP.enemies.speed * APP.core.delta);
    this.y += this.yDir * (APP.enemies.speed * APP.core.delta);
  },
  render: function(enemyIndex) {
    if (!(this.x > APP.gameCanvas.width)) {
      APP.context.drawImage(APP.images.cerbere, this.x, this.y, APP.enemies.width * this.level, APP.enemies.height * this.level);
    } else {
      // remove from boltsArr so the GC can get rid of them
      APP.enemies.all.splice(enemyIndex, 1);
    }
  }
}

function Bolt() {
  this.x = APP.unicorn.x + APP.unicorn.width - 25;
  this.y = APP.unicorn.y;
}

Bolt.prototype = {
  update: function() {
    this.x += (APP.bolts.speed * APP.core.delta);
  },
  render: function(boltIndex) {
    // only draw if the x is within gameCanvas
    if (!(this.x > APP.gameCanvas.width)) {
      APP.context.drawImage(APP.images.bolt, this.x, this.y, APP.bolts.width * APP.bolts.level, APP.bolts.height * APP.bolts.level);
    } else {
      // remove from boltsArr so the GC can get rid of them
      APP.bolts.all.splice(boltIndex, 1);
    }
  }
};

APP.init();

setInterval(function() {
  APP.enemies.level++;
}, 10000);