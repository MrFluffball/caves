class Game {
  constructor(player, camera) {
    this.player = new Player(500,500)
    this.camera = new Camera(this.player)
    this._previousElapsed = 0
  }
}

let fps = 60

let game = new Game()

let pointer = { x:0, y:0 }

canvas.addEventListener("click", (event) => {
  pointer.x = event.pageX + game.camera.x - width + game.camera.w
  pointer.y = event.pageY + game.camera.y - height + game.camera.h
})

game.update = function() {
  game.camera.drawMap()
  game.player.moveTo(pointer.x,pointer.y)
}.bind(Game)


game.tick = function(elapsed) {
  window.requestAnimationFrame(game.tick);

    //game.camera.x += 10

    // clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);



    game.update();
    //this.render();
}.bind(Game)

window.onload = game.tick()
