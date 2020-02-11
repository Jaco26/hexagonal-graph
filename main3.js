import Board from './models/board/index.js'

const board = new Board()

const HexagonGrid = {
  name: 'HexagonGrid',
  props: {
    boardHeight: Number,
    boardWidth: Number,
  },
  render(h) {
    if (!board.grid) {
      board.resize(this.boardWidth, this.boardHeight)
    }
    return h('div', board.grid.cells.map(cell => {
      return h('div',
        {
          class: 'board-cells__cell',
          style: {
            position: 'absolute',
            top: cell.dimensions.y + 'px',
            left: cell.dimensions.x + 'px',
            width: cell.dimensions.r * 2 + 'px',
            height: cell.dimensions.r * 2 + 'px',
            borderRadius: '50% 50%',
          }
        }
      )})
    )
  }
}


const app = new Vue({
  name: 'Board',
  el: '#board',
  components: {
    HexagonGrid,
  },
  data: {
    boardWidth: 950,
    boardHeight: 750,
  },
  template: `
    <div class="board">
      <div class="board-cells">
        <HexagonGrid :boardWidth="boardWidth" :boardHeight="boardHeight" />
      </div>
    </div>
  `,

})