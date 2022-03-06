// Sets tile brightness for every tile on a map. For each wall tile, it will raycast in
// all ordinal and cardinal directions looking for a floor tile. Until it finds it,
// it counts the number of walls traversed. When each direction has been checked
// the brightness is then calculated using the lowest value from the raycasting
// with the equation (alpha = walls * 0.01).

class Mask {
  constructor(alpha) {
    this.alpha = alpha
  }
  drawMask(x,y) {
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = "black"
    ctx.fillRect(x,y,tilesize,tilesize)
    // make sure to reset
    ctx.globalAlpha = 1.00
  }
}

class LightingMap {
  constructor(map) {
    this.map = map
    this.arr = [[]]

    for (var i=0; i<this.map.w; i++) {
      for (var j=0; j<this.map.h; j++) {
        this.arr[i].push(new Mask(0))
      }
      this.arr.push([])
    }
  }

  setTileBrightness() {
    for (var x = 0; x < this.map.w-1; x++) {
      for (var y = 0; y < this.map.h-1; y++) {
        if (map.arr[x][y] instanceof Wall) {
          var totalWallCounts = []
          coordinates.forEach((dir, i) => {
            var walls = 0

            var raycast = true
            var found_floor = false

            var newX = x
            var newY = y

            while (raycast) {
              newX += dir[0]
              newY += dir[1]

              if (outOfBounds(newX,newY,this.map)) {
                raycast = false
              } else {
                if (this.map.arr[newX][newY] instanceof Wall) {
                  walls += 1
                } else if (this.map.arr[newX][newY] instanceof Floor) {
                  //console.log(walls)
                  found_floor = true
                  raycast = false
                }
              }
            }
            if (found_floor) {
              totalWallCounts.push(walls)
            }
          })
          this.arr[x][y].alpha = (Math.min.apply(null, totalWallCounts))*0.15
        }
      }
    }
  }

  /*lights() {
    for (var row = 1; row < this.map.w; row++) {
      for (var col = 0; col <= row; col++) {
        var x = player.x + col;
        var y = player.y - row;
        console.log(x,y)
        this.arr[x][y].alpha = 0.20
      }
    }
  }*/
}
