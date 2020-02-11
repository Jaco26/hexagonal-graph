import CanvasUIElement, { Canvas } from './models/canvas/ui-element.js'

function makeRect({ data, children = [] } = {}) {
  return new CanvasUIElement({
    data,
    render(ctx) {
      ctx.strokeStyle = this.data.strokeStyle
      ctx.fillStyle = this.data.fillStyle
      ctx.beginPath()
      ctx.fillRect(this.data.x, this.data.y, this.data.width, this.data.height)
      ctx.closePath()
    },
    children,
  })
}


const canvas = new Canvas()

canvas.children.push(
  makeRect({
    data: {
      x: 400,
      y: 400,
      width: 20,
      height: 20,
      fillStyle: 'blue',
    },
    children: [
      makeRect({
        data: {
          x: 300,
          y: 300,
          width: 40,
          height: 40,
          fillStyle: 'pink',
        }
      })
    ]
  }),
  makeRect({
    data: {
      x: 200,
      y: 200,
      width: 20,
      height: 20,
      fillStyle: 'blue',
    }
  })
)

canvas.render()

window.canvas = canvas