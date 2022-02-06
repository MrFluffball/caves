class Game {
  constructor() {

  }
}

let game = new Game()

game.draw = function() {
  ctx.clearRect(0,0,canvas.height,canvas.width)

  drawMap()
  player.update()

  window.requestAnimationFrame(game.draw)
}

window.onload = game.draw()
