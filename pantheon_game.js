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

APP.init = function() {
  APP.setup.addListeners();
  APP.setup.loadImages(APP.setup.initObjects, APP.play);
};

APP.pause = function() {
  window.cancelAnimationFrame(APP.core.animationFrameLoop);
  APP.isRunning = false;
};

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
    APP.core.animationFrameLoop = window.requestAnimationFrame(APP.core.frame);
  },
  setDelta: function() {
    APP.core.now = Date.now();
    APP.core.delta = (APP.core.now - APP.core.then) / 1000; // seconds since last frame
    APP.core.then = APP.core.now;
  },
  update: function() {
    APP.collisionDetector(APP.bolts.all, APP.enemies.all);
    APP.unicorn.update();
    APP.bolts.update();
    APP.enemies.update();
  },
  clear: function() {
    APP.context.fillStyle = 'rgba(0,0,0)';
    APP.context.fillRect(0, 0,APP.gameCanvas.width, APP.gameCanvas.height);
  },
  render: function() {
    if (APP.imagesLoaded) {
      APP.core.clear();
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
        APP.enemies.all.push(new APP.Cerbere());
      }
    });
    window.addEventListener('keyup', function(event) {
      APP.keysPressed[event.keyCode] = false;
    });
  },
  initObjects: function() {

    /* ------------------------- setup player object unicorn ----------------------------*/
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
      numLives: 3,
      update: function() {
        if (this.numLives === 0) {
          APP.init();
        }

        // bounds checking
        var velocity = this.speed * APP.core.delta;
        if (this.y < 0) { this.y = 0; }
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
          this.frameIndex * APP.images.unicorn.width / this.numFrames, //draw part of the sprite-sheet
          0, 240, 160, // each frame in sprite-sheet is 240 px wide, and 160px tall
          this.x,
          this.y,
          this.width,
          this.height);
      }
    };

    /* ------------------------- setup game objects ----------------------------*/
    // pantheon logo bullets
    APP.bolts = new APP.GameObjectFactory(40, 19, 700, 2);
    APP.bolts.sound = new Audio('laser_blast.mp3');
    APP.bolts.fireBolt = function() {
        this.all.push(new APP.Bolt());
        this.sound.pause();
        this.sound.currentTime = 0;
        this.sound.play();
    };
    // enemies in the game
    APP.enemies = new APP.GameObjectFactory(48, 50, 200, 2);
    // wordpress and drupal logos, "powerUps"
    APP.powerUps = new APP.GameObjectFactory(100, 100, 200, 2);
  }

}

APP.collisionDetector = function(gameObjectArr1, gameObjectArr2) {
  for (var obj in gameObjectArr1) {
    for (var gameObj in gameObjectArr2) {
      if (gameObjectArr1[obj].x + gameObjectArr1[obj].width < gameObjectArr2[gameObj].x ||
          gameObjectArr1[obj].x > gameObjectArr2[gameObj].x + gameObjectArr2[obj].width ||
          gameObjectArr1[obj].y + gameObjectArr1[obj].height < gameObjectArr2[gameObj].y ||
          gameObjectArr1[obj].y > gameObjectArr2[gameObj].y + gameObjectArr2[gameObj].y)
      {
        // no collisions
      } else {
        gameObjectArr1.splice(obj, 1);
        gameObjectArr2.splice(gameObj, 1);
      }
    }
  }
}

// returns a new object with basic draw and update methods, can be extended once instantiated
APP.GameObjectFactory = function (width, height, speed, level) {
  this.all = [];
  this.width = width;
  this.height = height;
  this.level = level || 1;
  this.speed = speed || 200;
}

APP.GameObjectFactory.prototype = {
  update: function() {
    var instance = this;
    instance.all.map(function (obj) {
      obj.update();
    });
  },
  draw: function() {
    var instance = this;
    instance.all.map(function(obj) {
      obj.render();
    });
  }
}

// abstract class for game objects
APP.GameObject = function(x, y, factoryLevel, factoryWidth, factoryHeight) {
  this.x = x;
  this.y = y;
  this.level = factoryLevel;
  this.width = factoryWidth * this.level;
  this.height = factoryHeight * this.level;
  this.hitCount = 0;
}

APP.GameObject.prototype = {
  update: function() {
    throw new Error('Update not implemented');
  },
  render: function() {
    throw new Error('Render not implemented');
  }
}

APP.Bolt = function() {
  // Call the parent constructor, making sure (using Function#call)
  // that "this" is set correctly during the call
  APP.GameObject.call(this, APP.unicorn.x + APP.unicorn.width, APP.unicorn.y,
    APP.bolts.level, APP.bolts.width, APP.bolts.height);
}
APP.Bolt.prototype = Object.create(APP.GameObject.prototype);
APP.Bolt.prototype.constructor = APP.Bolt;
APP.Bolt.prototype.update = function() {
  this.x += (APP.bolts.speed * APP.core.delta);
};
APP.Bolt.prototype.render = function(boltIndex) {
  // only draw if the x is within gameCanvas
  if (!(this.x > APP.gameCanvas.width)) {
    APP.context.drawImage(APP.images.bolt, this.x, this.y, this.width, this.height);
  } else {
    // remove from bolts so the GC can get rid of them
    APP.bolts.all.splice(boltIndex, 1);
  }
};

// Cerbere is Hades' mythical three headed dog. They are the base
// enemies in this game.
APP.Cerbere = function(x, y) {
  APP.GameObject.call(this, x || APP.gameCanvas.width - APP.enemies.width, y || Math.random() * APP.gameCanvas.height,
    APP.enemies.level, APP.enemies.width, APP.enemies.height);
  this.xDir = 1;
  this.yDir = 1;
  this.__posUpdatLevel__ = 50;
  this.posUpdatLevel = 50;
}
APP.Cerbere.prototype = Object.create(APP.GameObject.prototype);
APP.Cerbere.prototype.constructor = APP.Cerbere;
APP.Cerbere.prototype.update = function() {
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
  this.__posUpdatLevel__--;
  if (this.__posUpdatLevel__ === 0) {
    this.__posUpdatLevel__ = this.posUpdatLevel;
    if (this.y < APP.unicorn.y) { this.yDir = 1; }
    if (this.y > APP.unicorn.y) { this.yDir = -1; }
    if (this.x < APP.unicorn.x) { this.xDir = 1; }
    if (this.x > APP.unicorn.x) {this.xDir = -1; }
  }

  this.x += this.xDir * (APP.enemies.speed * APP.core.delta);
  this.y += this.yDir * (APP.enemies.speed * APP.core.delta);
};
APP.Cerbere.prototype.render = function(enemyIndex) {
  APP.context.drawImage(APP.images.cerbere, this.x, this.y, APP.enemies.width * this.level, APP.enemies.height * this.level);
};

APP.init();
