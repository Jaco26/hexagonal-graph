import { valueType, trig } from '../utils.js'

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
 * @param {number} radius 
 * @param {CellDimensions} cellDimensionDefaults 
 */
function makeCell(id, parent, angleFromParent, radius, cellDimensionDefaults) {
  const cell = new Cell(id, cellDimensionDefaults)
  if (!parent) {
    return cell
  }
  const hypotenuse = radius * 2
  const sine = trig.sin(angleFromParent)
  const cosine = trig.cos(angleFromParent)
  cell.dimensions.x = Math.round(parent.dimensions.x + cosine * hypotenuse)
  cell.dimensions.y = Math.round(parent.dimensions.y + sine * hypotenuse)
  return cell
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
    const prevLayerCount = (currentLayer - 1) * 6
    let angle = 0
    for (let i = 0; i < currentLayer * 6; i++) {
      const id = grid.length
      let parentIndex = 0
      if (lengthOfSide > 1) {
        parentIndex = id - (Math.ceil(i / currentLayer) + prevLayerCount)
      }
      grid.push(makeCell(id, grid[parentIndex], angle, currentLayer, cellDefaults))
      if (i % lengthOfSide === 0) {
        angle += 60
      }
    }
  }
  return makeHexagonalGrid(--layersRemaining, ++currentLayer, grid, cellDefaults)
}


export default {
  name: 'HexagonalGraph',
  template: `
    <div>
      Hello from the HexagonalGraph
    </div>
  `,
}