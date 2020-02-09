import Canvas from './models/canvas.js'
import Board from './models/board/index.js'

import './models/canvas/canvas-ui-element.js'

const canvas = new Canvas()
const board = new Board()


const app = new Vue({
  template: `
  <div style="position: absolute; height: 100%; width: 100%; display: flex; align-items:center; justify-content: center">
    <canvas ref="canvas" @click="onCanvasClick" v-on="lockSelected ? {} : { mousemove: onCanvasMousemove }"></canvas>
  </div>`,
  data() {
    return {
      lockSelected: false,
      selectedCell: null,
      hoveredCell: null,
      boardWidth: 950,
      boardHeight: 750,
    } 
  },
  mounted() {
    canvas.init(this.$refs.canvas)
    canvas.resize(this.boardWidth, this.boardHeight)
    board.resize(this.boardWidth, this.boardHeight)
    this.drawBoard()
  },
  methods: {
    drawBoard() {
      canvas._fillSelf()
      board.grid.cells.forEach((cell, i) => {
        canvas.arc({ ...cell.dimensions })
        // canvas.text({ ...cell.dimensions, fillStyle: 'black', text: i })
      })
    },
    onCanvasClick(e) {
      const clicked = board.getCellByCoords(e.offsetX, e.offsetY)
      if (!this.lockSelected) {
        this.selectedCell = clicked
      } else {
        this.selectedCell = null
        this.hoveredCell = clicked
      }
      if (clicked || this.lockSelected) {
        this.lockSelected = !this.lockSelected
      }
    },
    onCanvasMousemove(e) {
      if (!this.lockSelected) {
        this.hoveredCell = board.getCellByCoords(e.offsetX, e.offsetY)
      }
    }
  },
  watch: {
    selectedCell(newVal, oldVal) {
      if (newVal) {
        this.drawBoard()
        canvas.arc({ ...this.selectedCell.dimensions, fillStyle: 'purple' })
        // canvas.text({ ...this.selectedCell.dimensions, text: this.selectedCell.id })

        const nbrIds = board.adjacencyList.data[this.selectedCell.id]
        Object.keys(nbrIds).forEach(direction => {
          const nbr = board.grid.cells[nbrIds[direction]]
          canvas.arc({ ...nbr.dimensions, fillStyle: 'lightblue' })
          // canvas.text({ ...nbr.dimensions, fillStyle: 'black', text: nbr.id })
        })
      } 
    },
    hoveredCell(newVal, oldVal) {
      if (newVal) {
        this.drawBoard()
        canvas.arc({ ...newVal.dimensions, fillStyle: '#a5a' })
        // canvas.text({ ...newVal.dimensions, text: newVal.id })

        const nbrIds = board.adjacencyList.data[newVal.id]
        Object.keys(nbrIds).forEach(direction => {
          const nbr = board.grid.cells[nbrIds[direction]]
          canvas.arc({ ...nbr.dimensions, fillStyle: '#44a5' })
          // canvas.text({ ...nbr.dimensions, fillStyle: 'black', text: nbr.id })
        })
      } else if (!newVal && oldVal) {
        this.drawBoard()
      }
    }
  }
})

app.$mount('#app')


window.canvas = canvas
window.board = board

