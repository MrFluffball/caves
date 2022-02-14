class Game {
  constructor() {

  }
}

let fps = 60

let game = new Game()


game.draw = function() {
  ctx.clearRect(0,0,canvas.height,canvas.width)

  player.moveUpdate()
  render()

  window.requestAnimationFrame(game.draw)
}

window.onload = game.draw()
