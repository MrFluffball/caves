function setTileBrightness(map) {
  /*coordinates.forEach((dir, i) => {
    var newX = 0
    var newY = 0
    while (!outOfBounds(newX,newY,map) && raycast) {
      newX += dir[0]
      newY += dir[1]
      console.log("Direction: " + dir + ": " + newX + ", " + newY)
    }
    console.log(dir)
  })*/
  for (var x = 0; x < map.w; x++) {
    for (var y = 0; y < map.h; y++) {
      if (map.arr[x][y] instanceof Wall) {
        var totalWallCounts = []
        coordinates.forEach((dir, i) => {
          var walls = 0

          var raycast = true

          var newX = 0
          var newY = 0

          while (raycast) {
            newX += dir[0]
            newY += dir[1]

            if (!outOfBounds(newX,newY,map)) {
              // if this is a floor, we found the end point and should now stop raycasting
              if (map.arr[newX][newY] instanceof Floor) {
                raycast = false
              } else if (map.arr[newX][newY] instanceof Wall) {
                // otherwise, count it as another wall in between the tile and the closest floor
                walls += 1
              }
            } else {
              raycast = false
            }
          }
          totalWallCounts.push(walls)
        })
        map.arr[x][y].alpha = (Math.min.apply(null, totalWallCounts)/100)
      }
    }
  }
}
