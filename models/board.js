

const ringMap = [
        0, 1, 2, 3, 
      4, 5, 6, 7, 8, 
    9, 10, 11, 12, 13, 14, 
  15, 16, 17, 18, 19, 20, 21, 
    22, 23, 24, 25, 26, 27,
      28, 29, 30, 31, 32, 
        33, 34, 35, 36,
]

const clockwiseAdjacencyList = [
  [1, 5, 4],
  [2, 6, 5, 0],
  [3, 7, 6, 1],
  [8, 7, 2],
  [0, 5, 10, 9],
  [1, 6, 11, 10, 4, 0],
  [2, 7, 12, 11, 5, 1],
  [3, 8, 13, 12, 6, 2],
  [13, 12, 7, 3],
  [4, 10, 16, 15],
  [5, 11, 17, 16, 9, 4],
  [6, 12, 18, 17, 10, 5],
  [7, 13, 19, 18, 11, 6],
  [8, 14, 20, 19, 12, 7],
  [21, 20, 13, 8],
  [9, 16, 22],
  [10, 17, 23, 22, 15, 9],
  [11, 18, 24, 23, 16, 10],
  [12, 19, 25, 24, 17, 11],
  [13, 20, 26, 25, 18, 12],
  [14, 21, 27, 26, 19, 13],
  [27, 20, 14],
  [16, 23, 28, 15],
  [17, 24, 29, 28, 22, 16],
  [18, 25, 30, 29, 23, 17],
  [19, 26, 31, 30, 24, 18],
  [20, 27, 32, 31, 25, 19],
  [21, 32, 26, 20],
  [23, 29, 33, 22],
  [24, 30, 34, 33, 28, 23],
  [25, 31, 35, 34, 29, 24],
  [26, 32, 36, 35, 30, 25],
  [27, 36, 31, 26],
  [29, 34, 28],
  [30, 35, 33, 29],
  [31, 36, 34, 30],
  [32, 35, 31]
]

const rowLengths = [4, 5, 6, 7, 6, 5, 4]
const rowCellTotals = [4, 9, 15, 22, 28, 33, 37]

function findCurrentRow(cellIndex, rowIndex) {
  // if (cellIndex < )
}


function gemerateCells() {

  return clockwiseAdjacencyList.reduce((acc, nbrs, cellIndex) => {
    let currentRow = 
    acc.push({})
  }, [])
}



export default class Board {
  constructor() {
    this.width = 0
    this.height = 0
    // this.cells = []
  }

  resize(width, height) {
    this.width = width
    this.height = height
    // this.cells = generateCells(width, height)
  }
}















// function findNeighbors(rowLength, rowNumber, cellN) {
//   const upRight = cellN - rowLength > -1 ? cellN - rowLength : null
//   const upLeft = cellN - rowLength + 1 > -1 ? cellN - rowLength + 1 : null
//   const rv = {
//     up: 
//     upRight,
//     right: cellN + 1,
//     downRight: cellN + rowLength + 1,
//     downLeft: cellN + rowLength,
//     left: cellN - 1,
//     upLeft,
//   }
//   return rv
// }

// // /** @param {Number[][]} cells */
// // function createAdjacencyList(cells) {
// //   const accum = {}
// //   cells.forEach((row, rIndex) => {
// //     console.log('Row #:', rIndex)
// //     row.forEach(cellN => {
// //       accum[cellN] = { ...findNeighbors(row.length, rIndex, cellN) }
// //     })
// //   })
// //   return accum
// // }


// // const adjacencyList = createAdjacencyList([
// //   [0, 1, 2, 3],
// //   [4, 5, 6, 7, 8],
// //   [9, 10, 11, 12, 13, 14],
// //   [15, 16, 17, 18, 19, 20, 21],
// //   [22, 23, 24, 25, 26, 27],
// //   [28, 29, 30, 31, 32],
// //   [33, 34, 35, 36],
// // ])



// class Cell {
//   constructor(rowLength, rowNumber, id) {
//     this.id = id
//     this.neighbors = findNeighbors(rowLength, rowNumber, id)
//     console.log(this)
//   }
// }

// const rowLengths = [4, 5, 6, 7, 6, 5, 4]

// function generateCells(width, height) {
//   const accum = []
//   let id = 0
//   for (let row = 0; row < rowLengths.length; row++) {
//     console.log('Row #:', row)
//     for (let c = 0; c < rowLengths[row]; c++) {
//       const cell = new Cell(rowLengths[row], row, id)
//       accum.push(cell)
//       id += 1
//     }
//   }
//   return accum
// }



















// function buildAdjacencyList(rings) {
//   const accum = {}

//   const rowLengths = [4, 5, 6, 7, 6, 5, 4]

//   for (let row = 0; row < rowLengths.length; row++) {
//     const rowLength = rowLengths[row]
//     for (let cell = 0; cell < rowLength; cell++) {

//     }
//   }

// }


// const makeCircle = (x, y, r) => ({ x, y, r })

// function generateCircles(boardWidth, boardHeight) {
//   const rings = [1, 6, 12, 18]

//   const accum = []

//   for (let ring = 0; ring < rings.length; ring++) {
//     for (let c = 0; c < rings[ring]; c++) {

//     }
//   }

//   return accum
// }