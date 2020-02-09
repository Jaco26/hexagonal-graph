import setWatcher, { makeReactiveData } from '../../dep.js'

/**
 * @typedef CanvasUIElementOptions
 * @property {(ctx: CanvasRenderingContext2D)} render
 * @property {CanvasUIElement} parent
 * @property {CanvasUIElement[]} children
 */


export default class CanvasUIElement {
  /**
   * 
   * @param {CanvasUIElementOptions} 
   */
  constructor({ render, data = {}, children = [] } = {}) {

    this.children = children
    this.data = makeReactiveData(data)
    this._render = render
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
    this.elements = []
  }

  render() {
    setWatcher(() => {
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.elements.forEach(child => child.render(this.ctx))
    })
  }
}
