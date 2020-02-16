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
      this.data[v] = []
    }
  }

  addEdge(v1, v2, angle) {
    this.data[v1].push({ angle, id: v2 })
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



function buildTree(adjacencyList, parentId) {
  const visited = {}
  const layers = []
  function traverse(prevLayerList) {
    const newLayer = []
    prevLayerList.forEach(cellId => {
      const neighbors = adjacencyList[cellId].map(x => x.id)
      visited[cellId] = true
      neighbors.forEach(x => {
        if (!visited[x]) {
          newLayer.push(x)
          visited[x] = true
        }
      })
    })
    if (newLayer.length) {
      layers.push(newLayer)
      traverse(newLayer)
    } else {
      return
    }
  }
  traverse([parentId])
  return layers
}


/*
  Embodied Adjacency
  0: {
    neighbors: {
      1: {
        angle: 0,
        neighbors: { 
          18: { angle: 0, neighbors: { ... } } 
          7: { angle: 60, neighbors: { ... }}
        }
      },
      2: {
        angle: 60,
        neighbors: { 
          8: { angle: 0, neighbors: { ... } },
          9: { angle: 60, neighbors: { ... } } }
      }
    }
  }
   
*/


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
    relativeTreeGraph() {
      return Object.keys(this.adjacencyList).reduce((acc, cellId) => {
        acc[cellId] = buildTree(this.adjacencyList, cellId)
        return acc
      }, {})
    },
    selectedNeighborIds() {
      return Object.values(this.adjacencyList[this.selectedCellId] || {}).map(x => x.id)
    },
    gridDisplay() {
      return this.grid.map(cell => {
        const rv = {
          id: cell.id,
          class: 'board-cells__cell',
          style: {
            top: cell.dimensions.y + 'px',
            left: cell.dimensions.x + 'px',
            width: cell.dimensions.r * 2 + 'px',
            height: cell.dimensions.r * 2 + 'px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }
        }
        if (this.relativeTreeGraph[this.selectedCellId]) {
          this.relativeTreeGraph[this.selectedCellId].forEach((layer, i) => {
            if (layer.includes(cell.id)) {
              rv.class += ` nbr-${i + 1}`
            }
          })
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
    <div class="row">
    <div class="flex">
        <div class="board-cells">
          <template v-for="cell in gridDisplay">
            <div
              :key="cell.id"
              :style="cell.style"
              :class="cell.class"
              @mouseenter="selectedCellId = cell.id"
              @mouseleave="selectedCellId = null"
            >
              {{cell.id}}
            </div>
          </template>
        </div>
      </div>
      <div class="flex">
        <p>
          HOVERED CELL ID: <strong>{{selectedCellId || 'null'}}</strong>
        </p>
        <div>
          HOVERED CELL NEIGHBOR IDS:
          <template v-for="(layer, i) in relativeTreeGraph[selectedCellId] || []">
            <p :key="i">
              LAYER {{i + 1}}: <strong>{{layer}}</strong> 
            </p>
          </template>
        </div>
      </div>
    </div>
  `,
}