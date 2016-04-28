
/*
class GameObjectFactory
summary: A container for base properties of a game object
*/

class GameObjectFactory {
  constructor (gameWidth, gameHeight, width, height, img) {
    this.all = [];
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.width = width;
    this.height = height;
    this.img = img;
  }

  update(delta, target) {
    var instance = this;
    return instance.all.map(function (obj, i) {
      if (obj.x > instance.gameWidth + 100 || obj.y > instance.gameHeigth + 100
      || obj.x < -100 || obj.y < -100) {
        instance.all.splice(i, 1);
      } else {
        obj.update(delta, target);
      }
    });
  }

  draw(context) {
    var img = this.img;
    return this.all.map(function(obj) {
      obj.render(context, img);
    });
  }
}

export default GameObjectFactory
