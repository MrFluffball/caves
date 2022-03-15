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
    // lock the player
    let gridwidth = Math.floor((this.w/tilesize)/2)
    let gridheight = Math.floor((this.h/tilesize)/2)
    this.entity.screenX = (gridwidth*tilesize)
    this.entity.screenY = (gridheight*tilesize)

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

    this.old_x = this.yx
    this.old_y = this.y

    this.rect = new BoundingRect(x, y, this.w, this.h)
    this.sprite = new Sprite(playerSprite, this.x, this.y, this.rect.w, this.rect.h, 0)

    // triggers when the player has moved
    // 'delegate' pattern
  }

  get bottom() { return this.y + this.h }


  /*isCollide(b) {
    return !(
        ((this.y + this.h) < (b.y)) ||
        (this.y > (b.y + b.h)) ||
        ((this.x + this.w) < b.x) ||
        (this.x > (b.x + b.w))
    );
  }*/

  collisionWith(x,y,b) {
    if (b.solid) {
      if ((b.x < x + this.w) && (b.x + b.w > x) &&
          (b.y < y + this.h) && (b.y + b.h > y)) {
           return true
      }
    }
    return false
  }

  // I feel like we should rely on pixel-perfect collisions instead of grids
  collision(dx,dy) {
    let newX = this.x + dx
    let newY = this.y + dy

    let tile = map.getTile(newX, newY)

    console.log(map.getTile(newX-tilesize, newY).solid)

    return (
      this.collisionWith(newX, newY, map.getTile(newX-tilesize, newY)) ||
      this.collisionWith(newX, newY, map.getTile(newX+tilesize, newY)) ||
      this.collisionWith(newX, newY, map.getTile(newX, newY-tilesize)) ||
      this.collisionWith(newX, newY, map.getTile(newX, newY+tilesize))
    )
    //document.getElementById("pos").innerText = Math.floor((this.x+dx)/tilesize) + ", " + Math.floor((this.y+dy)/tilesize) + "\ntoptile: " + (Math.floor((this.x+dx)/tilesize)) + ", " + (Math.floor((this.y+dy)/tilesize)-1)
  }

  moveUpdate(delta) {
    if (rightPressed) {
      if (!this.collision(this.speed, 0)) {
        this.x += this.speed;
      }
    } else if (leftPressed) {
      if (!this.collision(-this.speed, 0)) {
        this.x -= this.speed;
      }
    } else if (downPressed) {
      if (!this.collision(0, this.speed)) {
        this.y += this.speed;
      }
    } else if (upPressed) {
      if (!this.collision(0, -this.speed)) {
        this.y -= this.speed;
      }
    }

    var maxX = map.w * tilesize;
    var maxY = map.h * tilesize;
    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
  }

  draw() {
    this.sprite.draw(this.screenX, this.screenY)
  }
}



let player = new Player(500,500) // this doesn't work with floating points for some reason
let camera = new Camera(player)

//player.collision()
