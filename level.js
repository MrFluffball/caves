let initialchance = 0.50
let numberofsteps = 12

// NOTE: In this code, a Floor is considered "dead", while likewise a wall tile is "alive"


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

function generateNoiseMap(width, height, chanceOfWall) {
  var arr = [[]]
  for (var i=0; i<width; i++) {
    for (var j=0; j<height; j++) {
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

class Layer {
  constructor(w,h) {
    this.w = w
    this.h = h
    this.arr = [[]]

    for (var i=0; i<this.w; i++) {
      for (var j=0; j<this.h; j++) {
        this.arr[i].push(new Mask(0))
      }
      this.arr.push([])
    }
  }

  drawMap() {
    this.arr.forEach(i => {
      i.forEach(j => {
        j.sprite.draw(j*tilesize,i*tilesize)
      })
    })
  }

  getTile(x,y) {
    return this.arr[x][y]
  }
}
// Layers of the visible map
class Map extends Layer {
  constructor(w,h) {
    super(Layer)
    this.w = w
    this.h = h
    this.arr = generateNoiseMap(this.w, this.h, initialchance)
  }
}
class Objects extends Layer {
  constructor(w,h) {
    super(Layer)
    this.w = w
    this.h = h
    this.arr = generateNoiseMap(this.w, this.h, initialchance)
  }
}

let coordinates = [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]]


function outOfBounds(x,y,map) { // returns if the position is within the map
  if ((x > map.w || y > map.h) || (x < 0 || y < 0)) {
    return true
  }
  return false
}
function countNeighbours(x, y, map, type) { // returns the number of a type of cells around a location
  var count = 0
  coordinates.forEach((position, i) => {
    let newX = x + position[0]
    let newY = y + position[1]

    if (!outOfBounds(newX, newY, map)) {
      let mapobject = map.arr[newY][newX]
      if (mapobject instanceof type) {
        count += 1
      }
    }
  })
  return count
}

function doSimulationStep(map) {
  // numWallNeighbors is an array storing the amount of walls around each point in the map.
  // numWallNeighbors[x][y] is the number of walls in the current location
  var numWallNeighbors = [[]]
  for (var x = 0; x < map.w; x++) {
			for (var y = 0; y < map.h; y++) {
				numWallNeighbors[x].push(countNeighbours(x,y,map,Wall)) // count walls
			}
    numWallNeighbors.push([])
	}
  // now apply the rules to each cell
  for (var x = 0; x < map.w; x++) {
		  for (var y = 0; y < map.h; y++) {
        let neighbours = numWallNeighbors[x][y] // how many neighbours this cell has

        if (isWall(x,y,map)) {
          if (neighbours < 4) {
            setFloor(x,y,map.arr)
          } else {
            setWall(x,y,map.arr)
          }
        } else {
          if (neighbours >= 5) {
            setWall(x,y,map.arr)
          } else {
            setFloor(x,y,map.arr)
          }
        }
        /*if (neighbours >= 5) {
          setWall(x,y,map.arr)
        } else {
          setFloor(x,y,map.arr)
        }*/
        // If this cell is on the border set it to a wall
        if (isOnBorder(x,y,map)) {
          setWall(x,y,map.arr)
        }
    }
  }
}

var map = new Map(100,100)
var objects_map = new Objects(100,100)

for (var i = 0; i < numberofsteps; i++) {
  doSimulationStep(map)
}

let l_map = new LightingMap(map)
l_map.setTileBrightness(map)
//l_map.lights()

/*
*/
