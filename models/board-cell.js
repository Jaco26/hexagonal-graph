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

class Cell {
  constructor(id, dimensions) {
    this.id = id
    this.dimensions = dimensions
  }
}


function makeCell(id, parent, angle, centerCoords) {

  const cellDimensions = { x: centerCoords.x, y: centerCoords.y, r: RADIUS }

  if (!parent) {
    return new Cell(id, cellDimensions)
  }

  const hypontenuse = RADIUS * 2

  const sineAngle = trig.sin(angle)
  const cosineAngle = trig.cos(angle)

  cellDimensions.y = parent.dimensions.y + Math.floor(sineAngle * hypontenuse)
  cellDimensions.x = parent.dimensions.x + Math.floor(cosineAngle * hypontenuse)

  return new Cell(id, cellDimensions)
}


class HexagonalGridHeap {
  constructor() {
    /** @type {Object[]} */
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

    grid.insert(makeCell(0, null, null, centerCoords))

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
          parentIndex = calculateParentIndex(id, i, sideLength, prevLayerCount)
        } else {
          parentIndex = id - prevLayerCount
        }
      }
      grid.insert(makeCell(id, grid.get(parentIndex), angle, centerCoords))

      if (i % sideLength === 0) {
        angle += angleMod
      }
    }

  }


  return makeHexagonalGrid(--layers, ++currentLayer, grid, centerCoords)
}


function calculateParentIndex(id, i, sideLength, prevLayerCount) {
  const mod = Math.ceil(i / sideLength)
  console.log({ id, mod, sideLength, prevLayerCount })
  return id - (mod + prevLayerCount)
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


export default function() {
  return makeHexagonalGrid(4, 0, new HexagonalGridHeap(), { x: 300, y: 300 })
}




// // THIS WORKS DO NOT DELETE UNTIL YOU DEFINITLY HAVE SOMETHING BETTER
// // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// class HexagonalGrid {
//   constructor() {
//     /** @type {Object[][]} */
//     this.cells = []
//   }

//   get length() { return this.cells.length }

//   get totalCells() { return this.cells.reduce((acc, layer) => (acc += layer.length), 0) }

//   addLayer() {
//     this.cells.push([])
//   }

//   addCellTo(layer, cell) {
//     this.cells[layer].push(cell)
//   }

//   getCellFrom(layer, cellIndex) {
//     return this.cells[layer][cellIndex]
//   }
// }



// /**
//  * 
//  * @param {number} layers 
//  * @param {HexagonalGrid} grid 
//  */
// function makeHexagonalGrid(layers, grid, centerCoords) {
//   if (layers <= 0) return grid

//   const currentLayer = grid.length

//   if (currentLayer === 0) {

//     grid.addLayer()
//     grid.addCellTo(currentLayer, makeCell(0, null, null, centerCoords))

//   } else {

//     grid.addLayer()

//     const angleMod = 360 / 6
//     let parent = grid.getCellFrom(0, 0)

//     let angle = 0
//     let totalIterations = currentLayer * 6
//     for (let i = 0; i < totalIterations; i++) {
//       const parentIndex = Math.floor(i / 2)
//       const id = grid.totalCells
//       if (currentLayer === 1) {
//         grid.addCellTo(currentLayer, makeCell(id, parent, angle, centerCoords))
//         angle += angleMod
//       } else if (currentLayer === 2) {
//         parent = grid.getCellFrom(currentLayer - 1, parentIndex)
//         grid.addCellTo(currentLayer, makeCell(id, parent, angle, centerCoords))
//         if (i % 2 === 0) {
//           angle += angleMod
//         }
//       } else if (currentLayer === 3) {
//         parent = grid.getCellFrom(currentLayer - 1, parentIndex)
//         grid.addCellTo(currentLayer, makeCell(id, parent, angle, centerCoords))
//         if (parentIndex % 2 !== 0) {
//           i++
//           totalIterations++
//         } else if (i % 2 === 0) {
//           angle += angleMod
//         }
//       }
//     }
//   }

//   return makeHexagonalGrid(--layers, grid, centerCoords)
// }

// export default function() {
//   return makeHexagonalGrid(4, new HexagonalGrid(), { x: 300, y: 300 })
// }

