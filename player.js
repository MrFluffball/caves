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
    this.w = 500
    this.h = 500
    this.x = 0
    this.y = 0

    this.maxX = map.w * tilesize - this.w;
    this.maxY = map.h * tilesize - this.h;

    //console.log(Math.max(0, Math.min(this.x, this.maxX)), Math.max(0, Math.min(this.y, this.maxY)))
  }

  // draws the player in the map
  follow() {
    /*// lock the player
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
    }*/
  }

  scrollTo(x,y) {
    this.x = x //- this.w * 0.5
    this.y = y //- this.h * 0.5
    //console.log(this.x,this.y)
  }

  // TODO: ok i see the importance of putting stuff in the middle. lets do that
  drawMap() {
    // this bit scrolls to player pos
    this.scrollTo(this.entity.x, this.entity.y)

    var x_min = Math.floor(this.x / tilesize)
    var y_min = Math.floor(this.y / tilesize)
    var x_max = Math.ceil((this.x + this.w) / tilesize)
    var y_max = Math.ceil((this.y + this.h) / tilesize)

    for (let x = x_min; x < x_max; x ++) {
      for (let y = y_min; y < y_max; y ++) {
        let tile_x = Math.floor(x * tilesize - this.x)
        let tile_y = Math.floor(y * tilesize - this.y)

        if (!outOfBounds(x,y,map)) {
          map.arr[x][y].sprite.draw(tile_x, tile_y)
        }
      }
    }

    this.entity.sprite.draw(this.w/2, this.h/2)

    ctx.strokeStyle = "#ffffff"
    ctx.strokeRect(0, 0, this.w, this.h)
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
    this.easement = 0.05

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

    //document.getElementById("pos").innerText = Math.floor((this.x+dx)/tilesize) + ", " + Math.floor((this.y+dy)/tilesize) + "\ntoptile: " + (Math.floor((this.x+dx)/tilesize)) + ", " + (Math.floor((this.y+dy)/tilesize)-1)
  }

  moveTo(x,y) {
    this.x += (x - this.x - tilesize) * this.easement
    this.y += (y - this.y - tilesize) * this.easement
  }
}



let player = new Player(500,500) // this doesn't work with floating points for some reason
let camera = new Camera(player)

//player.collision()
