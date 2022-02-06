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


class Player {
  constructor(x,y) {
    this.x = x
    this.y = y
    this.w = 50
    this.h = 50
    this.speed = 5
    // In pixels
    this.visionwidth = 512
    this.visionheight = 512

    this.maxX = map.w * tilesize - this.visionwidth;
    this.maxY = map.h * tilesize - this.visionheight;

    console.log(this.maxX,this.maxY)
  }
  update() {
    if (rightPressed) {
        this.x += this.speed;
    }
    else if (leftPressed) {
        this.x -= this.speed;
    } else if (downPressed) {
        this.y += this.speed;
    }
    else if (upPressed) {
        this.y -= this.speed;
    }

    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));

    ctx.strokeStyle = "red"
    ctx.strokeRect(this.visionwidth/2,this.visionheight/2,this.w,this.h)
  }
}


let player = new Player(0,0) // this doesn't work with floating points for some reason


// This is my weird buggy version of topdown scrolling
function drawMap() {
  var startCol = Math.floor(player.x / tilesize)
  var endCol = startCol + (player.visionwidth / tilesize)
  var startRow = Math.floor(player.y / tilesize)
  var endRow = startRow + (player.visionheight / tilesize)

  var offsetX = -player.x + startCol * tilesize
  var offsetY = -player.y + startRow * tilesize

  for (var c = startCol; c <= endCol; c++) {
    for (var r = startRow; r <= endRow; r++) {
      var tile = map.arr[c][r]
      var x = (c - startCol) * tilesize + offsetX
      var y = (r - startRow) * tilesize + offsetY

      tile.sprite.draw(Math.round(x),Math.round(y))
    }
  }
}

function down() {
  player.x -= 1
  drawMap()
}
