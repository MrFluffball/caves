class Player {
  constructor(x,y) {
    this.x = x
    this.y = y
    this.w = 50
    this.h = 50
    // In pixels
    this.visionwidth = 512
    this.visionheight = 512
  }
  draw() {
    ctx.fillStyle = "red"
    ctx.fillRect(this.x,this.y,this.w,this.h)
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

  console.log(startCol, endCol)

  for (var c = startCol; c <= endCol; c++) {
    for (var r = startRow; r <= endRow; r++) {
      var tile = map.arr[c][r]
      var x = (c - startCol) * tilesize + offsetX
      var y = (r - startRow) * tilesize + offsetY

      console.log(x,y)

      tile.sprite.draw(Math.round(x),Math.round(y))
    }
  }
}

drawMap()

function down() {
  player.x -= 1
  drawMap()
}
