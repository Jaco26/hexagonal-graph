import { trig } from '../utils.js'

const RADIUS = 40


class Cell {
  constructor(id, parentId, layer, dimensions) {
    this.id = id
    this.parentId = parentId
    this.layer = layer
    this.dimensions = dimensions
    // this.neighbors = []
  }
}


function makeCell(id, parent, angle, layer, centerCoords) {

  const cellDimensions = { x: centerCoords.x, y: centerCoords.y, r: RADIUS }

  if (!parent) {
    return new Cell(id, null, layer, cellDimensions)
  }

  const hypontenuse = RADIUS * 2

  const sineAngle = trig.sin(angle)
  const cosineAngle = trig.cos(angle)

  cellDimensions.y = parent.dimensions.y + sineAngle * hypontenuse
  cellDimensions.x = parent.dimensions.x +cosineAngle * hypontenuse

  const cell = new Cell(id, parent.id, layer, cellDimensions)

  return cell
}


export class HexagonalGridHeap {
  constructor() {
    /** @type {Cell[]} */
    this.cells = []
  }

  get length() { return this.cells.length }
  
  get(index) {
    return this.cells[index]
  }

  insert(cell) {
    this.cells.push(cell)
  }
}

/**
 * 
 * @param {number} layers 
 * @param {number} currentLayer 
 * @param {HexagonalGridHeap} grid 
 * @param {*} centerCoords 
 */
function makeHexagonalGrid(layers, currentLayer, grid, centerCoords) {
  if (layers <= 0) return grid

  if (currentLayer === 0) {

    grid.insert(makeCell(0, null, null, currentLayer, centerCoords))

  } else {
    // excluding the inital cell in the layer, how many cells are on each side
    const sideLength = currentLayer

    const prevLayerCount = (currentLayer - 1) * 6
    const angleMod = 60
    let angle = 0
    let totalIterations = currentLayer * 6
    for (let i = 0; i < totalIterations; i++) {
      const id = grid.length
      let parentIndex = 0
      if (sideLength > 1) {
        if (i > 0) {
          const mod = Math.ceil(i / sideLength)
          parentIndex = id - (mod + prevLayerCount)
        } else {
          parentIndex = id - prevLayerCount
        }
      }
      grid.insert(makeCell(id, grid.get(parentIndex), angle, currentLayer, centerCoords))

      if (i % sideLength === 0) {
        angle += angleMod
      }
    }
  }
  return makeHexagonalGrid(--layers, ++currentLayer, grid, centerCoords)
}

export default function(centerCoords) {
  return makeHexagonalGrid(4, 0, new HexagonalGridHeap(), centerCoords)
}

/*
  corner cells have 2 children
  middle cells have 1 child

  HERE IS THE PATTERN!!!!

  layer start
  ^^^^^^^^^^^
  19 - (0 + 12) = 7

  side one
  ^^^^^^^^
  20 - (1 + 12) = 7
  21 - (1 + 12) = 8
  22 - (1 + 12) = 9

  side two
  ^^^^^^^^
  23 - (2 + 12) = 9
  24 - (2 + 12) = 10
  25 - (2 + 12) = 11

  side three
  ^^^^^^^^^^
  26 - (3 + 12) = 11
  27 - (3 + 12) = 12
  28 - (3 + 12) = 13


*/