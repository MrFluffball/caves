var KeyboardHelper = { left: 37, up: 38, right: 39, down: 40 };

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

function keyDownHandler() {
  if (event.keyCode == KeyboardHelper.left) {
    leftPressed = true;
  } else if (event.keyCode == KeyboardHelper.right) {
    rightPressed = true;
  } else if (event.keyCode == KeyboardHelper.up) {
    upPressed = true;
  } else if (event.keyCode == KeyboardHelper.down) {
    downPressed = true;
  }
}
function keyUpHandler() {
  rightPressed = false;
  leftPressed = false;
  upPressed = false;
  downPressed = false;
}

class Camera {
  constructor(entity) {
    // who am I entity?
    this.entity = entity
    this.w = 512
    this.h = 512
    this.x = 0
    this.y = 0

    this.maxX = map.w * tilesize - this.w;
    this.maxY = map.h * tilesize - this.h;

    console.log(Math.max(0, Math.min(this.x, this.maxX)), Math.max(0, Math.min(this.y, this.maxY)))
  }

  // draws the player in the map
  follow() {
    this.entity.screenX = this.w/2
    this.entity.screenY = this.h/2

    // make the camera follow the sprite
    this.x = this.entity.x - this.w / 2;
    this.y = this.entity.y - this.h / 2;
    // clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));

    // in map corners, the sprite cannot be placed in the center of the screen
    // and we have to change its screen coordinates

    // left and right sides
    if (this.entity.x < this.w / 2 ||
        this.entity.x > this.maxX + this.w / 2) {
        this.entity.screenX = this.entity.x - this.x;
    }
    // top and bottom sides
    if (this.entity.y < this.h / 2 ||
        this.entity.y > this.maxY + this.h / 2) {
        this.entity.screenY = this.entity.y - this.y;
    }
  }

  drawMap(x,y) {
    var startCol = Math.floor(this.x / tilesize)
    var endCol = startCol + (this.w / tilesize)
    var startRow = Math.floor(this.y / tilesize)
    var endRow = startRow + (this.h / tilesize)

    //var offsetX = -this.entity.x + startCol * tilesize
    //var offsetY = -this.entity.y + startRow * tilesize

    for (var c = startCol; c <= endCol; c++) {
      for (var r = startRow; r <= endRow; r++) {
        var tile = map.arr[c][r]
        var x = (c - startCol) * tilesize //+ offsetX
        var y = (r - startRow) * tilesize //+ offsetY

        //document.getElementById("pos").innerText = this.x + ", " + this.y

        tile.screenX = Math.round(x)
        tile.screenY = Math.round(y)
        tile.sprite.draw(Math.round(x),Math.round(y))
        l_map.arr[c][r].drawMask(Math.round(x),Math.round(y))

        // mark boundaries (Not needed. Keep commented out.)
        /*if (c == map.w-1 || c == 0 || r == map.h-1 || r == 0) {
          ctx.fillStyle = "red"
          ctx.fillRect(x,y,tilesize,tilesize)
        }*/
      }
    }
  }
}

class Player {
  constructor(x,y) {
    this.x = x
    this.y = y
    this.screenX = 0
    this.screenY = 0
    this.w = tilesize
    this.h = tilesize
    this.speed = 7

    this.rect = new BoundingRect(x, y, this.w, this.h)
    this.sprite = new Sprite(playerSprite, this.x, this.y, this.rect.w, this.rect.h, 0)

      // triggers when the player has moved
      // 'delegate' pattern
  }

  collision(x,y) {
    // Check a "ring" of tiles around the player and see if the player is within their bounding box
    for (var k = 0; k < map.h; k++){
      for (var l = 0; l < map.w; l++){
          if (l >= 0 && k >= 0 && map.arr[l][k] instanceof Wall) {
            let tile = map.arr[l][k]
            if (x < tile.screenX + tile.rect.w &&
               x + this.w > tile.screenX &&
               y < tile.screenY + tile.rect.h &&
               y + this.h > tile.screenY) {
                 return true
            }
          }
        }
      }
      return false
    }

  moveUpdate() {
    if (rightPressed && !this.collision(this.x + this.speed, this.y)) {
        this.x += this.speed;
    }
    else if (leftPressed && !this.collision(this.x - this.speed, this.y)) {
        this.x -= this.speed;
    } else if (downPressed && !this.collision(this.x, this.y + this.speed)) {
        this.y += this.speed;
    }
    else if (upPressed && !this.collision(this.x, this.y - this.speed)) {
        this.y -= this.speed;
    }

    var maxX = map.w * tilesize;
    var maxY = map.h * tilesize;
    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
  }

  drawPlayer() {
    this.sprite.draw(this.screenX, this.screenY)
  }
}



let player = new Player(1000,1000) // this doesn't work with floating points for some reason
let camera = new Camera(player)

//player.collision()

function render() {
  camera.follow()
  camera.drawMap()
  player.drawPlayer()
}
