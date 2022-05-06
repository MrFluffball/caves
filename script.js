class Game {
  constructor(player, camera) {
    this.player = new Player(500,500)
    this.camera = new Camera(this.player)
    this._previousElapsed = 0
  }
}

let fps = 60

let game = new Game()

game.update = function() {
  updateAnimationCounter()
  game.camera.drawMap()
  game.player.update()
}.bind(Game)

game.tick = function(elapsed) {
  window.requestAnimationFrame(game.tick);

    //game.camera.x += 10

    // clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //ctx.fillRect(line.x1 + (line.x2 - line.x1) * line.f,line.y1 + (line.y2 - line.y1) * line.f,10,10)

    game.update();
    //this.render();
}.bind(Game)

window.onload = game.tick()
