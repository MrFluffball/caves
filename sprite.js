var canvas = document.getElementById("game")
var ctx = canvas.getContext("2d")

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.imageSmoothingEnabled = false


class BoundingRect {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }
}

class Sprite {
  constructor(img, x, y, w, h) {
    this.img = img
    this.x = x
    this.y = y
    this.w = w
    this.h = h

    this.draw = function(x,y) {
      ctx.drawImage(img, x, y, this.w, this.h)
    }
    this.drawRotated = function(degrees){
      // save the unrotated context of the canvas so we can restore it later
      ctx.save();
      // move to the specified position
      ctx.translate(this.x,this.y);
      ctx.rotate(degrees*Math.PI/180); // rotate and draw

      ctx.drawImage(this.img,-this.w/2,-this.w/2, this.w, this.h);
      ctx.restore();
    }
  }
}

// Sprites
let floorSprite = document.getElementById("floor")
let wallSprite = document.getElementById("wall")
let playerSprite = document.getElementById("player")

var tilesize = 50

class Tile {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.screenX = x
    this.screenY = y
    this.rect = new BoundingRect(x, y, tilesize, tilesize)
  }
}

class Floor extends Tile {
  constructor(x, y) {
    super(Tile)
    this.x = x
    this.y = y
    this.sprite = new Sprite(floorSprite, this.x, this.y, this.rect.w, this.rect.h, 0)
  }
}

class Wall extends Tile {
  constructor(x, y) {
    super(Tile)
    this.x = x
    this.y = y
    this.sprite = new Sprite(wallSprite, this.x, this.y, this.rect.w, this.rect.h, 0)
  }
}
