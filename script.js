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
  game.camera.drawMap()
  game.player.moveUpdate()
  game.camera.follow()
  game.player.draw()
}.bind(Game)


game.tick = function(elapsed) {
  window.requestAnimationFrame(game.tick);

    // clear previous frame
    ctx.clearRect(0, 0, 512, 512);

    // compute delta time in seconds -- also cap it
    var delta = (elapsed - this._previousElapsed) / 1000.0;
    delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    this._previousElapsed = elapsed;

    game.update();
    //this.render();
}.bind(Game)

window.onload = game.tick()
