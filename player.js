class ProgressBar {
  constructor(x,y,w,h,border) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.border = border
  }
  draw(progress) {
    // base
    ctx.fillStyle = "black"
    ctx.fillRect(this.x, this.y, this.w, this.h)
    // draw the colored bit, slightly inset from the black base
    ctx.fillStyle = "green"
    // ignore the horrid math going on here
    ctx.fillRect(this.x+this.border, this.y+this.border, (this.w*progress)-this.border*2, this.h-this.border*2)
    // draw our little slime icon
    let icon = new TileSprite(this.x, this.y, tilesize, tilesize, 1,1)
    icon.draw(this.x-this.w/2-10, this.y-tilesize/2)
  }
}

var speedBar = new ProgressBar(0,0,100,8,2)


//let pointer = { x:0, y:0 }
var holdStart = 0
var holdingClick = false

canvas.addEventListener("mousedown", (event) => {
  holdStart = Date.now()
  holdingClick = true
})

canvas.addEventListener("mouseup", (event) => {
  // The mouse pos - the player pos gives a vector
	// that points from the player toward the mouse
	var x = event.clientX - player.x;
	var y = event.clientY - player.y;

	// Using pythagoras' theorm to find the distance (the length of the vector)
	var l = Math.sqrt(x * x + y * y);

	// Dividing by the distance gives a normalized vector whose length is 1
	x = x / l;
	y = y / l;

  // set the player velocity to this value
  game.player.vx = x
  game.player.vy = y

  holdingClick = false

  // change player speed based on click time if it hasn't yet reached the cap
  let holdTime = Date.now() - holdStart
  if (holdTime <= game.player.maxHold) {
    game.player.speed = holdTime
  }
})

canvas.addEventListener("mousemove", (event) => {
  // moves around the trajectory line
  var dx = event.clientX - game.player.x;
  var dy = event.clientY - game.player.y;
  game.player.angle = Math.atan2(dy, dx);
})

/*
canvas.addEventListener("click", (event) => {
  // why did I make these again?
  //pointer.x = event.clientX + game.camera.x - width * 0.5 + game.camera.w * 0.5
  //pointer.y = event.clientY + game.camera.y - height * 0.5 + game.camera.h * 0.5
})
*/


/*function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // you can't collide with non-solid tiles
    if (!map.arr[Math.floor(x2 / tilesize)][Math.floor(y2 / tilesize)].solid) { return false }
    //console.log(Math.floor(x2/tilesize), Math.floor(y2/tilesize))
    //console.log(map.arr[Math.floor(x2 / tilesize)][Math.floor(y2 / tilesize)].solid)

    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
      //console.log("oof")
        return true;
    }
    //console.log("oof")
    return false;
}*/

function collision(a,b,dx,dy) {
  // we can't run into objects that aren't solid
  if (!b.solid) { return false }

  return !(
    (a.y + dy + a.h) < (b.y) ||
    (a.y + dy > (b.y + b.h)) ||
    ((a.x + dx + a.w) < b.x) ||
    (a.x + dx > (b.x + b.w))
  )
}


class Camera {
  constructor(entity) {
    this.entity = entity
    this.w = 600
    this.h = 600
    this.x = 0
    this.y = 0

    this.maxX = map.w * tilesize - this.w;
    this.maxY = map.h * tilesize - this.h;

    //console.log(Math.max(0, Math.min(this.x, this.maxX)), Math.max(0, Math.min(this.y, this.maxY)))
  }

  scrollTo(x,y) {
    this.x = x - this.w * 0.5
    this.y = y - this.h * 0.5
    //console.log(this.x,this.y)
  }

