
function degreesToRadians(deg) {
  return deg * (Math.PI / 180)
}

export const trig = {
  sin(angle) {
    return Math.sin(degreesToRadians(angle))
  },
  cos(angle) {
    return Math.cos(degreesToRadians(angle))
  }
}

export const circle = {
  findOppositeAngle(angle) {
    const one = angle + 180
    if (one > 360) {
      return one - 360
    }
    return one
  }
}

export const valueType = {
  isObject(val) {
    return val && !Array.isArray(val) && typeof val === 'object'
  },
  isArray(val) {
    return Array.isArray(val)
  },
  isNull(val) {
    return val === null
  },
  isUndefined(val) {
    return val === undefined
  } 
}
