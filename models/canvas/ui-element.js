import setWatcher, { makeReactiveData } from '../../dep.js'

/**
 * @typedef CanvasUIElementOptions
 * @property {(ctx: CanvasRenderingContext2D)} render
 * @property {*} data
 * @property {Object<string, (e: Event|MouseEvent)} on
 * @property {CanvasUIElement[]} children
 */


export default class CanvasUIElement {
  /**
   * 
   * @param {CanvasUIElementOptions} 
   */
  constructor({ render, data = {}, on = {}, children = [],  } = {}) {

    this.children = children
    this.data = makeReactiveData(data)
    this._render = render
    this.listeners = {}

    Object.keys(on).forEach(event => {
      this.listeners[event] = on[event].bind(this.data)
    })
  }

  render(ctx) {

    this._render(ctx)

    this.children.forEach(child => child.render(ctx))
  }
}


export class Canvas {
  constructor() {
    this.canvas = document.querySelector('canvas')
    this.width = this.canvas.width = 600
    this.height = this.canvas.height = 600
    this.ctx = this.canvas.getContext('2d')
    this.children = []



    const onClick = (e) => {
      this.children.forEach(child => {
        if (child.listeners.click) {
          child.listeners.click(e)
        }
      })
    }

    const onMousedown = (e) => {

    }

    const onMousemove = (e) => {

    }

    const onMouseup = (e) => {

    }

    this.canvas.addEventListener('click', onClick)
    this.canvas.addEventListener('mousedown', onMousedown)
    this.canvas.addEventListener('mousemove', onMousemove)
    this.canvas.addEventListener('mouseup', onMouseup)

  }

  render() {
    setWatcher(() => {
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.children.forEach(child => child.render(this.ctx))
    })
  }

}
