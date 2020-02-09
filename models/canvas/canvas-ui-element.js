
import setWatcher from '../../dep.js'
/**
 * @typedef CanvasUIElementBaseOptions
 * @property {number} x
 * @property {number} y
 * @property {CanvasRenderingContext2D} ctx
 * @property {Object<string, (e: Event|MouseEvent)} listeners
 */

class CanvasUIElement {
  /**
   * 
   * @param {CanvasUIElementBaseOptions} options 
   */
  constructor(options) {
    this.x = options.x
    this.y = options.y
    this.ctx = options.ctx
    this.listeners = options.listeners
  }

  _render(sync) {
    setWatcher(() => {
      sync()
    })
  }

}



export class CanvasRect extends CanvasUIElement {
  /**
   * 
   * @param {number} width 
   * @param {number} height 
   * @param {CanvasUIElementBaseOptions} baseOptions 
   */
  constructor(width, height, baseOptions) {
    super(baseOptions)
    this.width = width
    this.height = height
  }

  _sync() {
    this.ctx.beginPath()
    this.ctx.strokeRect(this.x, this.y, this.width, this.height)
    this.ctx.closePath()
  }

  render() {
    this._render(this._sync.bind(this))
  }
}



export class CanvasCircle extends CanvasUIElement {
  /**
   * 
   * @param {number} radius 
   * @param {CanvasUIElementBaseOptions} baseOptions 
   */
  constructor(radius, baseOptions) {
    super(baseOptions)
  }
}