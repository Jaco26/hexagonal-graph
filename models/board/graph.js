import { circle } from '../../utils.js'


export default class Graph {
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