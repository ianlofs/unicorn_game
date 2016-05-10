require('../css/pantheon_game.css');

import GameObjectFactory from './gameObjectFactory';
import { FIRE_CODE } from './constants';
import { Unicorn, Bolt, Cerbere } from './GameObject';

window.APP = window.APP   || {};

APP.gameCanvas = document.getElementById('game_container');

APP.gameCanvas.height = window.innerHeight;
APP.gameCanvas.width = window.innerWidth;
APP.context = APP.gameCanvas.getContext('2d');

APP.imagesLoaded = false;
APP.keysPressed = {};
APP.scoreDiv = document.getElementsByClassName('score');
APP.score = 0;

APP.init = function() {
  APP.setup.addListeners();
  APP.setup.loadImages(APP.setup.initObjects, APP.play);
};

APP.pause = function() {
  console.log('pause');
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
    APP.collidesWithPlayer(APP.unicorn, APP.enemies.all);
    APP.unicorn.update(APP.core.delta, APP.gameCanvas.width, APP.gameCanvas.height, APP.keysPressed);
    APP.bolts.update(APP.core.delta);
    APP.enemies.update(APP.core.delta, APP.unicorn);
  },
  clear: function() {
    APP.context.fillStyle = 'black';
    APP.context.fillRect(0, 0,APP.gameCanvas.width, APP.gameCanvas.height);
  },
  render: function() {
    if (APP.imagesLoaded) {
      APP.core.clear();
      APP.bolts.draw(APP.context);
      APP.unicorn.render(APP.context, APP.images.unicorn);
      APP.enemies.draw(APP.context);
      APP.drawStats();
    }
  }
};

APP.drawStats = function() {
  APP.context.font = "32px serif";
  APP.context.fillStyle = 'white';
  APP.context.fillText('Score: ' + APP.score, 10, 50);
  APP.context.fillText('Lives: ' + APP.unicorn.lives, APP.gameCanvas.width - 150, 50)
}

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
   APP.images.unicorn.src = require('../assets/sprite-unicorn.png');
   APP.images.cerbere.src = require('../assets/Cerbere.png');
   APP.images.hades.src = require('../assets/Hades_T.png');
   APP.images.bolt.src = require('../assets/pantheon-logo-symbol.svg');
  },
  addListeners: function() {
    window.addEventListener('keydown', function(event) {
      APP.keysPressed[event.keyCode] = true;
      if (APP.keysPressed[FIRE_CODE]) {
        APP.bolts.fireBolt();
      }
    });
    window.addEventListener('keyup', function(event) {
      APP.keysPressed[event.keyCode] = false;
    });
  },
  initObjects: function() {

    /* ------------------------- setup player object unicorn ----------------------------*/
    APP.unicorn = new Unicorn();
    APP.unicorn.lives = 10;

    /* ------------------------- setup game objects ----------------------------*/
    // pantheon logo bullets
    APP.bolts = new GameObjectFactory(APP.gameCanvas.width, APP.gameCanvas.height,
                                      40, 19, APP.images.bolt);
    APP.bolts.level = 2;
    APP.bolts.sound = new Audio('./assets/laser_blast.mp3');
    APP.bolts.fireBolt = function() {
        this.all.push(new Bolt(APP.unicorn.x + APP.unicorn.width, APP.unicorn.y, APP.bolts.level, APP.bolts.width, APP.bolts.height, 700));
        this.sound.pause();
        this.sound.currentTime = 0;
        this.sound.play();
    };
    APP.enemies = new GameObjectFactory(APP.gameCanvas.width, APP.gameCanvas.height,
                                        48, 50, APP.images.cerbere);
    // wordpress and drupal logos, "powerUps"
    // APP.powerUps = new GameObjectFactory(100, 100, 200, 2);
  }

}

APP.collidesWithPlayer = function(playerObj, enemies) {
  return enemies.map((enemy, i) => {
    if (playerObj.x + playerObj.width < enemy.x || playerObj.x > enemy.x + enemy.width ||
        playerObj.y + playerObj.height < enemy.y || playerObj.y > enemy.y + enemy.y) {
      // no collisions
    } else {
      --APP.unicorn.lives;
      enemies.splice(i, 1);
    }
  });
}

APP.collisionDetector = function(gameObjectArr1, gameObjectArr2) {
  for (var obj in gameObjectArr1) {
    for (var gameObj in gameObjectArr2) {
      if (gameObjectArr1[obj].x + gameObjectArr1[obj].width < gameObjectArr2[gameObj].x ||
          gameObjectArr1[obj].x > gameObjectArr2[gameObj].x + gameObjectArr2[gameObj].width ||
          gameObjectArr1[obj].y + gameObjectArr1[obj].height < gameObjectArr2[gameObj].y ||
          gameObjectArr1[obj].y > gameObjectArr2[gameObj].y + gameObjectArr2[gameObj].y) {
        // no collisions
      } else {
        ++APP.score;
        gameObjectArr1.splice(obj, 1);
        gameObjectArr2.splice(gameObj, 1);
        break;
      }
    }
  }
}


APP.init();

setInterval(() => {
  APP.enemies.all.push(new Cerbere((Math.random() * APP.gameCanvas.width/2) + APP.gameCanvas.width/2,
                                   Math.random() * APP.gameCanvas.height,
                                   2, APP.enemies.width, APP.enemies.height, 500,
                                   APP.gameCanvas.width, APP.gameCanvas.height));
}, 1000);
