import { valueType } from './utils.js'


let target = null

export default function setWatcher(syncronizer) {
  target = syncronizer
  target()
  target = null
}

export class Dep {
  constructor() {
    this.subscribers = []
  }

  subscribe() {
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target)
    }
  }

  notify() {
    this.subscribers.forEach(syncronizer => syncronizer())
  }
}


/**
 * 
 * @param {Object<string, *>} data 
 * @returns {Object<string, *>}
 */
export function makeReactiveData(data) {
  const accumulator = {};
  (function traverse(accum, obj) {
    Object.keys(obj).forEach(key => {
      if (valueType.isObject(obj[key])) {
        accum[key] = {}
        traverse(accum[key], obj[key])
      } else {
        const dep = new Dep()
        let internalValue = obj[key]
        Object.defineProperty(accum, key, {
          get() {
            dep.subscribe()
            return internalValue
          },
          set(val) {
            internalValue = val
            dep.notify()
          }
        })
      }
    })
  })(accumulator, data)
  return accumulator
}