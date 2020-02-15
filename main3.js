
import { valueType, trig } from './utils.js'
import { makeHexagonalGrid } from './models/board/grid.js'
import Graph from './models/board/graph.js'

/**
 * @typedef CellDimensions
 * @property {number} x
 * @property {number} y
 * @property {number} r
 */

/**
 * @typedef Cell
 * @property {number} id
 * @property {CellDimensions} dimensions
 */


// adjacency list helpers
const calculateNeighborCoords = ({ x, y, r }, angle) => ({
  x: Math.round(x + trig.cos(angle) * (r * 2)),
  y: Math.round(y + trig.sin(angle) * (r * 2)),
})



const HexagonGrid = {
  name: 'HexagonGrid',
  props: {
    boardHeight: Number,
    boardWidth: Number,
  },
  data() {
    return {
      selectedCellId: null
    }
  },
  methods: {
    getCellByExactCoords(x, y) {
      return this.hexagonalGrid.find(cell => cell.dimensions.x === x && cell.dimensions.y === y)
    },
  },
  computed: {
    /** @type {Cell[]} */
    hexagonalGrid() {
      return makeHexagonalGrid(4, 0, [], { x: this.boardWidth / 2, y: this.boardHeight / 2 })
    },
    adjacencyList() {
      const graph = new Graph()

      this.hexagonalGrid.forEach(cell => graph.addVertex(cell.id))

      this.hexagonalGrid.forEach(cell => {

        const { id, dimensions } = cell

        let angle = 0

        for (let i = 0; i < 6; i++) {

          const nbrCoords = calculateNeighborCoords(dimensions, angle)

          const nbr = this.getCellByExactCoords(nbrCoords.x, nbrCoords.y)

          if (nbr) {

            graph.addEdge(id, nbr.id, angle)

          }

          angle += 60

        }
      })

      return graph.data
    },
    selectedCellNeighborIds() {
      return Object.values(this.adjacencyList[this.selectedCellId] || {}) || []
    },
    displayHexagonalGrid() {
      return this.hexagonalGrid.map(cell => {
        const rv = {
          ...cell,
          class: 'board-cells__cell',
          style: {
            top: cell.dimensions.y + 'px',
            left: cell.dimensions.x + 'px',
            width: cell.dimensions.r * 2 + 'px',
            height: cell.dimensions.r * 2 + 'px',
          },
        }
        if (this.selectedCellNeighborIds.includes(cell.id)) {
          rv.class = 'board-cells__cell board-cells__cell--first-nbr'
        }
        return rv
      })
    }
  },
  template: `
    <div>
      <p>
        SELECTED CELL ID: <strong>{{selectedCellId || 'null'}}</strong>
      </p>
      <p>
        SELECTED CELL NEIGHBOR IDS <strong>{{selectedCellNeighborIds}}</strong> 
      </p>
      <template v-for="cell in displayHexagonalGrid">
        <div
          :key="cell.id"
          :style="cell.style"
          :class="cell.class"
          @mouseenter="selectedCellId = cell.id"
          @mouseleave="selectedCellId = null"
        ></div>
      </template>
    </div>`
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