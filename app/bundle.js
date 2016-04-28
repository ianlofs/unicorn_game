/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _gameObjectFactory = __webpack_require__(1);
	
	var _gameObjectFactory2 = _interopRequireDefault(_gameObjectFactory);
	
	var _constants = __webpack_require__(3);
	
	var _GameObject = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	window.APP = window.APP || {};
	
	APP.gameCanvas = document.getElementById('game_container');
	
	APP.gameCanvas.height = window.innerHeight;
	APP.gameCanvas.width = window.innerWidth;
	APP.context = APP.gameCanvas.getContext('2d');
	
	APP.imagesLoaded = false;
	APP.keysPressed = {};
	
	APP.init = function () {
	  APP.setup.addListeners();
	  APP.setup.loadImages(APP.setup.initObjects, APP.play);
	};
	
	APP.pause = function () {
	  window.cancelAnimationFrame(APP.core.animationFrameLoop);
	  APP.isRunning = false;
	};
	
	APP.play = function () {
	  if (!APP.isRunning) {
	    APP._then = Date.now();
	    APP.core.frame();
	    APP.isRunning = true;
	  }
	};
	
	APP.core = {
	  frame: function frame() {
	    APP.core.setDelta();
	    APP.core.update();
	    APP.core.render();
	    APP.core.animationFrameLoop = window.requestAnimationFrame(APP.core.frame);
	  },
	  setDelta: function setDelta() {
	    APP.core.now = Date.now();
	    APP.core.delta = (APP.core.now - APP.core.then) / 1000; // seconds since last frame
	    APP.core.then = APP.core.now;
	  },
	  update: function update() {
	    APP.collisionDetector(APP.bolts.all, APP.enemies.all);
	    APP.unicorn.update(APP.core.delta, APP.gameCanvas.width, APP.gameCanvas.height, APP.keysPressed);
	    APP.bolts.update(APP.core.delta);
	    APP.enemies.update(APP.core.delta, APP.unicorn);
	  },
	  clear: function clear() {
	    APP.context.fillStyle = 'rgba(0,0,0)';
	    APP.context.fillRect(0, 0, APP.gameCanvas.width, APP.gameCanvas.height);
	  },
	  render: function render() {
	    if (APP.imagesLoaded) {
	      APP.core.clear();
	      APP.bolts.draw(APP.context);
	      APP.unicorn.render(APP.context, APP.images.unicorn);
	      APP.enemies.draw(APP.context);
	    }
	  }
	};
	
	APP.setup = {
	  loadImages: function loadImages(initObjects, play) {
	    APP.images = {};
	    APP.images.unicorn = new Image();
	    APP.images.cerbere = new Image(75, 75);
	    APP.images.hades = new Image(113, 300);
	    APP.images.bolt = new Image(80, 38);
	    var imagesLen = Object.keys(APP.images).length;
	    var imagesLoaded = 0;
	    for (var imgKey in APP.images) {
	      APP.images[imgKey].onload = function () {
	        if (++imagesLoaded === imagesLen) {
	          initObjects();
	          play();
	          APP.imagesLoaded = true;
	        }
	      };
	    }
	    APP.images.unicorn.src = 'assets/sprite-unicorn.png';
	    APP.images.cerbere.src = 'assets/Cerbere.png';
	    APP.images.hades.src = 'assets/Hades_T.png';
	    APP.images.bolt.src = 'assets/pantheon-logo-symbol.svg';
	  },
	  addListeners: function addListeners() {
	    window.addEventListener('keydown', function (event) {
	      APP.keysPressed[event.keyCode] = true;
	      if (APP.keysPressed[_constants.FIRE_CODE]) {
	        APP.bolts.fireBolt();
	        //APP.enemies.all.push(new APP.Cerbere());
	      }
	    });
	    window.addEventListener('keyup', function (event) {
	      APP.keysPressed[event.keyCode] = false;
	    });
	  },
	  initObjects: function initObjects() {
	
	    /* ------------------------- setup player object unicorn ----------------------------*/
	    APP.unicorn = new _GameObject.Unicorn();
	
	    /* ------------------------- setup game objects ----------------------------*/
	    // pantheon logo bullets
	    APP.bolts = new _gameObjectFactory2.default(APP.gameCanvas.width, APP.gameCanvas.height, 40, 19, APP.images.bolt);
	    APP.bolts.sound = new Audio('./assets/laser_blast.mp3');
	    APP.bolts.fireBolt = function () {
	      this.all.push(new _GameObject.Bolt(APP.unicorn.x + APP.unicorn.width, APP.unicorn.y, 2, APP.bolts.width, APP.bolts.height, 700));
	      this.sound.pause();
	      this.sound.currentTime = 0;
	      this.sound.play();
	    };
	    // enemies in the game, , 40, 19, APP.images.bolt
	    APP.enemies = new _gameObjectFactory2.default(APP.gameCanvas.width, APP.gameCanvas.height, 48, 50, APP.images.cerbere);
	    // wordpress and drupal logos, "powerUps"
	    // APP.powerUps = new GameObjectFactory(100, 100, 200, 2);
	  }
	
	};
	
	APP.collisionDetector = function (gameObjectArr1, gameObjectArr2) {
	  for (var obj in gameObjectArr1) {
	    for (var gameObj in gameObjectArr2) {
	      if (gameObjectArr1[obj].x + gameObjectArr1[obj].width < gameObjectArr2[gameObj].x || gameObjectArr1[obj].x > gameObjectArr2[gameObj].x + gameObjectArr2[gameObj].width || gameObjectArr1[obj].y + gameObjectArr1[obj].height < gameObjectArr2[gameObj].y || gameObjectArr1[obj].y > gameObjectArr2[gameObj].y + gameObjectArr2[gameObj].y) {
	        // no collisions
	      } else {
	          gameObjectArr1.splice(obj, 1);
	          gameObjectArr2.splice(gameObj, 1);
	          break;
	        }
	    }
	  }
	};
	
	APP.init();
	
	setInterval(function () {
	  APP.enemies.all.push(new _GameObject.Cerbere(Math.random() * APP.gameCanvas.width / 2 + APP.gameCanvas.width / 2, Math.random() * APP.gameCanvas.height, 2, APP.enemies.width, APP.enemies.height, 200, APP.gameCanvas.width, APP.gameCanvas.height));
	}, 1000);

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/*
	class GameObjectFactory
	summary: A container for base properties of a game object
	*/
	
	var GameObjectFactory = function () {
	  function GameObjectFactory(gameWidth, gameHeight, width, height, img) {
	    _classCallCheck(this, GameObjectFactory);
	
	    this.all = [];
	    this.gameWidth = gameWidth;
	    this.gameHeight = gameHeight;
	    this.width = width;
	    this.height = height;
	    this.img = img;
	  }
	
	  _createClass(GameObjectFactory, [{
	    key: "update",
	    value: function update(delta, target) {
	      var instance = this;
	      return instance.all.map(function (obj, i) {
	        if (obj.x > instance.gameWidth + 100 || obj.y > instance.gameHeigth + 100 || obj.x < -100 || obj.y < -100) {
	          instance.all.splice(i, 1);
	        } else {
	          obj.update(delta, target);
	        }
	      });
	    }
	  }, {
	    key: "draw",
	    value: function draw(context) {
	      var img = this.img;
	      return this.all.map(function (obj) {
	        obj.render(context, img);
	      });
	    }
	  }]);
	
	  return GameObjectFactory;
	}();
	
	exports.default = GameObjectFactory;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Cerbere = exports.Bolt = exports.Unicorn = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _constants = __webpack_require__(3);
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// abstract-ish class for game objects
	
	var GameObject = function () {
	  function GameObject(x, y, level, width, height, speed) {
	    _classCallCheck(this, GameObject);
	
	    this.x = x;
	    this.y = y;
	    this.level = level;
	    this.width = width * this.level;
	    this.height = height * this.level;
	    this.speed = speed;
	    this.hitCount = 0;
	  }
	
	  _createClass(GameObject, [{
	    key: 'update',
	    value: function update() {
	      throw new Error('Update not implemented');
	    }
	  }, {
	    key: 'render',
	    value: function render(context, image) {
	      context.drawImage(image, this.x, this.y, this.width, this.height);
	    }
	  }]);
	
	  return GameObject;
	}();
	
	var Unicorn = function (_GameObject) {
	  _inherits(Unicorn, _GameObject);
	
	  function Unicorn() {
	    _classCallCheck(this, Unicorn);
	
	    // x,y,level, width, height, speed
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Unicorn).call(this, 25, 230, 2, 90, 60, 200));
	
	    _this.numFrames = 7;
	    _this.frameIndex = 0;
	    _this.tickCount = 0;
	    _this.ticksPerFrame = 8;
	    return _this;
	  }
	
	  _createClass(Unicorn, [{
	    key: 'update',
	    value: function update(delta, gameWidth, gameHeight, keysPressed) {
	      // bounds checking
	      var velocity = this.speed * delta;
	      if (this.y < 0) {
	        this.y = 0;
	      }
	      if (this.x < 0) {
	        this.x = 0;
	      }
	      if (this.y > gameHeight - this.height) {
	        this.y = gameHeight - this.height;
	      }
	      if (this.x > gameWidth - this.width) {
	        this.x = gameWidth - this.width;
	      }
	
	      // movement
	      if (keysPressed[_constants.MOVE_DOWN]) {
	        this.y += velocity;
	      }
	      if (keysPressed[_constants.MOVE_LEFT]) {
	        this.x += velocity;
	      }
	      if (keysPressed[_constants.MOVE_UP]) {
	        this.y -= velocity;
	      }
	      if (keysPressed[_constants.MOVE_RIGHT]) {
	        this.x -= velocity;
	      }
	
	      // unicorn running animation
	      this.tickCount += 1;
	      if (this.tickCount > this.ticksPerFrame) {
	        this.tickCount = 0;
	        // If the current frame index is in range
	        if (this.frameIndex < this.numFrames - 1) {
	          // Go to the next frame
	          this.frameIndex += 1;
	        } else {
	          this.frameIndex = 0;
	        }
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render(context, image) {
	      context.drawImage(image, this.frameIndex * image.width / this.numFrames, 0, //draw part of the sprite-sheet
	      240, 160, // each frame in sprite-sheet is 240 px wide, and 160px tall
	      this.x, this.y, this.width, this.height);
	    }
	  }]);
	
	  return Unicorn;
	}(GameObject);
	
	var Bolt = function (_GameObject2) {
	  _inherits(Bolt, _GameObject2);
	
	  // Call the parent constructor, making sure (using Function#call)
	  // that "this" is set correctly during the call
	
	  function Bolt(x, y, level, width, height, speed) {
	    _classCallCheck(this, Bolt);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Bolt).call(this, x, y, level, width, height, speed));
	  }
	
	  _createClass(Bolt, [{
	    key: 'update',
	    value: function update(delta) {
	      this.x += this.speed * delta;
	    }
	  }]);
	
	  return Bolt;
	}(GameObject);
	
	// Cerbere is Hades' mythical three headed dog. They are the base
	// enemies in this game.
	
	
	var Cerbere = function (_GameObject3) {
	  _inherits(Cerbere, _GameObject3);
	
	  function Cerbere(x, y, level, width, height, speed, gameWidth, gameHeight) {
	    _classCallCheck(this, Cerbere);
	
	    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Cerbere).call(this, x, y, level, width, height, speed));
	
	    _this3.xDir = 1;
	    _this3.yDir = 1;
	    _this3.__posUpdatLevel__ = 50;
	    _this3.posUpdatLevel = 50;
	    _this3.gameWidth = gameWidth;
	    _this3.gameHeight = gameHeight;
	    return _this3;
	  }
	
	  _createClass(Cerbere, [{
	    key: 'update',
	    value: function update(delta, target) {
	      if (this.y < 0) {
	        this.y = 0;this.yDir = 1;
	      }
	      if (this.y > this.gameHeight - this.height) {
	        this.y = this.gameHeight - this.height;
	        this.yDir = -1;
	      }
	      if (this.x < 0) {
	        this.x = 0;this.xDir = 1;
	      }
	      if (this.x > this.gameWidth - this.width) {
	        this.x = this.gameWidth - this.width;
	        this.XDir = -1;
	      }
	      this.__posUpdatLevel__--;
	      if (this.__posUpdatLevel__ === 0) {
	        this.__posUpdatLevel__ = this.posUpdatLevel;
	        if (this.y < target.y) {
	          this.yDir = 1;
	        }
	        if (this.y > target.y) {
	          this.yDir = -1;
	        }
	        if (this.x < target.x) {
	          this.xDir = 1;
	        }
	        if (this.x > target.x) {
	          this.xDir = -1;
	        }
	      }
	
	      this.x += this.xDir * (this.speed * delta);
	      this.y += this.yDir * (this.speed * delta);
	    }
	  }]);
	
	  return Cerbere;
	}(GameObject);
	
	exports.Unicorn = Unicorn;
	exports.Bolt = Bolt;
	exports.Cerbere = Cerbere;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var SHOT_SPEED = 3; // timer  is on a 1ms interval, so this is (pixels moved / ms)
	var FIRE_CODE = 32; //space bar keycode, fires bolt
	var MOVE_UP = 38;
	var MOVE_DOWN = 40;
	var MOVE_RIGHT = 37;
	var MOVE_LEFT = 39;
	
	exports.SHOT_SPEED = SHOT_SPEED;
	exports.FIRE_CODE = FIRE_CODE;
	exports.MOVE_UP = MOVE_UP;
	exports.MOVE_DOWN = MOVE_DOWN;
	exports.MOVE_LEFT = MOVE_LEFT;
	exports.MOVE_RIGHT = MOVE_RIGHT;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map