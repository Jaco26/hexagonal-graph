import Canvas from './models/canvas.js'
import Board from './models/board.js';
import makeGrid from './models/board-cell.js'


let BOARD_WIDTH = window.innerWidth
let BOARD_HEIGHT = window.innerHeight


const canvas = new Canvas()
const board = new Board()

const grid = makeGrid()

console.log(grid)



function setup() {
  onResize()

  
}


setup()


window.canvas = canvas
window.board = board
window.onresize = onResize


function onResize() {
  let width = 700
  let height = 700
  if (window.innerWidth < 700 || window.innerHeight < 700) {
    width = 600
    height = 600
  }

  BOARD_WIDTH = width
  BOARD_HEIGHT = height
  canvas.resize(BOARD_WIDTH, BOARD_HEIGHT)
  board.resize(BOARD_WIDTH, BOARD_HEIGHT)

  let id = 1
  grid.cells.forEach((layer, l) => {
    layer.forEach((cell, c, cells) => {
      // canvas.text({ ...cell, fillStyle: 'black', text: id })
      canvas.arc({ ...cell })
      id += 1
    })
  })
}

