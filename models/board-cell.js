const RADIUS = 40


function degreesToRadians(deg) {
  return deg * (Math.PI / 180)
}

const trig = {
  sin(deg) {
    return Math.sin(degreesToRadians(deg))
  },
  cos(deg) {
    return Math.cos(degreesToRadians(deg))
  }
}


function makeCell(parent, angle, distanceFromCenter) {

  const child = { x: 300, y: 300, r: RADIUS }

  if (!parent) {
    return child
  }

  const hypontenuse = RADIUS * 2

  const sineAngle = trig.sin(angle)
  const cosineAngle = trig.cos(angle)

  child.y = parent.y + Math.floor(sineAngle * hypontenuse)
  child.x = parent.x + Math.floor(cosineAngle * hypontenuse)

  return child
}


class HexagonalGrid {
  constructor() {
    /** @type {Object[][]} */
    this.cells = []
  }

  get length() { return this.cells.length }

  addLayer() {
    this.cells.push([])
  }

  addCellTo(layer, cell) {
    this.cells[layer].push(cell)
  }

  getCellFrom(layer, cellIndex) {
    return this.cells[layer][cellIndex]
  }
}


/**
 * 
 * @param {number} layers 
 * @param {HexagonalGrid} grid 
 */
function makeHexagonalGrid(layers, grid) {
  if (layers <= 0) return grid

  const currentLayer = grid.length

  if (currentLayer === 0) {

    grid.addLayer()
    grid.addCellTo(currentLayer, makeCell())

  } else {

    grid.addLayer()

    const angleMod = 360 / 6
    let parent = grid.getCellFrom(0, 0)

    let angle = 0
    let totalIterations = currentLayer * 6
    for (let i = 0; i < totalIterations; i++) {
      let parentIndex = Math.floor(i / 2)
      if (currentLayer === 1) {
        grid.addCellTo(currentLayer, makeCell(parent, angle))
        angle += angleMod
      } else if (currentLayer === 2) {
        parent = grid.getCellFrom(currentLayer - 1, parentIndex)
        grid.addCellTo(currentLayer, makeCell(parent, angle))
        if (i % 2 === 0) {
          angle += angleMod
        }
      } else if (currentLayer === 3) {
        parent = grid.getCellFrom(currentLayer - 1, parentIndex)
        grid.addCellTo(currentLayer, makeCell(parent, angle))
        if (parentIndex % 2 !== 0) {
          i++
          totalIterations++
        } else if (i % 2 === 0) {
          angle += angleMod
        }
      }
    }
  }

  return makeHexagonalGrid(--layers, grid)
}



export default function() {
  return makeHexagonalGrid(4, new HexagonalGrid())
}



























// const gridEgg = [
//   [makeCell, makeCell, makeCell, makeCell],
// [makeCell, makeCell, makeCell, makeCell, makeCell],
// [makeCell, makeCell, makeCell, makeCell, makeCell, makeCell]
// [makeCell, makeCell, makeCell, makeCell, makeCell, makeCell, makeCell],
// [makeCell, makeCell, makeCell, makeCell, makeCell, makeCell],
// [makeCell, makeCell, makeCell, makeCell, makeCell],
//   [makeCell, makeCell, makeCell, makeCell],
// ]
