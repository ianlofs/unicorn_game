import { MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT } from './constants'

// abstract-ish class for game objects
class GameObject {
  constructor(x, y, level, width, height, speed) {
    this.x = x;
    this.y = y;
    this.level = level;
    this.width = width * this.level;
    this.height = height * this.level;
    this.speed = speed;
    this.hitCount = 0;
  }
  update() {
    throw new Error('Update not implemented');
  }
  render(context, image) {
    context.drawImage(image, this.x, this.y, this.width, this.height);
  }
}

class Unicorn extends GameObject {
  constructor() {
    super(25, 230, 2, 90, 60, 200); // x,y,level, width, height, speed
    this.numFrames = 7;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = 8;
  }
  update(delta, gameWidth, gameHeight, keysPressed) {
    // bounds checking
    var velocity = this.speed * delta;
    if (this.y < 0) { this.y = 0; }
    if (this.x < 0) { this.x = 0; }
    if (this.y > gameHeight - this.height) { this.y = gameHeight - this.height; }
    if (this.x > gameWidth - this.width)   { this.x = gameWidth - this.width; }

    // movement
    if(keysPressed[MOVE_DOWN])  { this.y += velocity; }
    if(keysPressed[MOVE_LEFT])  { this.x += velocity; }
    if(keysPressed[MOVE_UP])    { this.y -= velocity; }
    if(keysPressed[MOVE_RIGHT]) { this.x -= velocity; }

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
  }
  render(context, image) {
    context.drawImage(image,
      this.frameIndex * image.width / this.numFrames, 0, //draw part of the sprite-sheet
      240, 160, // each frame in sprite-sheet is 240 px wide, and 160px tall
      this.x, this.y, this.width, this.height);
  }
}


class Bolt extends GameObject {
  // Call the parent constructor, making sure (using Function#call)
  // that "this" is set correctly during the call
  constructor(x, y, level, width, height, speed) {
    super(x, y, level, width, height, speed);
  }

  update(delta) {
    this.x += (this.speed * delta);
  }
}

// Cerbere is Hades' mythical three headed dog. They are the base
// enemies in this game.
class Cerbere extends GameObject {
  constructor(x, y, level, width, height, speed, gameWidth, gameHeight) {
    super(x, y, level, width, height, speed);
    this.xDir = 1;
    this.yDir = 1;
    this.__posUpdatLevel__ = 50;
    this.posUpdatLevel = 50;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
  }

  update(delta, target) {
    if (this.y < 0) { this.y = 0; this.yDir = 1 }
    if (this.y > this.gameHeight - this.height) {
      this.y = this.gameHeight - this.height;
      this.yDir = -1;
    }
    if (this.x < 0) { this.x = 0; this.xDir = 1; }
    if (this.x > this.gameWidth - this.width){
      this.x = this.gameWidth - this.width;
      this.XDir = -1;
    }
    this.__posUpdatLevel__--;
    if (this.__posUpdatLevel__ === 0) {
      this.__posUpdatLevel__ = this.posUpdatLevel;
      if (this.y < target.y) { this.yDir = 1; }
      if (this.y > target.y) { this.yDir = -1; }
      if (this.x < target.x) { this.xDir = 1; }
      if (this.x > target.x) { this.xDir = -1; }
    }

    this.x += this.xDir * (this.speed * delta);
    this.y += this.yDir * (this.speed * delta);
  }
}

export { Unicorn, Bolt, Cerbere }
