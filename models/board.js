import makeGrid, { HexagonalGridHeap } from './board-grid.js'
import { trig, circle } from '../utils.js'


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
      // the vertices at 360˚ and 0˚ will be the same. so...
      oppositeAngle = 0

    }

    this.data[v2][oppositeAngle] = v1
  }
}



function calculateNeighborCoords({ x, y, r }, angle) {
  return {
    x: Math.round(x + trig.cos(angle) * (r * 2)),
    y: Math.round(y + trig.sin(angle) * (r * 2)),
  }
}


/**
 * 
 * @param {HexagonalGridHeap} grid 
 */
function makeAdjacencyList(grid) {
  const graph = new Graph()

  grid.cells.forEach(cell => graph.addVertex(cell.id))
  grid.cells.forEach(cell => {
    const { id, layer, dimensions } = cell
    let angle = 0
    for (let i = 0; i < 6; i++) {
      angle += i * 60
      const nbr = calculateNeighborCoords(dimensions, angle)

    }
  })

  return graph
}


export default class Board {
  constructor() {
    this.width = 0
    this.height = 0
    /** @type {HexagonalGridHeap} */
    this.grid = null
    this.adjacencyList = null
  }

  _createAdjacencyList() {
    if (this.grid) {

      const graph = new Graph()

      this.grid.cells.forEach(cell => graph.addVertex(cell.id))

      this.grid.cells.forEach(cell => {

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

      return graph

    } else {

      throw new Error('Board.grid is null')

    }
  }

  resize(width, height) {
    this.width = width
    this.height = height
    this.grid = makeGrid({ x: width / 2, y: height / 2 })
    if (!this.adjacencyList) {
      this.adjacencyList = this._createAdjacencyList()
    }
  }

  getCellByExactCoords(x, y) {
    return this.grid.cells.find(cell => cell.dimensions.x === x && cell.dimensions.y === y)
  }

  getCellByCoords(x, y) {
    return this.grid.cells.find(cell => {
      return cell.dimensions.x - cell.dimensions.r < x &&
        cell.dimensions.x + cell.dimensions.r > x &&
        cell.dimensions.y + cell.dimensions.r > y &&
        cell.dimensions.y - cell.dimensions.r < y
    })
  }
}

