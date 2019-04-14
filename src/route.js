const methods = require('methods')
const Layer = require('./layer')

module.exports = class Route {
  constructor (path) {
    this.path = path
    this.stack = []
    this.methods = {}
    this._initMethods()
  }

  _initMethods () {
    for (const method of methods) {
      Route.prototype[method] = this._makeRouteFunction.bind(this)(method)
    }
  }

  _makeRouteFunction (method) {
    return (...handles) => {
      for (const handle of handles) {
        if (typeof handle !== 'function') {
          const type = handle.toString()
          const msg = `Route ${method}() requires a callback function but got a ${type}`
          throw new Error(msg)
        }

        const layer = new Layer('/', {}, handle)
        layer.method = method
        this.methods[method] = true
        this.stack.push(layer)
      }

      return this
    }
  }

  dispatch () {
    console.log('yo')
  }
}