  drawMap() {
    this.scrollTo(this.entity.x, this.entity.y)

    var x_min = Math.floor(this.x / tilesize)
    var y_min = Math.floor(this.y / tilesize)
    var x_max = Math.ceil((this.x + this.w) / tilesize)
    var y_max = Math.ceil((this.y + this.h) / tilesize)

    for (let x = x_min; x < x_max; x ++) {
      for (let y = y_min; y < y_max; y ++) {
        let tile_x = Math.floor(x * tilesize - this.x + width * 0.5 - this.w * 0.5)
        let tile_y = Math.floor(y * tilesize - this.y + height * 0.5 - this.h * 0.5)

        if (!outOfBounds(x,y,map)) {
          map.arr[x][y].sprite.draw(tile_x, tile_y)
        }
      }
    }

    this.entity.draw(this.w,this.h)

    ctx.strokeStyle = "#ffffff"
    ctx.strokeRect(width * 0.5 - this.w * 0.5, height * 0.5 - this.h * 0.5, this.w, this.h)
  }
}

class Player {
  constructor(x,y) {
    this.x = x
    this.y = y
    this.vx = 0
    this.vy = 0
    this.angle = 0

    this.screenX = 0
    this.screenY = 0

    this.pinchX = 0
    this.pinchY = 0

    this.speed = 0
    this.maxHold = 1500

    this.rect = new BoundingRect(x, y, tilesize, tilesize)
    this.sprite = new TileSprite(this.x, this.y, this.rect.w, this.rect.h, 0,1)
  }

  get bottom() { return this.y + this.h }


  /*isCollide(x,y,b) {
    if (!map.arr[Math.floor(b.x / tilesize)][Math.floor(b.y / tilesize)].solid) { return false }

    return (
        ((y + this.h) < (b.y)) ||
        (y > (b.y + b.h)) ||
        ((x + this.w) < b.x) ||
        (x > (b.x + b.w))
    );
  }*/

  update(cameraWidth, cameraHeight) {
    /*
    let grid_x = Math.floor(this.x/tilesize)
    let grid_y = Math.floor(this.y/tilesize)

    for (var x = grid_x-1; x < grid_x+2; x++) {
      for (var y = grid_y-1; y < grid_y+2; y++) {
        document.getElementById('pos').innerText = x + ", " + y

        // check for a collision for the next position of each axis
        // if it passes, the value will be added because that new position isn't intersecting anything
        if (collision(this, map.arr[grid_x][grid_y], this.vx, this.vy)) {

        } else {
          this.x += this.vx
          this.y += this.vy
        }
      }
    }

    console.log(map.arr[10][5].x, map.arr[10][5].y)
    console.log(this.x,this.y)
    console.log(this.collisionWith(this.x-10,this.y,map.arr[10][10]))*/


    // Get the bullet to travel towards the mouse pos
    this.x += this.vx * this.speed/30
    this.y += this.vy * this.speed/30


    this.vx *= 0.985
    this.vy *= 0.985

    // remove velocity when it gets close enough to 0
    if (Math.abs(this.vx) < 0.1) { this.vx = 0}
    if (Math.abs(this.vy) < 0.1) { this.vy = 0}
  }

  draw(cameraWidth, cameraHeight) {
    let draw_x = Math.round(this.x - game.camera.x + width * 0.5 - game.camera.w * 0.5)
    let draw_y = Math.round(this.y - game.camera.y + height * 0.5 - game.camera.h * 0.5)
    this.sprite.draw(draw_x, draw_y)

    if (holdingClick) {
      speedBar.x = draw_x
      speedBar.y = draw_y - 100
      speedBar.draw((this.maxHold/this.speed)/100)
      console.log(this.maxHold/this.speed)
    }

    ctx.fillStyle = "white"
    // save the unrotated context of the canvas so we can restore it later
    ctx.save();
    // move to the specified position
    ctx.translate(draw_x,draw_x);
    ctx.rotate(this.angle*Math.PI); // rotate and draw

    ctx.fillRect(-50/2,-2/2, 50, 2);
    ctx.restore()

    ctx.strokeStyle = "black"
    ctx.beginPath();
    ctx.moveTo(draw_x + this.w, draw_y + this.h);
    ctx.lineTo(draw_x + this.w + (this.vx)*20, draw_y + this.h + (this.vy)*20);
    ctx.stroke();
  }
}



let player = new Player(500,500) // this doesn't work with floating points for some reason
let camera = new Camera(player)

//player.collision()
