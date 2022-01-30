let initialchance = 0.45
let numberofsteps = 8

let aliveLimit = 4
let deathLimit = 4


// NOTE: In this code, a Floor is considered "dead", while likewise a wall tile is "alive"
/*
First, the map is filled in randomly with walls and air, then for each wall or air,
you check how many of its neighbours are walls. If the current tile is a wall,
and there are at least 4 other walls around it,
then it stays the same, otherwise it turns into air. If it's air and has at least 5 wall neighbours,
then it becomes a wall, otherwise it stays air.*/

function isOnBorder(x, y, map) {
  return (x == 0 || y == 0 || x == map.w-1 || y == map.h-1)
}

function isWall(x,y,map) {
  return map.arr[x][y] instanceof Wall
}
function isFloor(x,y,map) {
  return !isWall(x,y,map)
}
function setWall(x,y,map) {
  map[x][y] = new Wall(tilesize*x,tilesize*y)
}
function setFloor(x,y,map) {
  map[x][y] = new Floor(tilesize*x,tilesize*y)
}

function generateNoiseMap(w, h, chanceOfWall) {
  var arr = [[]]
  for (var i=0; i<h; i++) {
    for (var j=0; j<w; j++) {
      if (Math.random() < chanceOfWall) {
        arr[i].push(new Wall(tilesize*j,tilesize*i))
      } else {
        arr[i].push(new Floor(tilesize*j,tilesize*i))
      }
    }
    arr.push([])
  }
  return arr
}

let coordinates = [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]]

class Map {
  constructor(w,h) {
    this.w = w
    this.h = h
    this.arr = generateNoiseMap(this.w, this.h, initialchance)
  }

  drawMap() {
    this.arr.forEach(i => {
      i.forEach(j => {
        j.sprite.draw()
      })
    })
  }
}


function outOfBounds(x,y,map) { // returns if the position is within the map
  if ((x > map.w || y > map.h) || (x < 0 || y < 0)) {
    return true
  }
  return false
}
function countAliveNeighbours(x, y, map) { // returns the number of alive cells around a location
  var count = 0
  coordinates.forEach((position, i) => {
    let newX = x + position[0]
    let newY = y + position[1]

    if (!outOfBounds(newX, newY, map)) {
      let mapobject = map.arr[newY][newX]
      if (mapobject instanceof Wall) {
        count += 1
      }
    }
  })
  return count
}

function doSimulationStep(map) {
  // Make a new map (a cloned version of the current one) to copy the new cells onto
  var newMap = map.arr

  for (var x=0; x<map.h; x++) {
    for (var y=0; y<map.w; y++) {
      let neighbours = countAliveNeighbours(x,y,map)

      if (isWall(x,y,map)) {
        // If a wall has less than 4 wall neighbors, then it becomes a floor
        if (neighbours < 4) {
          setFloor(x,y,newMap)
        } else { // otherwise it stays a wall
          setWall(x,y,newMap)
        }
      } else {
        // If a floor has 5 or more wall neighbors, then it becomes a wall.
        if (neighbours >= 5) {
          setWall(x,y,newMap)
        } else { // otherwise it stays a floor
          setFloor(x,y,newMap)
        }
      }

      if (isOnBorder(x,y,map)) {
        setWall(x,y,newMap)
      }
    }
  }
  return newMap
}


var map = new Map(30,30)
for (var i = 0; i < numberofsteps; i++) {
  map.arr = doSimulationStep(map)
}

map.drawMap()
/*
*/
