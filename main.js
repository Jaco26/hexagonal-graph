import Canvas from './models/canvas.js'
import Board from './models/board.js';



let BOARD_WIDTH = window.innerWidth
let BOARD_HEIGHT = window.innerHeight


const canvas = new Canvas()
const board = new Board()

canvas.on('click', onCanvasClick)

const state = {
  selectedCell: null
}

function drawGridOnCanvas() {
  board.grid.cells.forEach((cell, i) => {
    canvas.arc({ ...cell.dimensions })
    canvas.text({ ...cell.dimensions, fillStyle: 'black', text: i })
  })
}

function onResize() {
  let width = 750
  let height = 750
  if (window.innerWidth < 700 || window.innerHeight < 700) {
    width = 600
    height = 600
  }

  BOARD_WIDTH = width
  BOARD_HEIGHT = height
  canvas.resize(BOARD_WIDTH, BOARD_HEIGHT)
  board.resize(BOARD_WIDTH, BOARD_HEIGHT)

  drawGridOnCanvas()

}

function onCanvasClick(e) {

  const clicked = board.getCellByCoords(e.offsetX, e.offsetY)
  state.selectedCell = state.selectedCell !== clicked
    ? clicked
    : null

  console.log(state.selectedCell)
  canvas._fillSelf()
  drawGridOnCanvas()
  if (state.selectedCell) {
    canvas.arc({ ...state.selectedCell.dimensions, fillStyle: 'purple' })
    canvas.text({ ...state.selectedCell.dimensions, text: state.selectedCell.id })
  }
 

}

function setup() {
  
  onResize()
}

setup()


window.canvas = canvas
window.board = board
window.onresize = onResize
