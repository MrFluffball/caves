var canvas = document.getElementById("game")
var ctx = canvas.getContext("2d")

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.imageSmoothingEnabled = false

var tilesize = 50
var atlasTilesize = 16

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
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.img = img

    this.draw = function(x,y) {
      ctx.drawImage(this.img, x, y, this.w, this.h);
    }
    this.drawRotated = function(degrees){
      // save the unrotated context of the canvas so we can restore it later
      ctx.save();
      // move to the specified position
      ctx.translate(this.x,this.y);
      ctx.rotate(degrees*Math.PI/180); // rotate and draw

      ctx.drawImage(tileAtlas,-this.w/2,-this.w/2, this.w, this.h);
      ctx.restore();
    }
  }
}

class TileSprite {
  constructor(x, y, w, h, tilemapX, tilemapY) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.tilemapX = tilemapX
    this.tilemapY = tilemapY

    this.draw = function(x,y) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tileAtlas, this.tilemapX * atlasTilesize + (this.tilemapX + 1), this.tilemapY*atlasTilesize + (this.tilemapY + 1), atlasTilesize, atlasTilesize, x, y, this.w, this.h)
    }
  }
}

// values to sync up animation
var startDate = Date.now()
var elapsedms = 0

class AnimatedSprite  {
  constructor(x, y, w, h, tilemapX, tilemapY, frame, fps, maxFrames) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.tilemapX = tilemapX
    this.tilemapY = tilemapY
    // for animations, we assume each row on the atlas is a sequence of frames.
    // this means ( row, 0 ) frame is the orginal sprite
    this.frames = frames
    this.fps = fps
    this.frame = 1
    this.maxFrames = 3
    //this.startDate = 0

    this.draw = function(x,y) {
      ctx.drawImage(tileAtlas, this.tilemapX + (100*(this.frame-1)), this.tilemapY, 100, 100, x, y, this.w, this.h)
      // check if the right amount of time has passed to move to the next frame
      //let lifespan = Date.now() - this.startDate

      let frameTime = 1000/this.fps
      for (var i = 0; i < this.maxFrames; i += 1) {
        if (elapsedms >= frameTime*i) {
          // update it accordingly
          if (this.frame < this.maxFrames) { this.frame += 1 }
          if (this.frame == this.maxFrames ) { this.frame = 1 }

          //this.startDate = Date.now()
        }
      }
    }
  }
}

function updateAnimationCounter() {
  if (Date.now() - startDate >= 1000) {
    startDate = Date.now()
  }
  return elapsedms = Date.now() - startDate
}

// Sprites
let tileAtlas = document.getElementById("tiles")
//let playerSprite = document.getElementById("player")

class Tile {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.screenX = x
    this.screenY = y
    this.rect = new BoundingRect(x, y, tilesize, tilesize)
    this.solid = false
  }
}

class Floor extends Tile {
  constructor(x, y) {
    super(Tile)
    this.x = x
    this.y = y
      this.sprite = new TileSprite(this.x, this.y, this.rect.w, this.rect.h, 0, 0)
  }
}

class Wall extends Tile {
  constructor(x, y) {
    super(Tile)
    this.x = x
    this.y = y
    this.sprite = new TileSprite(this.x, this.y, this.rect.w, this.rect.h, 1, 0)
    this.solid = true
  }
}
