import { valueType, trig, circle } from '../utils.js'

/**
 * @typedef CellDimensions
 * @property {number} x
 * @property {number} y
 * @property {number} r
 */

class Cell {
  /**
   * 
   * @param {number} id 
   * @param {CellDimensions} dimensions 
   */
  constructor(id, dimensions) {
    this.id = id
    this.dimensions = dimensions
  }
}

/**
 * 
 * @param {number} id 
 * @param {Cell} parent 
 * @param {number} angleFromParent 
 * @param {CellDimensions} cellDimensionDefaults 
 */
function makeCell(id, parent, angleFromParent, cellDimensionDefaults) {
  if (!parent) {
    return new Cell(id, cellDimensionDefaults)
  }
  const hypotenuse = cellDimensionDefaults.r * 2
  const sine = trig.sin(angleFromParent)
  const cosine = trig.cos(angleFromParent)
  return new Cell(id, {
    x: Math.round(parent.dimensions.x + cosine * hypotenuse),
    y: Math.round(parent.dimensions.y + sine * hypotenuse),
    r: parent.dimensions.r
  })
}


/**
 * 
 * @param {number} layersRemaining 
 * @param {number} currentLayer 
 * @param {Array} grid 
 * @param {CellDimensions} cellDefaults 
 */
function makeHexagonalGrid(layersRemaining, currentLayer, grid, cellDefaults) {
  if (layersRemaining <= 0) {
    console.log('returning grid', grid)
    return grid
  }
  if (currentLayer === 0) {
    grid.push(makeCell(0, null, null, cellDefaults))
  } else {
    const lengthOfSide = currentLayer
    const prevLayerCellCount = (currentLayer - 1) * 6
    const currentLayerCellCount = currentLayer * 6
    let angle = 0
    for (let i = 0; i < currentLayerCellCount; i++) {
      const id = grid.length
      let parentIndex = 0
      if (lengthOfSide > 1) {
        parentIndex = id - (Math.ceil(i / lengthOfSide) + prevLayerCellCount)
      }
      grid.push(makeCell(id, grid[parentIndex], angle, cellDefaults))
      if (i % lengthOfSide === 0) {
        angle += 60
      }
    }
  }
  return makeHexagonalGrid(--layersRemaining, ++currentLayer, grid, cellDefaults)
}


class Graph {
  constructor() {
    this.data = {}
  }

  addVertex(v) {
    if (!this.data[v]) {
      this.data[v] = {}
    }
  }

  addEdge(v1, v2, angle) {
    this.data[v1][angle] = v2
    let oppositeAngle = circle.findOppositeAngle(angle)
    if (oppositeAngle === 360) {
      oppositeAngle = 0
    }
    this.data[v2][oppositeAngle] = v1
  }
}

/**
 * 
 * @param {CellDimensions} cellDimensions 
 * @param {number} angle 
 */
function calculateNeighborCoords({ x, y, r}, angle) {
  return {
    x: Math.round(x + trig.cos(angle) * (r * 2)),
    y: Math.round(y + trig.sin(angle) * (r * 2)),
  }
}

function getCellByExactCoords(x, y) {
  return {
    /** @param {Cell[]} grid */
    from(grid) {
      return grid.find(cell => cell.dimensions.x === x && cell.dimensions.y === y)
    }
  }
}

/** @param {Cell[]} grid */
function makeAdjacencyListFrom(grid){
  const graph = new Graph()
  grid.forEach(cell => graph.addVertex(cell.id))
  grid.forEach(cell => {
    let angle = 0
    for (let i = 0; i < 6; i++) {
      const nbrCoords = calculateNeighborCoords(cell.dimensions, angle)
      const nbr = getCellByExactCoords(nbrCoords.x, nbrCoords.y).from(grid)
      if (nbr) {
        graph.addEdge(cell.id, nbr.id, angle)
      }
      angle += 60
    }
  })
  return graph.data
}


export default {
  name: 'HexagonalGraph',
  props: ['width', 'height'],
  data() {
    return {
      selectedCellId: null
    }
  },
  computed: {
    grid() {
      return makeHexagonalGrid(4, 0, [], { x: this.width / 2, y: this.height / 2, r: 40 })
    },
    adjacencyList() {
      return makeAdjacencyListFrom(this.grid)
    },
    selectedNeighborIds() {
      return Object.values(this.adjacencyList[this.selectedCellId] || {})
    },
    gridDisplay() {
      return this.grid.map(cell => {
        const rv = {
          id: cell.id,
          class: 'board-cells__cell',
          style: {
            zIndex: cell.id === this.selectedCellId
              ? 100
              : this.selectedNeighborIds.includes(cell.id)
                ? 50
                : 0,
            top: cell.dimensions.y + 'px',
            left: cell.dimensions.x + 'px',
            width: cell.dimensions.r * 2 + 'px',
            height: cell.dimensions.r * 2 + 'px'
          }
        }
        if (this.selectedNeighborIds.includes(cell.id)) {
          rv.class += ' first-nbr'
        }
        return rv
      })
    }
  },
  methods: {
    getCellByExactCoords(x, y) {
      return getCellByExactCoords(x, y).from(this.grid)
    }
  },
  template: `
    <div>
      <template v-for="cell in gridDisplay">
        <div
          :key="cell.id"
          :style="cell.style"
          :class="cell.class"
          @mouseenter="selectedCellId = cell.id"
          @mouseleave="selectedCellId = null"
        ></div>
      </template>
    </div>
  `,
}